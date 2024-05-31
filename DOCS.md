# 힉오더 프론트엔드

## 목차

- [실행 환경 및 개발 환경](#실행-환경-및-개발-환경)
  - [실행 환경 구성](#실행-환경-구성)
  - [개발 환경 구성](#개발-환경-구성)
- [디렉토리 구조](#디렉토리-구조)
- [CSS 작성]
- [Custom Element]
- [템플릿 엔진]

## 실행 환경 및 개발 환경

### 실행 환경 구성

1. Node.js 설치

   [Node.js 웹사이트](https://nodejs.org/)에서 설치 파일을 다운로드하거나 [Node.js 설치 안내 페이지](https://nodejs.org/en/download/package-manager)의 안내에 따라 설치합니다.

2. 의존성 설치

   터미널에서 다음의 명령어를 사용하여 패키지 의존성 모듈들을 설치합니다.

   ```
   npm i
   ```

3. 실행

   터미널에서 다음의 명령어를 서버를 실행합니다.

   ```
   npm run start -p 포트번호
   ```

### 개발 환경 구성

1. 실행 환경 구성

   먼저 앞 목차의 실행 환경을 구성합니다.

2. 텍스트 에디터

   추천하는 에디터는 [VS Code](https://code.visualstudio.com/) 입니다.

3. `Prettier` 설정

   [`Prettier`](https://prettier.io/) 는 코드 포멧을 재지정해주는 프로그램입니다. 같은 `Prettier` 설정을 사용하여 서로 같은 코드 포맷 스타일을 사용하여, 코드를 읽으면서 생기는 오류나 코드 포맷 스타일 차이로 생기는 불필요한 변경사항을 방지할 수 있습니다.

   3.1. VS Code 설치 후 `Extensions` 탭에서 `Prettier` 확장 프로그램을 설치합니다. 다른 텍스트 에디터를 사용하는 경우 해당 텍스트 에디터의 확장 프로그램 목록이나 [`Prettier` 웹사이트](https://prettier.io/)를 참조하십시오.

   3.2. VS Code 설정에서 `Prettier: Single Quote` 설정을 활성화합니다. 다른 설정은 전부 기본값으로 둡니다.

   3.3. VS Code 설정에서 `Editor: Default Formatter` 설정값을 `Prettier`로 설정합니다.

   3.4. VS Code 설정에서 `Editor: Format On Save` 설정을 활성화합니다.

## 디렉토리 구조

- `/node_modules`
- `/src`
  - `/modules`
    - `/middlewares`
    - `engine.mjs`
  - `/public`
    - `/components`
    - `/modules`
    - `/resources`
    - `favicon.ico`
    - `robots.txt`
  - `/routes`
    - `auth.mjs`
    - `dash.mjs`
    - `root.mjs`
    - `user.mjs`
  - `/views`
    - `/auth`
    - `/dash`
    - `/error`
    - `/user`
  - `app.mjs`
  - `config.mjs`
  - `express.mjs`
- `package-lock.json`
- `package.json`

### `/src/modules`

웹 서버에서 사용하는 기능들이 구현된 모듈들이 들어있습니다.

### `/src/public`

웹 페이지에서 공통적으로 사용하는 구성 요소들이 저장되는 디렉토리입니다. 브라우저에서 인증 과정 없이 바로 접근할 수 있습니다. 브라우저가 기본적으로 인식하는 파일들을 제공하기 위해 예외적으로 `favicon.ico` 와 `robots.txt` 파일은 루트 디렉토리에 둡니다.

- ### `/src/public/components`

  컴포넌트 (사용자 지정 요소) 들을 구성하는 파일들을 넣습니다. 컴포넌트 한 개당 하나의 파일을 사용합니다. 파일의 이름은 컴포넌트의 이름과 같게 합니다.

- ### `/src/public/modules`

  웹 페이지에서 공통적으로 사용하는 스크립트들을 넣습니다.

- ### `/src/public/resources`

  웹 페이지에서 사용하는 리소스들을 넣습니다. 공통 CSS 파일, 이미지, 아이콘 등이 있습니다.

### `/src/routes`

웹 페이지 접근 라우터

### `/src/views`

웹 페이지를 구성하는 템플릿 파일(.html 파일)과 페이지용 CSS, JS 파일들을 넣습니다. 페이지용 CSS, JS 파일들의 이름은 템플릿 파일과 같게 합니다.

### `/node_modules` (자동 생성)

Node.js 패키지에서 사용하기 위해 설치한 의존 모듈들이 저장되는 디렉토리입니다.

### `package-lock.json` (자동 생성)

Node.js 패키지에서 사용하기 위해 설치한 의존 모듈들의 현재 정보를 저장해 둔 파일입니다.
