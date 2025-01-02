import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from transformers import BertTokenizer, BertModel, BertForSequenceClassification
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split
from sklearn.metrics import f1_score, classification_report
import numpy as np

# 학습 파라미터 설정
DATA_PATH = '감정데이터_최종2.csv'  # 데이터 파일 경로
MODEL_NAME = 'monologg/kobert'  # 사전 훈련된 KoBERT 모델 이름
BATCH_SIZE = 16  # 배치 크기
MAX_LEN = 64  # 최대 시퀀스 길이
LEARNING_RATE = 2e-5  # 학습률
EPOCHS = 5  # 총 에포크 수
DROPOUT_PROB = 0.3  # 드롭아웃 확률
DEVICE = 'cuda' if torch.cuda.is_available() else 'cpu'  # 학습에 사용할 디바이스

# 데이터 로드 및 전처리
df = pd.read_csv(DATA_PATH)
df['valence'] = df['valence'].map({-1: 0, 0: 1, 1: 2})
df['arousal'] = df['arousal'].map({-1: 0, 0: 1, 1: 2})

# KoBERT 토크나이저 및 모델 로드
tokenizer = BertTokenizer.from_pretrained(MODEL_NAME)

# Custom Dataset 클래스 정의
class SentimentDataset(Dataset):
    def __init__(self, sentences, valences, arousals, tokenizer, max_len):
        self.sentences = sentences
        self.valences = valences
        self.arousals = arousals
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.sentences)

    def __getitem__(self, idx):
        sentence = self.sentences[idx]
        valence = self.valences[idx]
        arousal = self.arousals[idx]

        encoding = self.tokenizer.encode_plus(
            sentence,
            add_special_tokens=True,
            max_length=self.max_len,
            return_token_type_ids=False,
            padding='max_length',
            truncation=True,
            return_attention_mask=True,
            return_tensors='pt',
        )

        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'valence': torch.tensor(valence, dtype=torch.long),
            'arousal': torch.tensor(arousal, dtype=torch.long)
        }

# 데이터 분리 및 DataLoader 설정
train_data, test_data = train_test_split(df, test_size=0.2, random_state=42)

train_dataset = SentimentDataset(
    sentences=train_data['sentence'].to_numpy(),
    valences=train_data['valence'].to_numpy(),
    arousals=train_data['arousal'].to_numpy(),
    tokenizer=tokenizer,
    max_len=MAX_LEN
)

test_dataset = SentimentDataset(
    sentences=test_data['sentence'].to_numpy(),
    valences=test_data['valence'].to_numpy(),
    arousals=test_data['arousal'].to_numpy(),
    tokenizer=tokenizer,
    max_len=MAX_LEN
)

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False)

# KoBERT 모델 정의
class KoBERTMultitaskModel(nn.Module):
    def __init__(self, n_classes, dropout_prob):
        super(KoBERTMultitaskModel, self).__init__()
        self.bert = BertModel.from_pretrained(MODEL_NAME)
        self.drop = nn.Dropout(p=dropout_prob)
        self.out_valence = nn.Linear(self.bert.config.hidden_size, n_classes)
        self.out_arousal = nn.Linear(self.bert.config.hidden_size, n_classes)

    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        pooled_output = self.drop(outputs.pooler_output)
        valence_output = self.out_valence(pooled_output)
        arousal_output = self.out_arousal(pooled_output)
        return valence_output, arousal_output

# 모델 초기화
model = KoBERTMultitaskModel(n_classes=3, dropout_prob=DROPOUT_PROB)
model = model.to(DEVICE)

# 손실 함수와 옵티마이저 정의
loss_fn = nn.CrossEntropyLoss().to(DEVICE)
optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

# 모델 학습 함수
def train_epoch(model, data_loader, loss_fn, optimizer, device):
    model = model.train()
    losses = []
    correct_predictions_valence = 0
    correct_predictions_arousal = 0

    for data in data_loader:
        input_ids = data['input_ids'].to(device)
        attention_mask = data['attention_mask'].to(device)
        valence_targets = data['valence'].to(device)
        arousal_targets = data['arousal'].to(device)

        valence_outputs, arousal_outputs = model(
            input_ids=input_ids,
            attention_mask=attention_mask
        )

        valence_loss = loss_fn(valence_outputs, valence_targets)
        arousal_loss = loss_fn(arousal_outputs, arousal_targets)

        loss = valence_loss + arousal_loss

        correct_predictions_valence += torch.sum(torch.argmax(valence_outputs, dim=1) == valence_targets)
        correct_predictions_arousal += torch.sum(torch.argmax(arousal_outputs, dim=1) == arousal_targets)

        losses.append(loss.item())

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

    return correct_predictions_valence.double() / len(data_loader.dataset), correct_predictions_arousal.double() / len(data_loader.dataset), np.mean(losses)

# 모델 평가 함수
def eval_model_with_metrics(model, data_loader, loss_fn, device):
    model = model.eval()
    losses = []
    valence_preds = []
    arousal_preds = []
    valence_targets_all = []
    arousal_targets_all = []

    with torch.no_grad():
        for data in data_loader:
            input_ids = data['input_ids'].to(device)
            attention_mask = data['attention_mask'].to(device)
            valence_targets = data['valence'].to(device)
            arousal_targets = data['arousal'].to(device)

            valence_outputs, arousal_outputs = model(
                input_ids=input_ids,
                attention_mask=attention_mask
            )

            valence_loss = loss_fn(valence_outputs, valence_targets)
            arousal_loss = loss_fn(arousal_outputs, arousal_targets)

            loss = valence_loss + arousal_loss
            losses.append(loss.item())

            valence_preds.extend(torch.argmax(valence_outputs, dim=1).cpu().numpy())
            arousal_preds.extend(torch.argmax(arousal_outputs, dim=1).cpu().numpy())
            valence_targets_all.extend(valence_targets.cpu().numpy())
            arousal_targets_all.extend(arousal_targets.cpu().numpy())

    valence_f1 = f1_score(valence_targets_all, valence_preds, average='weighted')
    arousal_f1 = f1_score(arousal_targets_all, arousal_preds, average='weighted')
    
    print("Valence Classification Report:")
    print(classification_report(valence_targets_all, valence_preds))
    
    print("Arousal Classification Report:")
    print(classification_report(arousal_targets_all, arousal_preds))
    
    return valence_f1, arousal_f1, np.mean(losses)

# 학습 과정 실행 시 F1-score 계산 포함
for epoch in range(EPOCHS):
    train_acc_valence, train_acc_arousal, train_loss = train_epoch(
        model,
        train_loader,
        loss_fn,
        optimizer,
        DEVICE
    )

    print(f'Epoch {epoch + 1}/{EPOCHS}')
    print(f'Train valence accuracy: {train_acc_valence}, Train arousal accuracy: {train_acc_arousal}, Train loss: {train_loss}')

    val_f1_valence, val_f1_arousal, val_loss = eval_model_with_metrics(
        model,
        test_loader,
        loss_fn,
        DEVICE
    )

    print(f'Validation valence F1: {val_f1_valence}, Validation arousal F1: {val_f1_arousal}, Validation loss: {val_loss}')

# 학습 완료 후 모델 저장
torch.save(model, '순서형회귀모델_v1.pth')



