# 힉오더 프론트엔드

## 목차

- [실행 환경 및 개발 환경](#실행-환경-및-개발-환경)
  - [실행 환경 구성](#실행-환경-구성)
  - [개발 환경 구성](#개발-환경-구성)
- [디렉토리 구조](#디렉토리-구조)
- [CSS 작성](#css-작성)
- [Custom Element](#custom-element)
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
   npm run prod -p 포트번호
   ```

### 개발 환경 구성

1. 실행 환경 구성

   1.1. 먼저 앞 목차의 실행 환경을 구성합니다.

   1.2. Nodemon 설치

   터미널에서 다음의 명령어를 사용하여 Nodemon을 설치합니다.

   ```
   npm i -g nodemon
   ```

   1.3. 실행

   터미널에서 다음의 명령어를 서버를 실행합니다.

   ```
   npm run dev -p 포트번호
   ```

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

## CSS 작성

### `dash/panels` CSS 작성 요령

순수한 CSS 에서 CSS 선택자를 아무렇게나 작성하면 선택자, 혹은 요소들끼리 충돌을 일으킬 수 있습니다. 여러 패널들이 있는 `dash/panels` 에서 CSS 선택자 충돌을 줄이기 위해 네이밍 규칙을 사용하여 최상단 엘리먼트의 이름을 정하고, 그 엘리먼트를 통해 선택자를 사용하도록 합니다.

규칙:

```html
<section id="dash-{폴더이름(패널명)}-{파일이름}"></section>
```

## Custom Element

### 참조 자료

- [사용자 정의 요소 사용하기](https://developer.mozilla.org/ko/docs/Web/API/Web_components/Using_custom_elements)
- [shadow DOM 사용하기](https://developer.mozilla.org/ko/docs/Web/API/Web_components/Using_shadow_DOM)

## 템플릿 엔진

`src/views` 안의 HTML파일들을 템플릿 파일입니다. 다른 모든 기능과 작동은 일반 HTML과 동일하지만, 몇 가지 부가적인 기능이 추가되었습니다.

### 템플릿을 렌더하는 방법

`src/routes` 안의 모듈들은 라우터 모듈입니다. 프론트엔드에서 라우터 모듈들은 특정 URI 에서 어떤 템플릿을 표시할 지 정하고, 템플릿에 필요한 정보들을 넘겨주는 역할을 합니다.

### `<import>` 태그

다른 템플릿 파일을 불러와 `<import></import>` 태그 자리에 대체하여 넣습니다.

사용 방법은 다음과 같습니다.

```html
<import src="파일 경로"></import>
```

### 인라인 변수

사용 방법은 다음과 같습니다.

```html
<p>#{hello}</p>
```
