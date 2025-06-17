import logging
from src.utils.config import get_settings

def get_logger(name: str) -> logging.Logger:
    """
    로거 인스턴스를 생성하고 반환합니다.
    """
    settings = get_settings()
    
    logger = logging.getLogger(name)
    logger.setLevel(settings.LOG_LEVEL)
    
    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    
    return logger 