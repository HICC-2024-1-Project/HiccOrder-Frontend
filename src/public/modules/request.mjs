import apiEnv from "../static/api.env.mjs";
// Example POST method implementation:
async function request(path = "", data = {}, method, contentType) {
  // Default options are marked with *
  url = apiEnv.baseUri + "/api/" + path;
  const header = {
    "Content-Type": contentType,
    // 'Content-Type': 'application/x-www-form-urlencoded',
  };
  if (localStorage.accessToken) {
    header.Authorization = localStorage.accessToken;
  }
  try {
    const response = await fetch(url, {
      method: method, // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: header,
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
  } catch (error) {
    if (response.status == 403) {
      try {
        const json = await response.json();
        if (json.messages[0].message == "Token is invalid or expired") {
          const newToken = await request(
            (path = "auth/refresh/"),
            (data = {
              refresh: localStorage.refreshToken,
            }),
            (method = "post"),
            (contentType = "application/json")
          )
            .then((resp) => resp.json())
            .then((json) => {
              localStorage.accessToken = json.data.access;
            })
            .catch((error) => {
              throw error;
            });
          return request(path, data, method, contentType);
        }
      } catch (error) {
        throw error;
      }
    }
    throw error;
  }
  if (contentType == "text/plain") {
    return response.text();
  } else if (contentType == "application/json") {
    return response.json();
  }

  return response.blob();
}
