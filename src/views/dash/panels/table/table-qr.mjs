import { APIGetRequest } from '/modules/api.mjs';

document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const tableId = params.get("table");
  const qrCodeContainer = document.getElementById('qrcode');
  const qrTimer = document.getElementById('qr-timer');

  // QR 코드 생성하는 함수
  window.generateQRCode = function (tableId) {
    // 사용자 페이지로 연동되는 큐알
    const qrData = `https://domain.com/orderHistory.html?table=${tableId}`;
 
    qrCodeContainer.innerHTML = '';

    // QR 코드 생성
    new QRCode(qrCodeContainer, {
      text: qrData,
      width: 250,
      height: 250,
    });

    // 타이머 설정 (10분)
    let timeLeft = 600; // 10분 = 600초
    // setInterval 함수와 clearInterval 함수 사용
    const timer = setInterval(() => {
      // 타임아웃 인 경우
      if (timeLeft <= 0) {
        clearInterval(timer); // 함수 중지
        qr.style.display = 'none';
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

  generateQRCode();
});
