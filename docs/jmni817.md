## 경로 바꿔야하는 것
- html 은 view안에 dash
- 거의 뷰 안에 넣으면됨





## 맡은 기능

## 구현할 기능 목록 정리

한정민

- 테이블 관련 페이지 주로

  - 현재 테이블 현황 [테이블 관리]

    - 테이블 입장 QR [테이블 QR]
      : 입장 시 큐알 생성되어 테이블 할당하는 것

    - 테이블 주문 현황 확인 [주문내역] [주문기록 확인]

      - 관리자용 주문 추가 / 제거

    - 테이블 결제 (퇴장) + 결제용 QR [결제]


## 7/3 부터 할 것
- !!) 파일 경로 수정
- !!) 라우터 이용해서 
- 테이블 관리 페이지
  - 테이블 추가하고 저장[o]
  - 저장한 테이블 정보를 서버에 저장[x]
    (일단 로컬 스토리지에 저장하는 것으로 함)
- 주문 내역 페이지
  - 저장된 테이블 정보 바탕으로 주문내역 확인할 테이블 선택[o]
  - 테이블 별 주문내역 페이지 'orderDetails.html'로 연결[o]
    - 주문 내역 불러오기[x]
    - 관리자용 메뉴 추가 기능[x]
- 테이블 QR
  - 큐알 스캔하면 사용자용 음식 주문 페이지로 넘어가도록 하기

## 기본 디자인 공식

총 사용 색상: FFFFFF, FFEEE9, FF643C, D9D9D9, A0A0A0, 000000(검정)
stroke(직사각형 테두리 or line)-> 0.5px, A0A0A0

- 강조 사이드바
  가로: 2.4 rem
  높이: 0.6rem
  글자: 0.3rem /FFFFFF/ Bold
  아이콘: 0.35rem /FFFFFF
  곡률: 0.1rem(오른쪽 꼭짓점만)

- 일반 사이드바
  가로: 2rem
  높이: 0.5rem
  글자: 0.22rem / FFFFFF/ Regular
  아이콘: 0.25rem / FFFFFF
  곡률: 0.1rem(오른쪽 꼭짓점만)

- 창 제목바
  가로: 11rem
  높이: 0.6rem
  글자: 0.3rem /00000/ Bold
  아이콘: 0.35rem /00000
  곡률: 0.1rem(완쪽 꼭짓점만)

- QR생성하기 버튼
  가로: 1.2
  높이: 0.6
  글자: 0.15/FFFFFF/ Bold
  곡률: 0.1(모든 꼭짓점)

- 저장하기 버튼
  가로: 1.5
  높이: 0.5
  글자: 0.2/FFFFFF/ Bold
  곡률: 0.1(모든 꼭짓점)

## 관리자 페이지별 이름 정함

'booth.html' 부스 생성
'tableManagement.html' 테이블 관리[o]
'boothManagement.html' 부스 관리
'menuManagement.html' 메뉴 관리
'orderHistory.html' 주문 내역[o]

- 'orderDetails.html' 테이블 별 주문 내역 상세[o]
  'orderRecord.html' 주문기록 확인[m]
  'tableQR.html' 테이블 QR[m]
  'popup.html' 팝업 전용창[?]
  'payment.html' 결제[x]

## 주문내역

- 주문 내역에서 테이블을 선택하면, 선택한 테이블의 내부 페이지로 들어감.
  - 테이블 내부 페이지에서는 해당 테이블에서 주문한 메뉴명, 수량, 가격, 가격의 합계가 들어감. 임의로 추가할 수 있도록 '메뉴 추가하기' 버튼으로 메뉴명, 수량, 가격을 입력할 수 있게 함.
- 뒤로가기를 누르면 해당 내역을 저장하지 않은 채 주문내역 첫 기본 페이지로 돌아감.
- 저장하기를 누르면 메뉴 추가하기로 변동된 사항을 저장함.
- 결제하기 버튼을 누르면 테이블의 결제창(payment.html)으로 이동함.

문제점:
컴포넌트 활용을 못하고 있음

## 큐알생성:

- https://github.com/davidshimjs/qrcodejs
- 최신 버전 다운로드 받기
- 압축 해제하고, qrcode.min.js 파일을 /src/public/resources 폴더에 추가!
- HTML에서 QR 코드 생성 라이브러리 포함하는 코드
<script src="/src/public/resources/qrcode.min.js"></script>
- 사용방법: https://cloud-library.tistory.com/entry/%EC%89%BD%EA%B2%8C-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94-qrcodejs-%ED%8A%9C%ED%86%A0%EB%A6%AC%EC%96%BC

## 타이머

- https://ziszini.tistory.com/26

## 로컬에 저장된 자료 불러오기

- // (로컬)저장된 테이블 목록을 불러옴
  const savedTables = JSON.parse(localStorage.getItem("tables")) || [];

- DOMContentLoaded 이벤트와 load 이벤트의 차이점
  - DOMContentLoaded 이벤트:
    DOM 트리가 완전히 구축된 후에 발생합니다.
    이미지, 스타일시트 등 외부 리소스가 로드될 때까지 기다리지 않습니다.
    페이지의 구조가 준비된 시점에 실행되어야 하는 스크립트를 실행하는 데 적합합니다.
  - load 이벤트:
    페이지의 모든 리소스(이미지, 스타일시트 등)가 완전히 로드된 후에 발생합니다.
    전체 페이지의 모든 요소가 준비된 후에 실행되어야 하는 스크립트를 실행하는 데 적합합니다.







