# fe/Dockerfile
FROM node

WORKDIR /workspace

# package.json과 package-lock.json 파일을 복사
COPY package*.json ./

# npm install을 실행하여 의존성 설치
RUN npm install

# 모든 소스 코드를 복사
COPY . .

# 애플리케이션 시작
CMD ["npm", "start"]