import { APIGetRequest } from "/modules/api.mjs";

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

  
  loadTableName(tableId); // 테이블 이름 로드
  loadOrderData(tableId); // 주문 데이터 로드
  loadBoothData(); // 부스 정보 로드
  
  // qr
  function generateQRCode(elementId, data) {
    const qrCodeContainer = document.getElementById(elementId);
    qrCodeContainer.innerHTML = "";
    new QRCode(qrCodeContainer, {
      text: data,
      width: 200,
      height: 200
    });
  }

  // 테이블 이름
  async function loadTableName(tableId) {
    try {
      const tableResponse = await APIGetRequest(
        `booth/${localStorage.booth}/table/${tableId}`
      );
      const tableData = tableResponse;
      tableName = tableData.table_name;
      tableNameElement.textContent = `${tableName} 결제`;
    } 
    catch (error) {
      console.log("테이블 이름 로드 중 오류 발생", error);
    }
  }

  // 주문내역
  async function loadOrderData(tableId) {
    try {
      const orderResponse = await APIGetRequest(
        `booth/${localStorage.booth}/order/${tableId}`
      );
      const orderData = orderResponse;
      let totalPrice = 0;
      orderData.forEach((item) => {
        totalPrice += item.quantity * item.price; // 총액
      });
      totalPriceElement.textContent = `${totalPrice.toLocaleString()}`;
    } 
    catch (error) {
      console.log("주문 내역 로드 중 에러 발생", error);
    }
  }

  // 부스정보
  async function loadBoothData() {
    try {
      const boothResponse = await APIGetRequest(`booth/${localStorage.booth}/`);
      const boothData = boothResponse;

      boothName = boothData.booth_name;
      bankNameElement.textContent = boothData.bank_name;
      bankOwnerElement.textContent = boothData.banker_name;
      bankAccountElement.textContent = boothData.account_number;

      // QR 코드 갱신
      const totalPrice = totalPriceElement.textContent
        .replace(/,/g, "")
        .replace("원", "");
      const paymentInfo = //`총액: ${totalPrice}원\n계좌번호: ${boothData.account_number}`;
      `https://youtu.be/eP2aJra_8Tw?si=Ekuvh6Tu_ISghnU_`;
      generateQRCode("kakao-qr", paymentInfo);
      generateQRCode("toss-qr", paymentInfo);
      generateQRCode("naver-qr", paymentInfo);
    } 
    catch (error) {
      console.log("부스 정보 로드 중 오류 발생", error);
    }
  }

  // 완료 버튼 누르면 done으로 이동
  document.getElementById('complete-payment-btn').addEventListener('click', function() {
    // /table/:tid/done 경로로 리디렉션
    window.location.href = `/table/${tableId}/done`;
  });
});
