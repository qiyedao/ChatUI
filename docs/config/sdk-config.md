---
title: Config Options
---

# Config Options

```js
new ChatSDK({ config: { ...args } });
```

## config

```js
interface Config {
  robot?: User; // 机器人信息
  user?: User; // 发送者信息
  messages?: MessageProps[]; // 初始化消息
  toolbar?: []; // 加号扩展
  quickReplies?: QuickReplyItemProps[]; // 快捷短语
  autoCompletes?: AutoCompleteItemProps[]; //联想输入
  inputType?: 'text' | 'voice'; // 输入方式
  placeholder?: string; // 输入框占位符
}
```
