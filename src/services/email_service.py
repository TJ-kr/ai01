import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from src.utils.config import get_settings
from src.utils.logger import get_logger

logger = get_logger(__name__)

class EmailService:
    def __init__(self):
        self.settings = get_settings()
        self.smtp_host = self.settings.EMAIL_SMTP_HOST
        self.smtp_port = self.settings.EMAIL_SMTP_PORT
        self.username = self.settings.EMAIL_USERNAME
        self.password = self.settings.EMAIL_PASSWORD

    async def send_email(self, to_email: str, subject: str, content: str) -> dict:
        """
        이메일을 비동기적으로 발송합니다.
        """
        message = MIMEMultipart()
        message["From"] = self.username
        message["To"] = to_email
        message["Subject"] = subject
        
        message.attach(MIMEText(content, "html"))

        try:
            async with aiosmtplib.SMTP(hostname=self.smtp_host, port=self.smtp_port) as smtp:
                await smtp.starttls()
                await smtp.login(self.username, self.password)
                await smtp.send_message(message)
                
            logger.info(f"Email sent to {to_email}")
            return {"status": "success", "to": to_email}
            
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            raise 