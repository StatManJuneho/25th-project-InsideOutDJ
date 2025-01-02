import pandas as pd
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
import torch
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import numpy as np

# -------------------------------
# 학습 파라미터 설정
# -------------------------------
MODEL_NAME = "klue/roberta-large"
LEARNING_RATE = 2e-5
MAX_LENGTH = 64
BATCH_SIZE = 16
EPOCHS = 10
OUTPUT_DIR_VALENCE = "result_valence"
OUTPUT_DIR_AROUSAL = "result_arousal"
WARMUP_STEPS = 500
WEIGHT_DECAY = 0.01
LR_SCHEDULER_TYPE = "linear"
SEED = 42

# -------------------------------
# CUDA 설정
# -------------------------------
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# -------------------------------
# 데이터 로드 및 토크나이저 설정
# -------------------------------
df = pd.read_csv("감정데이터_v3.csv")
raw_ds = Dataset.from_pandas(df)

train_test_split = raw_ds.train_test_split(test_size=0.2, seed=SEED)
test_valid_split = train_test_split['test'].train_test_split(test_size=0.5, seed=SEED)

raw_train_ds = train_test_split['train']
raw_val_ds = test_valid_split['train']
raw_test_ds = test_valid_split['test']

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

# -------------------------------
# 클래스별 가중치 계산
# -------------------------------
# Valence 가중치 계산
valence_counts = df["valence"].value_counts().sort_index()
valence_weights = 1.0 / valence_counts
valence_weights /= valence_weights.sum()

print("Valence class weights:", valence_weights)

# Arousal 가중치 계산
arousal_counts = df["arousal"].value_counts().sort_index()
arousal_weights = 1.0 / arousal_counts
arousal_weights /= arousal_weights.sum()

print("Arousal class weights:", arousal_weights)


# -------------------------------
# 데이터 전처리 함수 설정
# -------------------------------
def preprocess_valence(examples):
    inputs = tokenizer(examples["sentence"], truncation=True, padding="max_length", max_length=MAX_LENGTH)
    inputs["labels"] = torch.tensor(examples["valence"], dtype=torch.float32).to(device)
    return inputs

def preprocess_arousal(examples):
    inputs = tokenizer(examples["sentence"], truncation=True, padding="max_length", max_length=MAX_LENGTH)
    inputs["labels"] = torch.tensor(examples["arousal"], dtype=torch.float32).to(device)
    return inputs

# valence 예측을 위한 데이터셋 전처리 (arousal 제거)
columns_to_remove_valence = ["Unnamed: 0", "sentence", "arousal"]
train_ds_valence = raw_train_ds.map(preprocess_valence, remove_columns=columns_to_remove_valence)
val_ds_valence = raw_val_ds.map(preprocess_valence, remove_columns=columns_to_remove_valence)

# arousal 예측을 위한 데이터셋 전처리 (valence 제거)
columns_to_remove_arousal = ["Unnamed: 0", "sentence", "valence"]
train_ds_arousal = raw_train_ds.map(preprocess_arousal, remove_columns=columns_to_remove_arousal)
val_ds_arousal = raw_val_ds.map(preprocess_arousal, remove_columns=columns_to_remove_arousal)

# -------------------------------
# Custom Trainer 클래스 정의 (가중치 적용)
# -------------------------------
class WeightedRegressionTrainer(Trainer):
    def __init__(self, *args, **kwargs):
        self.class_weights = kwargs.pop('class_weights')
        super().__init__(*args, **kwargs)

    def compute_loss(self, model, inputs, return_outputs=False):
        labels = inputs.pop("labels")
        outputs = model(**inputs)
        logits = outputs.logits[:, 0]
        
        # 가중치 적용
        weights = torch.tensor([self.class_weights.get(l.item(), 1.0) for l in labels]).to(logits.device)
        loss = torch.nn.functional.mse_loss(logits, labels, reduction='none')
        weighted_loss = loss * weights
        weighted_loss = weighted_loss.mean()
        
        return (weighted_loss, outputs) if return_outputs else weighted_loss

