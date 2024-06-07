# 라우터와 템플릿 엔진

보통의 웹 서버 (Apache, IIS, Nginx 등...)에서는 웹 페이지를 표시할 때 템플릿 파일에 직접 접근하거나 디렉토리의 `index.html` 파일을 출력하는 식으로 작동합니다. 하지만 이런 식의 웹 서버를 사용하면 모든 url 에 대해 디렉토리를 만들고 `index.html` 을 작성하여 사용하거나 URL의 `path`가 `.html` 로 끝나는 방식으로 사용해야 합니다.

이 방법은 충분히 사용 가능하지만 약간의 불편함이 있습니다. 이 프로젝트에서는 이런 일을 방지하기 위해 라우터와 템플릿 엔진을 사용합니다.

## 라우터

라우터는 사용자가 요청한 `path`에 따라 미리 정의된 페이지를 보여주는 모듈입니다. 이 프로젝트에서는 `src/routes` 디렉토리에 작성됩니다.

이 프로젝트에서 사용하는 웹 서버인 `express`에서는 라우터를 다음과 같이 작성합니다.

```js
import express from 'express';
const router = express.Router();

router.get('/test', (req, res, next) => {
  // 라우터의 처리 내용
  res.render('test.html', { number: 1 });
});

export default router;
```

`router.get` 의 `get` 부분은 라우터가 처리할 HTTP 메소드를 의미합니다. `HTTP GET`이라면 `get`, `HTTP POST` 라면 `post` 등으로 작성합니다. 이 리포지토리에서는 프론트엔트의 처리만 구현 할 것이므로 `router.get` 만 사용하면 됩니다.

`router.get` 은 함수를 호출하는 형태로 사용합니다. 첫번째 인자는 라우터가 처리할 `path`, 두번째 인자는 라우터가 처리할 콜백 함수를 작성합니다. 콜백 함수의 인자로는 `req`, `res`, `next` 가 있습니다.

- `req` 인자에는 사용자가 페이지를 요청할 때 제공한 정보가 담겨 있습니다. 헤더, 쿠키 정보, POST BODY, 커넥션 정보 등이 전부 포함됩니다.

- `res` 인자에는 서버가 사용자에게 응답할 때 사용해줄 수 있는 함수와 요소가 담겨 있습니다.

- `next` 인자는 라우터의 처리를 이 라우터에서 끝내지 않고 다음 라우터로 넘겨야 할 때 사용하는 함수입니다.

## 템플릿 엔진

라우터의 처리 내용 안에서는 사용자가 요청한 내용을 응답 해 주는 코드를 작성해야 합니다. `res` 인자를 사용하여 작성할 수 있습니다. 이 프로젝트에서는 추가적으로 템플릿 엔진 기능을 직접 구현하여 사용 할 것이기 때문에 `res.render` 함수를 사용하여 사용자에게 응답합니다. 템플릿 엔진의 구현체는 `src/modules/engine.mjs` 에 작성되어 있습니다.

```js
res.status(200).render('template.html', {
  hello: 'world',
  num: 1.25,
  func: () => {
    return 'boom';
  },
});
```

먼저 `res.status` 는 HTTP 응답 코드를 설정하는 `express` 기본 함수입니다. 보통 사용되는 `200 OK` 에서는 생략하여 작성할 수 있지만, 사용자에게 다른 응답 코드로 응답하기 위해서는 `res.status` 함구를 사용해야 합니다.

그 뒤에는 `res.render` 함수를 사용합니다. 따로 작성해도 되지만, `res.status` 뒤에 바로 붙여서 사용할 수 있습니다. `res.render` 함수는 두 개의 인자를 가집니다. 첫번째 인자는 응답할 템플릿 파일의 경로이고, 두 번째 인자는 템플린 파일에 전달할 값들을 담숩니다. 템플릿 파일에 전달할 값이 없는 경우, 두 번째 인자는 생략할 수 있습니다.

생략 가능한 부분을 생략하여 간단하게 작성된 `res.render` 의 코드는 다음과 같습니다.

```js
res.render('template.html');
```

## 템플릿 파일

`res.render` 함수를 사용하여 템플릿 엔진을 통해 사용사에게 응답할 HTML 을 **템플릿 파일** 이라고 부릅니다. 이 프로젝트에서는 바닐라 HTML, CSS, JS를 최대한 사용하여 제작할 수 있도록 최소한의 기능만 구현되어 있습니다.

### `<import>` 태그

텡플릿 파일 안에서 `<import>` 태그를 사용하여 다른 템플릿 파일을 불러와 그 자리에 넣을 수 있습니다.

```html
<import src="템플릿 파일 경로"></import>
```

으로 사용할 수 있습니다.

### `#{}` 실행자

템플릿 파일 안에서 `#{}` 실행자를 사용하여 `res.render` 함수로 넘겨 준 값들을 사용하거나, 간단한 자바스크립트 코드를 실행하여 결과값을 사용할 수 있습니다.

```html
<span>#{value}</span>
```

혹은...

```html
<span>#{obj.func(20) + 7}</span>
```

등과 같이 사용할 수 있습니다.

## 참조 문서

- [HTTP 요청 메서드](https://developer.mozilla.org/ko/docs/Web/HTTP/Methods)
- [HTTP 상태 코드](https://developer.mozilla.org/ko/docs/Web/HTTP/Status)
- [Express 4.x - API 참조](https://expressjs.com/ko/4x/api.html)
