// 설정값
const CONFIG = {
  spreadsheetId: '1-Q0L3cxDubrkYKxYAAc_FZgEfhkYbHHjowSsuQMjGK4',
  adminEmail: 'locolorinc@gmail.com',
  sender: {
    name: '로컬러 생산팀',
    email: 'product@locolor.kr'
  },
  productInfo: {
    "인형": {
      minQuantity: 500,
      baseQuantity: 2000,  // 기준 최대 수량
      totalPriceRange: { 
        min: 6596000,  // 500개 기준
        max: 20424000  // 2000개 기준
      }
    },
    "인형 키링": {
      minQuantity: 500,
      baseQuantity: 1000,  // 기준 최대 수량
      totalPriceRange: {
        min: 4600000,  // 500개 기준
        max: 7753054   // 1000개 기준
      }
    },
    "아크릴 키링": {
      minQuantity: 500,
      baseQuantity: 1000,
      totalPriceRange: {
        min: 2000000,
        max: 3500000
      }
    },
    "금속 뱃지": {
      minQuantity: 500,
      baseQuantity: 2000,
      totalPriceRange: {
        min: 1515000,  // 500개 기준
        max: 12818000  // 2000개 기준
      }
    },
    "마그넷": {
      minQuantity: 350,
      baseQuantity: 6000,
      totalPriceRange: {
        min: 1988844,  // 350개 기준
        max: 2610000   // 6000개 기준
      }
    },
    "스티커": {
      minQuantity: 300,
      baseQuantity: 3000,
      totalPriceRange: {
        min: 231000,     // 300장 기준 (리무버블)
        max: 15100000    // 3000장 기준
      }
    },
    "차량 번호판": {
      minQuantity: 500,
      baseQuantity: 1500,
      totalPriceRange: {
        min: 3190000,  // 500개 기준
        max: 3300000   // 1500개 기준
      }
    }
  }
};

// 가격 계산 헬퍼 함수
function calculatePrice(qty, minQty, baseQty, minPrice, maxPrice) {
  if (!minPrice || !maxPrice) return null;
  
  // 수량당 가격 증가율 계산
  const priceIncreaseRate = (maxPrice - minPrice) / (baseQty - minQty);
  
  // 실제 수량에 따른 가격 계산
  const estimatedPrice = minPrice + (priceIncreaseRate * (qty - minQty));
  return Math.floor(estimatedPrice);
}

// 단가 범위 계산 함수
function calculateUnitPriceRange(productInfo) {
  const { minQuantity, baseQuantity, totalPriceRange } = productInfo;
  
  if (!totalPriceRange.min || !totalPriceRange.max || !baseQuantity) return null;
  
  const minUnitPrice = Math.floor(totalPriceRange.max / baseQuantity); // 더 많은 수량의 단가가 최소 단가
  const maxUnitPrice = Math.floor(totalPriceRange.min / minQuantity); // 더 적은 수량의 단가가 최대 단가
  
  return { minUnitPrice, maxUnitPrice };
}

// 메일 템플릿
function getEmailTemplate(item, qty) {
  const productInfo = CONFIG.productInfo[item] || null;
  const isStandardProduct = !!productInfo;
  
  let estimatedTotal = '';
  if (productInfo) {
    const { minQuantity, baseQuantity, totalPriceRange } = productInfo;
    const unitPriceRange = calculateUnitPriceRange(productInfo);
    
    // 견적 계산이 가능한 경우
    if (unitPriceRange) {
      const { minUnitPrice, maxUnitPrice } = unitPriceRange;
      const effectiveQty = qty < minQuantity ? minQuantity : qty;
      
      const minTotal = Math.floor(minUnitPrice * effectiveQty);
      const maxTotal = Math.floor(maxUnitPrice * effectiveQty);
      
      estimatedTotal = `\n[견적 안내]`;
      
      // 수량이 최소 수량보다 작은 경우
      if (qty < minQuantity) {
        estimatedTotal += `\n※ 최소 주문 수량은 ${minQuantity}개입니다.`;
        estimatedTotal += `\n※ 아래 견적은 최소 주문 수량 기준으로 계산된 금액입니다.`;
      }
      
      estimatedTotal += `\n\n▶ 예상 견적 범위:`;
      estimatedTotal += `\n   - 총액: ${minTotal.toLocaleString()}원 ~ ${maxTotal.toLocaleString()}원`;
      estimatedTotal += `\n   - 개당: ${minUnitPrice.toLocaleString()}원 ~ ${maxUnitPrice.toLocaleString()}원`;
    } else {
      // 가격 정보가 부분적으로만 있는 경우
      estimatedTotal = `\n[견적 안내]`;
      if (totalPriceRange.min) {
        const minUnitPrice = Math.floor(totalPriceRange.min / minQuantity);
        estimatedTotal += `\n▶ ${minQuantity}개 기준:`;
        estimatedTotal += `\n   - 총액: ${totalPriceRange.min.toLocaleString()}원`;
        estimatedTotal += `\n   - 개당: ${minUnitPrice.toLocaleString()}원`;
      }
      if (baseQuantity && totalPriceRange.max) {
        const maxUnitPrice = Math.floor(totalPriceRange.max / baseQuantity);
        estimatedTotal += `\n\n▶ ${baseQuantity}개 기준:`;
        estimatedTotal += `\n   - 총액: ${totalPriceRange.max.toLocaleString()}원`;
        estimatedTotal += `\n   - 개당: ${maxUnitPrice.toLocaleString()}원`;
      }
    }
    
    estimatedTotal += `\n\n※ 실제 견적은 상세 상담 후 확정됩니다.`;
    estimatedTotal += `\n※ 수량과 옵션에 따라 견적이 변동될 수 있습니다.`;
    estimatedTotal += `\n※ 위 금액은 부가세 제외 금액입니다.`;
  }

  return `안녕하세요. 
로컬에 컬러를 더하는 주식회사 로컬러입니다.
견적 문의해주셔서 감사합니다.

저는 생산팀 김윤선 매니저입니다.

문의 주신 ${item} 항목에 대한 견적을 아래와 같이 안내드립니다.

견적 수량: ${qty}개${estimatedTotal}

보다 상세한 견적을 원하실 경우, 아래 구글폼을 작성해주세요.
상세 견적서를 회신드리겠습니다.
링크: https://m.site.naver.com/1KaVA 

문의 사항이 있으실 경우, 아래 연락처로 소통이 가능합니다.
이메일: product@locolor.kr
연락처: 010-4614-6019
*운영시간: 평일 10-19시 (점심 12-13시, 주말 및 공휴일 휴무)

오늘도 좋은 하루 보내시길 바랍니다. 
감사합니다.

누구나 갖고 싶은 굿즈를 만듭니다. 로컬러`;
}

