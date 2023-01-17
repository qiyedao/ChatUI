---
title: API-Ctx
---

# Context

## ctx

```js
type Ctx = {
  // 添加消息
  appendMessage(msg: MessageProps): void,

  // 发送消息
  postMessage(type: string, val: string): void,

  // 更新消息
  updateMessage(msgId: string, msg: MessageProps): void,

  // 删除消息
  deleteMessage(msgId: string): void,

  //设置联想输入数据
  setAutoCompletes: (list: AutoCompleteItemProps[]) => void,
  // // 埋点方法
  log: {
    // 点击埋点
    click(params: any, logParams: any): void,
  },

  // // 界面相关的方法
  ui: {
    // // 滚动消息列表到底部
    scrollToEnd(opts?: { animated?: boolean }): void,

    // 隐藏快捷短语
    hideQuickReplies(): void,

    // 显示快捷短语
    showQuickReplies(): void,
  },

  // 配置
  config: Config,
  //requests
  requests: Requests,

  // // 工具函数
  util: Util,
};
```

## util

```js
interface Util {
  // 封装 fetch 后的方法
  fetchData: (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data: ObjectType,
    ...options: any
  ) => Promise<RequestResponse<any>>;

  // 打开新窗口
  openWindow(url: string): void;

  // 关闭窗口
  popWindow(): void;
  toast: {
    show: (
      content: string,
      type?: 'success' | 'error' | 'loading' | undefined,
      duration?: number | undefined,
    ) => void,
    fail: (content: string, duration?: number | undefined) => void,
    success: (content: string, duration?: number | undefined) => void,
    loading: (content: string, duration?: number | undefined) => void,
  };
  //格式化message
  formatReceiveMessage: (res: any) => any;
}
```
