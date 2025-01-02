import torch
import torch.nn as nn
from transformers import BertTokenizer, BertModel, BertForSequenceClassification, AutoModel, AutoTokenizer, AutoModelForSequenceClassification, AutoConfig
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from keybert import KeyBERT
from sentence_transformers import SentenceTransformer
import kss
import ast
import nltk
from nltk.corpus import stopwords
import re

# GPU/CPU 설정
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# valence 모델 불러오기
valence_model = AutoModelForSequenceClassification.from_pretrained('./checkpoint-25060', num_labels=1)
valence_model = valence_model.to(device)
valence_model.eval()

# arousal 모델 불러오기
arousal_model = AutoModelForSequenceClassification.from_pretrained('./checkpoint-43855', num_labels=1)
arousal_model = arousal_model.to(device)
arousal_model.eval()

# 토크나이저 불러오기
tokenizer = AutoTokenizer.from_pretrained('klue/roberta-large')


def split_sentences(paragraph):
    # 줄바꿈 문자를 공백으로 대체
    clean_paragraph = paragraph.replace('\n', ' ')
    return kss.split_sentences(clean_paragraph)

def predict_emotion(valence_model, arousal_model, tokenizer, sentence, device='cuda' if torch.cuda.is_available() else 'cpu'):
    encoding = tokenizer.encode_plus(
        sentence,
        add_special_tokens=True,
        max_length=64,
        return_token_type_ids=False,
        padding='max_length',
        truncation=True,
        return_attention_mask=True,
        return_tensors='pt',
    )

    input_ids = encoding['input_ids'].to(device)
    attention_mask = encoding['attention_mask'].to(device)

    with torch.no_grad():
        valence_output = valence_model(input_ids=input_ids, attention_mask=attention_mask)
        arousal_output = arousal_model(input_ids=input_ids, attention_mask=attention_mask)

    # 예측 결과를 라운딩하여 -1, 0, 1 값으로 변환
    valence_prediction = np.round(valence_output.logits.cpu().numpy().flatten()[0])
    arousal_prediction = np.round(arousal_output.logits.cpu().numpy().flatten()[0])

    return (valence_prediction, arousal_prediction)

def calculate_paragraph_emotion(paragraph):
    sentences = split_sentences(paragraph)
    total_x, total_y = 0, 0

    print("Input Paragraph:")
    print(paragraph)
    print("\nAnalyzed Sentences and Their Emotions:")

    for sentence in sentences:
        emotion_vector = predict_emotion(valence_model, arousal_model, tokenizer, sentence)
        total_x += emotion_vector[0]
        total_y += emotion_vector[1]

        # 각 문장의 감정 분석 결과 출력
        print(f"Sentence: {sentence}")
        print(f"Valence: {emotion_vector[0]}, Arousal: {emotion_vector[1]}\n")

    normalized_emotion = (total_x / len(sentences), total_y / len(sentences))
    normalized_emotion = (round(normalized_emotion[0], 2), round(normalized_emotion[1], 2))
    return normalized_emotion

def get_quadrant(x, y):
    if x >= 0 and y >= 0:
        return 1
    elif x < 0 and y > 0:
        return 2
    elif x < 0 and y <= 0:
        return 3
    else:
        return 4

def calculate_distance(x, y):
    return np.sqrt(x**2 + y**2)

# ~10% : 0.1858614651388976
# ~40% : 0.40769894062031914
# ~70% : 0.6352747241405549

def filter_by_intensity(df, distance):
    if distance <= 0.2:
        intensity_label = 'neutral'
    elif 0.2 < distance <= 0.5:
        intensity_label = 'low'
    elif 0.5 < distance <= 0.8:
        intensity_label = 'medium'
    else:
        intensity_label = 'high'

    # neutral의 경우 사분면과 상관없이 모든 neutral 노래를 반환
    if intensity_label == 'neutral':
        return df[df['intensity'] == intensity_label]
    else:
        return df[df['intensity'] == intensity_label]


def get_songs_by_emotion_and_intensity(df, normalized_emotion):
    distance = calculate_distance(*normalized_emotion)
    filtered_df = filter_by_intensity(df, distance)
    
    # neutral이 아닌 경우 감정 사분면으로 필터링
    if distance > 0.19:
        quadrant = get_quadrant(*normalized_emotion)
        filtered_df = filtered_df[filtered_df['emotion'] == quadrant]
    
    return filtered_df

# NLTK의 불용어 사전 다운로드
nltk.download('stopwords')

# 한국어 불용어 로드
with open('./stopwords-ko.txt', 'r', encoding='utf-8') as f:
    korean_stopwords = f.read().splitlines()

# 한국어 불용어를 텍스트에서 제거하는 함수
def remove_korean_stopwords(text, stopwords):
    pattern = re.compile(r'\b(' + '|'.join(stopwords) + r')\b')
    return pattern.sub('', text)

def extract_keywords(text, kw_model):
    # 한국어 불용어 제거
    text = remove_korean_stopwords(text, korean_stopwords)
    # 키워드 추출
    keywords = kw_model.extract_keywords(text, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=5)
    return [kw[0] for kw in keywords]

