from functools import lru_cache
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Google Form 설정
    GOOGLE_FORM_ID: str
    
    # 이메일 설정
    EMAIL_SMTP_HOST: str
    EMAIL_SMTP_PORT: int
    EMAIL_USERNAME: str
    EMAIL_PASSWORD: str
    
    # 로깅 설정
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings() 