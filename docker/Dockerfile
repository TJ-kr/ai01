FROM python:3.9-slim

WORKDIR /app

# 시스템 의존성 설치
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 파이썬 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY src/ src/

# 환경 변수 설정
ENV PYTHONPATH=/app

# 포트 설정
EXPOSE 8000

# 애플리케이션 실행
CMD ["uvicorn", "src.api.server:app", "--host", "0.0.0.0", "--port", "8000"] 