// 로깅 함수
function logToSheet(sheet, logData) {
  const logSheet = sheet.getParent().getSheetByName('로그') || 
                  sheet.getParent().insertSheet('로그');
  logSheet.appendRow([
    new Date(),
    logData.email,
    logData.item,
    logData.quantity,
    logData.status,
    logData.message
  ]);
}

// 메인 함수
function onFormSubmit(e) {
  // 변수들을 함수 시작 부분에서 선언하여 스코프 문제 해결
  let email = '';
  let item = '';
  let qty = '';
  let timestamp = '';
  
  try {
    console.log('함수 시작');
    
    const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
    const sheet = spreadsheet.getSheets()[0];
    
    console.log('현재 시트 이름: ' + sheet.getName());
    
    const lastRow = sheet.getLastRow();
    const lastColumn = sheet.getLastColumn();
    const values = sheet.getRange(lastRow, 1, 1, lastColumn).getValues()[0];
    
    // 데이터 매핑
    timestamp = values[0] || '';
    email = values[1] || '';
    item = values[2] || '';
    qty = values[3] || '';
    
    console.log('매핑된 데이터:', { timestamp, email, item, qty });
    
    // 데이터 검증
    if (!email || !item) {
      const errorMsg = '필수 정보 누락';
      logToSheet(sheet, {
        email: email,
        item: item,
        quantity: qty,
        status: 'ERROR',
        message: errorMsg
      });
      return;
    }

    // 이메일 발송
    const subject = `[로컬러] ${item} 견적 문의에 대한 답변입니다.`;
    const body = getEmailTemplate(item, qty);

    // Gmail 발송 옵션 수정 - from 옵션 제거
    GmailApp.sendEmail(email, subject, body, {
      name: CONFIG.sender.name,
      replyTo: CONFIG.sender.email
    });

    // TODO: 관리자 알림 기능은 향후 별도 구현 예정
    // 현재는 AdminNotification.gs 파일에 저장되어 있음

    // 로그 기록
    logToSheet(sheet, {
      email: email,
      item: item,
      quantity: qty,
      status: 'SUCCESS',
      message: '정상 처리'
    });
    
    console.log('처리 완료: ' + email);
    
  } catch (error) {
    console.error('실행 중 오류 발생: ' + error.toString());
    
    // 오류 로그 기록 - 변수 스코프 문제 해결됨
    try {
      const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
      const sheet = spreadsheet.getSheets()[0];
      
      logToSheet(sheet, {
        email: email || 'UNKNOWN',
        item: item || 'UNKNOWN',
        quantity: qty || 'UNKNOWN',
        status: 'ERROR',
        message: error.toString()
      });
    } catch (logError) {
      console.error('로그 기록 실패: ' + logError.toString());
    }
    
    // 관리자에게 오류 알림
    try {
      GmailApp.sendEmail(
        CONFIG.adminEmail,
        '[로컬러 시스템 오류] 견적 자동 발송 실패',
        '오류 발생: ' + error.toString() + '\n\n' + error.stack
      );
    } catch (emailError) {
      console.error('관리자 알림 발송 실패: ' + emailError.toString());
    }
  }
} 