---
title: Handlers Options
---

# Handlers Options

```js
new ChatSDK({ ...args });
```

## handlers

```js
interface Handlers {
  formatReceiveMsg: (res: any) => any; //格式化message
  onClickQuickReply?: (item: QuickReplyItemProps, ctx: Ctx) => void; //点击快捷回复
  onToolbarClick?: (item: ToolbarItemProps, ctx: Ctx) => void; //点击+号工具栏
}
```