# -------------------------------
# 정확도 계산 함수 설정
# -------------------------------
def compute_metrics_for_regression(p):
    preds = np.clip(np.round(p.predictions.flatten()), -1, 1)  # 예측값을 -1, 0, 1로 라운딩 
    labels = p.label_ids
    
    accuracy = np.mean(preds == labels)  # 정확도 계산
    
    mse = mean_squared_error(labels, preds)
    mae = mean_absolute_error(labels, preds)
    r2 = r2_score(labels, preds)

    # 각 클래스별 MAE 계산
    unique_labels = np.unique(labels)
    class_maes = []
    
    for cls in unique_labels:
        cls_mask = labels == cls
        cls_preds = preds[cls_mask]
        cls_labels = labels[cls_mask]
        
        cls_mae = mean_absolute_error(cls_labels, cls_preds)
        class_maes.append(cls_mae)
    
    # Macro-Averaged MAE 계산
    macro_mae = np.mean(class_maes)

    return {
        "mse": mse,
        "mae": mae,
        "r2": r2,
        "accuracy": accuracy,
        "macro mae": macro_mae
    }

# -------------------------------
# valence 모델 학습 설정 및 학습
# -------------------------------

training_args_valence = TrainingArguments(
    output_dir=OUTPUT_DIR_VALENCE,
    learning_rate=LEARNING_RATE,
    per_device_train_batch_size=BATCH_SIZE,
    per_device_eval_batch_size=BATCH_SIZE,
    num_train_epochs=EPOCHS,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    logging_strategy="epoch",
    save_total_limit=2,
    load_best_model_at_end=True,
    weight_decay=WEIGHT_DECAY,
    warmup_steps=WARMUP_STEPS,
    lr_scheduler_type=LR_SCHEDULER_TYPE,
    metric_for_best_model="macro_mae"
)

model_valence = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=1).to(device)

trainer_valence = WeightedRegressionTrainer(
    model=model_valence,
    args=training_args_valence,
    train_dataset=train_ds_valence,
    eval_dataset=val_ds_valence,
    class_weights=valence_weights,
    compute_metrics=compute_metrics_for_regression  # 수정된 정확도 계산 사용
)

trainer_valence.train()

# Save the valence model's state_dict
torch.save(model_valence.state_dict(), f"{OUTPUT_DIR_VALENCE}_state_dict.pth")
print(f"Valence model state_dict saved to {OUTPUT_DIR_VALENCE}_state_dict.pth")

del model_valence
torch.cuda.empty_cache()

# -------------------------------
# arousal 모델 학습 설정 및 학습
# -------------------------------
training_args_arousal = TrainingArguments(
    output_dir=OUTPUT_DIR_AROUSAL,
    learning_rate=LEARNING_RATE,
    per_device_train_batch_size=BATCH_SIZE,
    per_device_eval_batch_size=BATCH_SIZE,
    num_train_epochs=EPOCHS,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    logging_strategy="epoch",
    save_total_limit=2,
    load_best_model_at_end=True,
    weight_decay=WEIGHT_DECAY,
    warmup_steps=WARMUP_STEPS,
    lr_scheduler_type=LR_SCHEDULER_TYPE,
    metric_for_best_model="macro_mae"
)

model_arousal = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=1).to(device)

trainer_arousal = WeightedRegressionTrainer(
    model=model_arousal,
    args=training_args_arousal,
    train_dataset=train_ds_arousal,
    eval_dataset=val_ds_arousal,
    class_weights=arousal_weights,
    compute_metrics=compute_metrics_for_regression  # 수정된 정확도 계산 사용
)

trainer_arousal.train()


# Save the arousal model's state_dict
torch.save(model_arousal.state_dict(), f"{OUTPUT_DIR_AROUSAL}_state_dict.pth")
print(f"Arousal model state_dict saved to {OUTPUT_DIR_AROUSAL}_state_dict.pth")