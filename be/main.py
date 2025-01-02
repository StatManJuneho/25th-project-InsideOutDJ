# main.py
from fastapi import FastAPI, Body
from model_lib import recommend_songs
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
# CORS 설정 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React 앱이 실행되는 도메인 (예: 포트 3000)
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드를 허용
    allow_headers=["*"],  # 모든 헤더를 허용
)

@app.post("/generate_playlist")
def generate_playlist(diary: str = Body(..., example="오늘 하루는 정말 힘들었어...")):
    # 모델을 통해 추천된 노래 목록을 얻음
    print(f"Received diary: {diary}")
    songs = recommend_songs(diary)
    return {"recommended_songs": songs}