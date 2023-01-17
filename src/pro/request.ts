import { extend, RequestInterceptor, ResponseInterceptor } from 'umi-request';

/** 异常处理程序 */
const errorHandler = (error: any) => {
  return Promise.reject(error);
};

/** 配置request请求时的默认参数 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  timeout: 30 * 1000, // 超时配置
  requestType: 'form',
});
const customRequest = (
  requestInterceptor?: RequestInterceptor,
  responseInterceptor?: ResponseInterceptor,
) => {
  if (requestInterceptor) {
    request.interceptors.request.use(requestInterceptor);
  }
  if (responseInterceptor) {
    request.interceptors.response.use(responseInterceptor);
  }
  return request;
};
export default customRequest;
