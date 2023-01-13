---
title: Config Options
---

# Config Options

```js
new ChatSDK({ ...args });
```

## config

```js
interface Config {
  avatarWhiteList?: string[]; // 头像白名单
  navbar?: {
    title?: string,
    [key: string | number]: any,
  }; // 导航
  robot?: User; // 机器人信息
  user?: User; // 发送者信息
  agent?: Record<string | number, any>; // 客服信息
  feedback?: Record<string | number, any>; // 点赞点踩&反馈
  messages?: MessageProps[]; // 初始化消息
  toolbar?: []; // 加号扩展
  quickReplies?: QuickReplyItemProps[]; // 快捷短语
  inputType?: 'text' | 'voice'; // 输入方式
  placeholder?: string; // 输入框占位符
}
```