def embed_keywords(keywords, sbert_model):
    embeddings = sbert_model.encode(keywords)
    return embeddings


def calculate_similarity(input_embedding, song_embedding):
    # 입력 임베딩을 평균으로 줄여서 차원을 맞춤
    input_embedding = np.mean(np.array(input_embedding), axis=0).reshape(1, -1)
    song_embedding = np.array(song_embedding).reshape(1, -1)

    # 차원이 다르면 예외를 발생시키지 않고 맞추기 위해 필요한 처리를 적용
    if input_embedding.shape[1] != song_embedding.shape[1]:
        min_dim = min(input_embedding.shape[1], song_embedding.shape[1])
        input_embedding = input_embedding[:, :min_dim]
        song_embedding = song_embedding[:, :min_dim]

    return cosine_similarity(input_embedding, song_embedding)[0][0]

# quadrant와 intensity에 따라 적절한 코멘트를 제공하는 함수
def get_comment_by_emotion_and_intensity(quadrant, intensity):
    comments = {
        "neutral": "평범한 하루를 보내셨군요.",
        (1, "high"): "많이 행복한 하루를 보내셨군요! 내일도 오늘처럼 행복하세요",
        (1, "medium"): "행복한 기분이 느껴지네요.",
        (1, "low"): "조금 행복한 하루를 보내셨군요. 내일은 더 행복한 하루가 될거에요",
        (2, "high"): "아주 힘든 하루를 보내셨군요. 금방 훌훌 털어버리기를 바랄게요.",
        (2, "medium"): "힘든 하루에 노래를 들으면서 잠시 쉬어보는건 어떨까요.",
        (2, "low"): "조금 힘든 하루를 보내셨군요. 내일은 힘들지 않기를 바랄게요.",
        (3, "high"): "힘든 하루를 보내셨군요. 힘내세요!",
        (3, "medium"): "많이 지치고 힘든 하루였군요.",
        (3, "low"): "조금 힘든 하루였을 것 같아요.",
        (4, "high"): "아주 편안한 하루를 지내셨나봐요.",
        (4, "medium"): "편안함이 느껴지네요. 재충전의 시간을 가져봐요",
        (4, "low"): "평범한 일상에서 벗어나 잠시 휴식을 취해보는건 어떨까요?",
    }

    if intensity == 'neutral':
        return comments['neutral']
    else:
        return comments.get((quadrant, intensity), "기분이 복잡하셨던 것 같아요.")

def recommend_songs(paragraph, df_path='./tracks_final.csv'):
    # 감정 분석을 수행하고, 그 결과를 반환할 데이터에 포함시킴
    normalized_emotion = calculate_paragraph_emotion(paragraph)
    
    # 감정 분석 결과를 사전 형태로 준비
    emotion_analysis_result = {
        "normalized_emotion": {
            "x": normalized_emotion[0],
            "y": normalized_emotion[1]
        }
    }
    
    # 추천된 노래 목록을 계산
    df = pd.read_csv(df_path)
    matching_songs = get_songs_by_emotion_and_intensity(df, normalized_emotion)
    
    # 키워드 임베딩 및 유사도 계산
    sbert_model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
    kw_model = KeyBERT(model=sbert_model)


    input_keywords = extract_keywords(paragraph, kw_model)
    input_embedding = embed_keywords(input_keywords, sbert_model)

    matching_songs['keyword_embedding'] = matching_songs['keyword_embedding'].apply(ast.literal_eval)
    matching_songs['similarity'] = matching_songs['keyword_embedding'].apply(lambda x: calculate_similarity(input_embedding, x))
    
    # 추천된 상위 5개의 노래를 추출
    top_5_songs = matching_songs.sort_values(by='similarity', ascending=False).head(5)
    top_5_songs_data = top_5_songs[['track_name', 'artist_name', 'uri']].to_dict(orient='records')
    
    # 감정 분석 결과와 추천된 노래 목록을 함께 반환
    quadrant = get_quadrant(float(normalized_emotion[0]), float(normalized_emotion[1]))
    distance = calculate_distance(float(normalized_emotion[0]), float(normalized_emotion[1]))
    intensity = filter_by_intensity(df, distance)['intensity'].iloc[0]

    comment = get_comment_by_emotion_and_intensity(quadrant, intensity)
    
    return {
        "emotion_analysis": emotion_analysis_result,
        # 코멘트 추가할거면 코멘트 추가하고 아래 print문도 각주해제
        #"comment": comment,
        "recommended_songs": top_5_songs_data
    }


# 예시 문단 입력
paragraph = """
오늘 너무 행복했어. 정말 행복했어. 커피를 마셨어. 하지만 과제가 많아서 짜증났어. 너무 화가 나!
"""

# 노래 추천 실행
recommendation_result = recommend_songs(paragraph)

# 결과 출력
print("Emotion Analysis Result:")
print(recommendation_result["emotion_analysis"])

# 코멘트 추가 프린트문
# print("\nComment:")
# print(recommendation_result["comment"])

print("\nRecommended Songs:")
for song in recommendation_result["recommended_songs"]:
    print(f"Track: {song['track_name']}, Artist: {song['artist_name']}, URI: {song['uri']}")
