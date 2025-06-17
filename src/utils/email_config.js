// 이메일 발송 설정
const EMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: 'locolorinc@gmail.com',
    // 실제 비밀번호 대신 Gmail 앱 비밀번호 사용 필요
    // https://myaccount.google.com/apppasswords 에서 생성
    password: process.env.GMAIL_APP_PASSWORD
  },
  sender: {
    name: '로컬러 생산팀',
    email: 'product@locolor.kr',  // 표시될 발신자 주소
    replyTo: 'product@locolor.kr' // 답장 받을 주소
  },
  limits: {
    dailyQuota: 450,  // Gmail 일일 발송 한도 (여유 설정)
    batchSize: 50,    // 동시 발송 최대 수량
    retryCount: 3     // 발송 실패시 재시도 횟수
  }
};

// 이메일 템플릿 설정
const EMAIL_TEMPLATES = {
  quotation: {
    subject: '[로컬러] {제품명} 견적 문의에 대한 답변입니다.',
    template: 'quotation.html'
  },
  error: {
    subject: '[로컬러] 견적 문의 처리 지연 안내',
    template: 'error.html'
  },
  bulk: {
    subject: '[로컬러] 대량 주문 견적 문의 접수 안내',
    template: 'bulk.html'
  }
};

module.exports = {
  EMAIL_CONFIG,
  EMAIL_TEMPLATES
}; 