import { APIGetRequest } from '/modules/api.mjs';

document.addEventListener('DOMContentLoaded', function () {
  const tableList = document.querySelector('.table-list');
  const qrPopup = document.getElementById('qr-popup');
  const qrCodeContainer = document.getElementById('qrcode');
  const qrTimer = document.getElementById('qr-timer');

  // 서버에서 테이블 목록 불러오기
  async function loadTableData() {
    try {
      const response = await APIGetRequest(
        `booth/${localStorage.booth}/table/`
      );
      const tableData = response;
      tableData.forEach((table, index) => {
        addTableToDOM(table.id, table.table_name);
      });
    } catch (error) {
      console.log(error);
    }
  }

  // 테이블 목록을 DOM 에 추가
  function addTableToDOM(id, name) {
    const tableItem = document.createElement('div');
    tableItem.className = 'table-item';
    // 테이블 이름 누르면 큐알코드 생성
    // 다시 생성하기 버튼 누르면 큐알코드 생성
    tableItem.innerHTML = `
      <span class="table-name" onclick="generateQRCode(${id})">${name}</span>
      <button onclick="generateQRCode(${id})">다시 생성하기</button>
    `;
    tableList.appendChild(tableItem);
  }

  // QR 코드 생성하는 함수
  window.generateQRCode = function (tableId) {
    // const table = savedTables[tableIndex];
    // domain.com 에 사용하는 도메인 이름 넣으면
    // 해당 테이블의 주문 내역 페이지로 이동하는 구조
    const qrData = `https://domain.com/orderHistory.html?table=${tableId}`;
    // 테이블별로 해당 url 생성하게 함
    // 문자열을 큐알로 바꾸는 기능

    // QR 코드 컨테이너 비우기
    qrCodeContainer.innerHTML = '';

    // QR 코드 생성
    new QRCode(qrCodeContainer, {
      text: qrData,
      width: 250,
      height: 250,
    });

    // QR 코드 팝업 열기
    qrPopup.style.display = 'flex';

    // 타이머 설정 (10분)
    let timeLeft = 600; // 10분 = 600초
    // setInterval 함수와 clearInterval 함수 사용
    const timer = setInterval(() => {
      // 타임아웃 인 경우
      if (timeLeft <= 0) {
        clearInterval(timer); // 함수 중지
        qrPopup.style.display = 'none';
      }
      // 시간 안 끝난 경우(정상작동)
      else {
        timeLeft--; //시간 줄이기
        const minutes = Math.floor(timeLeft / 60); // 분 = 남은 초를 60으로 나눴을때 몫
        const seconds = timeLeft % 60; // 초 = 남은 초를 60으로 나눴을때 나머지
        qrTimer.textContent = `남은시간: ${minutes}분 ${seconds}초`;
      }
    }, 1000); // 1초 단위
  };

  // QR 코드 팝업 닫기 함수
  window.closeQRPopup = function () {
    qrPopup.style.display = 'none';
  };

  loadTableData();
});
