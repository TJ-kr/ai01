from src.services.email_service import EmailService
from src.services.form_service import FormService
from src.utils.logger import get_logger

logger = get_logger(__name__)

class ResponseHandler:
    def __init__(self):
        self.email_service = EmailService()
        self.form_service = FormService()

    async def process_response(self, response: dict) -> dict:
        """
        구글 폼 응답을 처리하고 이메일을 발송합니다.
        """
        try:
            # 응답 데이터 검증
            validated_data = self.form_service.validate_response(response)
            
            # 이메일 템플릿 생성
            email_content = self.form_service.generate_email_content(validated_data)
            
            # 이메일 발송
            result = await self.email_service.send_email(
                to_email=validated_data["email"],
                subject=validated_data["subject"],
                content=email_content
            )
            
            logger.info(f"Email sent successfully to {validated_data['email']}")
            return result
            
        except Exception as e:
            logger.error(f"Error processing form response: {str(e)}")
            raise 