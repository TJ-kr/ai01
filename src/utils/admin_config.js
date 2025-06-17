// 관리자 설정
const ADMIN_CONFIG = {
  superAdmin: {
    email: "locolorinc@gmail.com",
    notifications: {
      realtime: true,    // 실시간 알림 활성화
      daily: true,       // 일일 리포트 활성화
      weekly: false,     // 주간 리포트 비활성화 (초기 운영시)
      errorAlerts: true  // 오류 알림 활성화
    }
  },
  
  alertThresholds: {
    bulkOrder: 500,    // 대량 주문 기준 수량
    errorRetry: 3,     // 오류 재시도 횟수
    dailyLimit: 100    // 일일 처리 제한
  },
  
  reportSchedule: {
    daily: "0 9 * * 1-5",    // 평일 아침 9시
    timezone: "Asia/Seoul"
  }
};

// 알림 메시지 템플릿
const NOTIFICATION_TEMPLATES = {
  bulkOrder: {
    subject: "[로컬러] 대량 주문 문의 알림",
    body: "대량 주문 문의가 접수되었습니다.\n" +
          "제품: {제품명}\n" +
          "수량: {수량}개\n" +
          "고객 이메일: {고객이메일}"
  },
  error: {
    subject: "[로컬러] 시스템 오류 알림",
    body: "시스템 오류가 발생했습니다.\n" +
          "시간: {발생시간}\n" +
          "오류 내용: {오류내용}"
  },
  dailyReport: {
    subject: "[로컬러] 일일 견적 문의 리포트",
    body: "■ 일일 견적 문의 현황 ({날짜})\n" +
          "총 문의 건수: {총건수}건\n" +
          "처리 완료: {성공건수}건\n" +
          "처리 실패: {실패건수}건\n\n" +
          "■ 제품별 문의 현황\n" +
          "{제품별통계}\n\n" +
          "■ 특이사항\n" +
          "{특이사항}"
  }
};

module.exports = {
  ADMIN_CONFIG,
  NOTIFICATION_TEMPLATES
}; 