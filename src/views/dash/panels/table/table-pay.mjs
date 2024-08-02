import { APIGetRequest } from '/modules/api.mjs';

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const tableId = params.get("table");
  const tableNameElement = document.getElementById("table-name");
  const totalPriceElement = document.getElementById("total-price");
  const bankNameElement = document.getElementById("bank-name");
  const bankOwnerElement = document.getElementById("bank-owner");
  const bankAccountElement = document.getElementById("bank-account");

  let boothName = "";
  let tableName = "";

  if (tableId !== null) {
    loadTableName(tableId); // 테이블 이름 로드
    loadOrderData(tableId); // 주문 데이터 로드
    loadBoothData(); // 부스 정보 로드
  }

  // qr
  function generateQRCode(elementId, data) {
    const qrCodeContainer = document.getElementById(elementId);
    qrCodeContainer.innerHTML = "";
    new QRCode(qrCodeContainer, {
      text: data,
      width: 300,
      height: 320,
    });
  }

  // 테이블 이름
  async function loadTableName(tableId) {
    try {
      const tableResponse = await APIGetRequest(`booth/${localStorage.booth}/table/${tableId}`);
      const tableData = tableResponse.data;
      tableName = tableData.table_name;
      tableNameElement.textContent = `${tableName} 결제`;
    } 
    catch (error) {
      console.log(error);
    }
  }

  // 주문내역
  async function loadOrderData(tableId) {
    try {
      const orderResponse = await APIGetRequest(`booth/${localStorage.booth}/order/${tableId}`);
      const orderData = orderResponse.data;
      let totalPrice = 0;
      orderData.forEach(item => {
        totalPrice += item.quantity * item.price;   // 총액
      });
      totalPriceElement.textContent = `${totalPrice.toLocaleString()}`;

      const paymentInfo = `총액: ${totalPrice.toLocaleString()}원\n계좌번호: ${bankAccountElement.textContent}`;
      generateQRCode('kakao-qr', paymentInfo);
      generateQRCode('toss-qr', paymentInfo);
      generateQRCode('naver-qr', paymentInfo);
    } 
    catch (error) {
      console.log(error);
    }
  }

  // 부스정보
  async function loadBoothData() {
    try {
      const boothResponse = await APIGetRequest(`booth/${localStorage.booth}/`);
      const boothData = boothResponse.data;
      // 부스 이름 저장
      boothName = boothData.booth_name;
      localStorage.setItem("shopName", boothName); 

      bankNameElement.textContent = boothData.bank_name;
      bankOwnerElement.textContent = boothData.banker_name;
      bankAccountElement.textContent = boothData.account_number;

      // QR 코드 갱신
      const totalPrice = totalPriceElement.textContent.replace(/,/g, '').replace('원', '');
      const paymentInfo = `총액: ${totalPrice}원\n계좌번호: ${boothData.account_number}`;
      generateQRCode('kakao-qr', paymentInfo);
      generateQRCode('toss-qr', paymentInfo);
      generateQRCode('naver-qr', paymentInfo);
    } 
    catch (error) {
      console.log(error);
    }
  }

  // 결제 완료 버튼 누름
  document.querySelector('.complete-payment-btn').addEventListener('click', function () {
    const totalPrice = totalPriceElement.textContent;
    const paymentMethod = "카카오 페이"; // 임의의 결제 수단 설정
    // table-done 으로 이동
    window.location.href = `/dash/panels/table/${tableId}/done?boothName=${boothName}&tableName=${tableName}&totalPrice=${totalPrice}&paymentMethod=${paymentMethod}`;
  });
});