---
title: Requests Options
---

# Requests Options

```js
new ChatSDK({ ...args });
```

## requests

```js
interface Requests {
  baseUrl?: string;
  //获取token Api
  tokenUrl?: string;
  token?: string;
  userId: string;
  sceneId: string;
  openMediaUrl: string | '/qa/manage/media/preview';
  request: (url: string, options: RequestOptionsWithResponse) => Promise<RequestResponse<any>>;
  send: (msg: MessageWithoutId) => Promise<CommonRequestResponse>;
}
```
