---
title: Requests Options
---

# Requests Options

```js
new ChatSDK({ requests: { ...args } });
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
  openMediaUrl?: string | '/qa/manage/media/preview';
  request?: (url: string, options: RequestOptionsWithResponse) => Promise<RequestResponse<any>>;
  send?: (msg: MessageWithoutId) => Promise<CommonRequestResponse>;
  requestInterceptor?: RequestInterceptor;
  responseInterceptor?: ResponseInterceptor;
}
```

## CommonRequestResponse

```js
type CommonRequestResponse<T = RequestOptionsInit> = {
  options: T,
  url: string,
};
```

## RequestOptionsInit

```js
/**
 * 增加的参数
 * @param {string} requestType post类型, 用来简化写content-Type, 默认json
 * @param {*} data post数据
 * @param {object} params query参数
 * @param {string} responseType 服务端返回的数据类型, 用来解析数据, 默认json
 * @param {boolean} useCache 是否使用缓存,只有get时有效, 默认关闭, 启用后如果命中缓存, response中有useCache=true. 另: 内存缓存, 刷新就没.
 * @param {number} ttl 缓存生命周期, 默认60秒, 单位毫秒
 * @param {number} timeout 超时时长, 默认未设, 单位毫秒
 * @param {boolean} getResponse 是否获取response源
 * @param {function} errorHandler 错误处理
 * @param {string} prefix 前缀
 * @param {string} suffix 后缀
 * @param {string} charset 字符集, 默认utf8
 */
export interface RequestOptionsInit extends RequestInit {
  charset?: 'utf8' | 'gbk';
  requestType?: 'json' | 'form';
  data?: any;
  params?: object | URLSearchParams;
  paramsSerializer?: (params: object) => string;
  responseType?: ResponseType;
  useCache?: boolean;
  ttl?: number;
  timeout?: number;
  timeoutMessage?: string;
  errorHandler?: (error: ResponseError) => void;
  prefix?: string;
  suffix?: string;
  throwErrIfParseFail?: boolean;
  parseResponse?: boolean;
  cancelToken?: CancelToken;
  getResponse?: boolean;
  validateCache?: (url: string, options: RequestOptionsInit) => boolean;
  __umiRequestCoreType__?: string;
  [key: string]: any;
}
```
