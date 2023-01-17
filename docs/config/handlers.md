---
title: Handlers Options
---

# Handlers Options

```js
new ChatSDK({ handlers: { ...args } });
```

## handlers

```js
interface Handlers {
  //格式化消息
  formatReceiveMsg?: (res: any) => any;
  //点击快捷短语
  onClickQuickReply?: (item: QuickReplyItemProps, ctx: Ctx) => void;
  //工具栏
  onToolbarClick?: (item: ToolbarItemProps, ctx: Ctx) => void;
  //点击联想输入
  onClickAutoComplete?: (item: AutoCompleteItemProps, ctx: Ctx) => void;
  //输入框输入
  onInputChange?: (value: string, ctx: Ctx) => void;
  //埋点
  track?: (data: any) => void;
  //解析响应结果
  parseResponse?: (res: any) => MessageProps | undefined;
}
```
