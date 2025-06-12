// 전역 설정
const CONFIG = {
  ADMIN_EMAIL: 'locolorinc@gmail.com',
  SENDER_EMAIL: 'product@locolor.kr',
  FORM_ID: '1FAIpQLSdwAvawsCJOghec_8vgGi0F0ul0m_9LblvtPqcCZ7xaxb2Nsw',
  MIN_BULK_ORDER: 500
};

// 제품별 가격 정보
const PRODUCT_PRICES = {
  '인형': {
    minQuantity: 500,
    maxQuantity: 2000,
    minPrice: 6596000,
    maxPrice: 20424000
  },
  '인형키링': {
    minQuantity: 500,
    maxQuantity: 2000,
    minPrice: 4600000,
    maxPrice: null // 미정
  },
  '금속뱃지': {
    minQuantity: 500,
    maxQuantity: 2000,
    minPrice: 1515000,
    maxPrice: 12818000
  },
  '마그넷': {
    minQuantity: 350,
    maxQuantity: 6000,
    minPrice: 1988844,
    maxPrice: 2610000
  },
  '스티커': {
    minQuantity: 500,
    maxQuantity: 2000,
    minPrice: null, // 미정
    maxPrice: 1320000
  },
  '차량번호판': {
    minQuantity: 500,
    maxQuantity: 1500,
    minPrice: 3190000,
    maxPrice: 3300000
  }
};

// 폼 제출 시 트리거
function onFormSubmit(e) {
  try {
    const formResponse = e.response;
    const itemResponses = formResponse.getItemResponses();
    const responseData = processFormResponse(itemResponses);
    
    // 견적 계산
    const quotation = calculateQuotation(responseData);
    
    // 이메일 발송
    sendQuotationEmail(responseData, quotation);
    
    // 관리자 알림
    notifyAdmin(responseData, quotation);
    
    // 로그 기록
    logResponse(responseData, quotation);
    
  } catch (error) {
    Logger.log('Error in onFormSubmit: ' + error.toString());
    notifyAdminError(error);
  }
}

// 폼 응답 처리
function processFormResponse(itemResponses) {
  const responseData = {};
  
  itemResponses.forEach(response => {
    const title = response.getItem().getTitle();
    const answer = response.getResponse();
    responseData[title] = answer;
  });
  
  return responseData;
}

// 견적 계산
function calculateQuotation(responseData) {
  const product = responseData['제품 종류'];
  const quantity = parseInt(responseData['수량']);
  const productInfo = PRODUCT_PRICES[product];
  
  if (!productInfo) {
    throw new Error('알 수 없는 제품 종류입니다.');
  }
  
  // 수량 검증
  if (quantity < productInfo.minQuantity || quantity > productInfo.maxQuantity) {
    throw new Error(`수량은 ${productInfo.minQuantity}개에서 ${productInfo.maxQuantity}개 사이여야 합니다.`);
  }
  
  // 가격 계산 로직 (선형 보간)
  let estimatedPrice;
  if (productInfo.minPrice && productInfo.maxPrice) {
    const priceRange = productInfo.maxPrice - productInfo.minPrice;
    const quantityRange = productInfo.maxQuantity - productInfo.minQuantity;
    const ratio = (quantity - productInfo.minQuantity) / quantityRange;
    estimatedPrice = productInfo.minPrice + (priceRange * ratio);
  } else {
    estimatedPrice = null; // 가격 미정인 경우
  }
  
  return {
    product: product,
    quantity: quantity,
    estimatedPrice: estimatedPrice
  };
}

// 견적 이메일 발송
function sendQuotationEmail(responseData, quotation) {
  const template = HtmlService.createTemplateFromFile('EmailTemplate');
  template.responseData = responseData;
  template.quotation = quotation;
  
  const htmlBody = template.evaluate().getContent();
  
  GmailApp.sendEmail(
    responseData['이메일'],
    '[Locolor] 견적 안내드립니다.',
    '이 이메일은 HTML 형식으로 작성되었습니다.',
    {
      htmlBody: htmlBody,
      from: CONFIG.SENDER_EMAIL,
      name: 'Locolor'
    }
  );
}

// 관리자 알림
function notifyAdmin(responseData, quotation) {
  const message = `
    새로운 견적 요청이 있습니다.
    
    제품: ${quotation.product}
    수량: ${quotation.quantity}개
    견적가: ${quotation.estimatedPrice ? formatPrice(quotation.estimatedPrice) : '미정'}원
    
    고객 정보:
    이름: ${responseData['이름']}
    이메일: ${responseData['이메일']}
    연락처: ${responseData['연락처']}
  `;
  
  GmailApp.sendEmail(
    CONFIG.ADMIN_EMAIL,
    '[Locolor] 새로운 견적 요청',
    message
  );
}

// 에러 알림
function notifyAdminError(error) {
  GmailApp.sendEmail(
    CONFIG.ADMIN_EMAIL,
    '[Locolor] 시스템 오류 발생',
    '오류 내용: ' + error.toString()
  );
}

// 로그 기록
function logResponse(responseData, quotation) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Logs');
  if (!sheet) {
    SpreadsheetApp.getActiveSpreadsheet().insertSheet('Logs');
  }
  
  sheet.appendRow([
    new Date(),
    responseData['이름'],
    responseData['이메일'],
    responseData['연락처'],
    quotation.product,
    quotation.quantity,
    quotation.estimatedPrice
  ]);
}

// 가격 포맷팅
function formatPrice(price) {
  return Math.round(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
} 