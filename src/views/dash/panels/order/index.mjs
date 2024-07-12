// 주문기록 확인 페이지

document.addEventListener('DOMContentLoaded', function () {
  const orderTableBody = document.querySelector('.order-table tbody');

  // (로컬)저장된 테이블 목록 로드
  const savedTables = JSON.parse(localStorage.getItem('tables')) || [];

  // 서버 or 로컬 저장소에서 저장된 주문 기록 데이터 가져오기

  // 주문기록을 테이블에 추가하는 함수 addOrderRecord
  function addOrderRecord(record) {
    // 새로운 tr 행 생성
    const row = document.createElement('tr');

    // 새로운 행 내부 요소HTML을
    // 주문 기록 데이터(메뉴, 테이블 번호, 주문시각, 수량, 결제여부, 결제수단)로 채움
    row.innerHTML = `   
            <td>${record.menu}</td>
            <td>${record.tableNumber}</td>
            <td>${record.orderTime}</td>
            <td>${record.quantity}</td>
            <td>${record.paid}</td>
            <td>${record.paymentMethod}</td>
        `;

    // 새로 만든 행을 추가
    orderTableBody.appendChild(row);
  }

  // 페이지 로드 시 저장된 주문 기록을 테이블에 추가
  orderRecords.forEach(addOrderRecord);

  // 사용자에서 주문을 했을 때 이걸
  // 관리자형(메뉴, 테이블번호, 수량, 결제여부, 결제수단)으로 변환하는 과정이 필요함

  // 현재 시간 기록하는 함수
  // const now = new Date();
  // const orderTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
});
