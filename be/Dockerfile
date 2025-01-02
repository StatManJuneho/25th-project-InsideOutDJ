# be/Dockerfile

# Python 3.9 이미지 사용
FROM python:3.9

# 작업 디렉토리 설정
WORKDIR /workspace

# 시스템 패키지 업데이트 및 설치
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 프로젝트의 requirements.txt 복사
COPY requirements.txt ./

# requirements.txt에 정의된 패키지 설치
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

# Uvicorn을 사용하여 FastAPI 애플리케이션 실행
# Dockerfile에서 CMD 명령어 수정
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]