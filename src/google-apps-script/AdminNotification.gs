// 관리자 알림 시스템
// 향후 구현 예정 기능

const ADMIN_CONFIG = {
  adminEmail: 'locolorinc@gmail.com',
  notificationThreshold: 1000, // 대량 주문 기준 수량
  enableNotifications: false   // 현재 비활성화
};

/**
 * 관리자에게 특별 주문 알림을 발송하는 함수
 * @param {Object} orderData - 주문 데이터
 * @param {string} orderData.timestamp - 주문 시간
 * @param {string} orderData.item - 제품명
 * @param {string} orderData.qty - 수량
 * @param {string} orderData.email - 고객 이메일
 */
function sendAdminNotification(orderData) {
  if (!ADMIN_CONFIG.enableNotifications) {
    console.log('관리자 알림이 비활성화되어 있습니다.');
    return;
  }

  try {
    const { timestamp, item, qty, email } = orderData;
    
    const adminSubject = `[로컬러 관리자 알림] ${item} 대량/특별 문의`;
    const adminBody = `
특별 주문 접수 알림

- 시간: ${timestamp}
- 제품: ${item}
- 수량: ${qty}
- 고객 이메일: ${email}

* 확인 후 대응 필요`;

    GmailApp.sendEmail(ADMIN_CONFIG.adminEmail, adminSubject, adminBody);
    console.log('관리자 알림 발송 완료');
    
  } catch (error) {
    console.error('관리자 알림 발송 실패: ' + error.toString());
  }
}

/**
 * 대량 주문 여부를 확인하는 함수
 * @param {string} item - 제품명
 * @param {string} qty - 수량
 * @returns {boolean} 대량 주문 여부
 */
function isLargeOrder(item, qty) {
  const productInfo = CONFIG.productInfo[item];
  
  // CONFIG에 정의되지 않은 제품이거나 수량이 기준 이상인 경우
  return !productInfo || (qty && parseInt(qty) >= ADMIN_CONFIG.notificationThreshold);
}

/**
 * 관리자 알림 설정을 업데이트하는 함수
 * @param {Object} settings - 설정 객체
 */
function updateAdminNotificationSettings(settings) {
  if (settings.threshold) {
    ADMIN_CONFIG.notificationThreshold = settings.threshold;
  }
  if (settings.enable !== undefined) {
    ADMIN_CONFIG.enableNotifications = settings.enable;
  }
  console.log('관리자 알림 설정이 업데이트되었습니다:', ADMIN_CONFIG);
} 