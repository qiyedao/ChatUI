import { RequestOptionsInit, RequestOptionsWithResponse, RequestResponse } from 'umi-request';
import { MessageProps, QuickReplyItemProps } from '..';
import { User } from '../components/Message/Message';
type MessageWithoutId = Omit<MessageProps, '_id'>;

export interface Options {
  root: HTMLElement;
  config?: Config | undefined;
  requests: Requests;
  handlers?: Handlers;
  components?: Components;
}
export interface Config {
  avatarWhiteList?: string[]; // 头像白名单
  navbar?: {
    title?: string;
    [key: string | number]: any;
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

export type CommonRequestResponse<T = RequestOptionsInit> = {
  options: T;
  url: string;
};
export interface Requests {
  baseUrl?: string;
  //获取token Api
  tokenUrl?: string;
  token?: string;
  userId: string;
  sceneId: string;
  request: (url: string, options: RequestOptionsWithResponse) => Promise<RequestResponse<any>>;
  send: (msg: MessageWithoutId) => Promise<CommonRequestResponse>;
}

export interface Handlers {
  parseResponse?: (res: any, requestType: string) => Promise<any>;
}

export interface Components {
  [key: string | number]: React.FC<any> | React.ComponentType<any>;
}

export type Ctx = {
  // 添加消息
  appendMessage(msg: Message): void;

  // 发送消息
  postMessage(msg: Message): void;

  // 更新消息
  updateMessage(msgId: string, msg: Message): void;

  // 删除消息
  deleteMessage(msgId: string): void;

  // 埋点方法
  log: {
    // 点击埋点
    click(params: any, logParams: any): void;

    // 曝光埋点
    expo(params: any, logParams: any): void;
  };

  // 界面相关的方法
  ui: {
    // 滚动消息列表到底部
    scrollToEnd(opts?: { animated?: boolean; delay?: number }): void;

    // 隐藏快捷短语
    hideQuickReplies(): void;

    // 显示快捷短语
    showQuickReplies(): void;
  };

  // 配置
  config: Config;
  // jsBridge 方法
  JSBridge: Bridge;
  // 工具函数
  util: Util;
};

interface Message {
  // 类型
  type: string;
  // 内容
  content: any;
  // ID
  _id?: string;
  // 创建时间
  createdAt?: number;
  // 发送者信息
  user?: {
    avatar: string;
  };
  // 显示位置
  position?: 'left' | 'right' | 'center';
  // 是否显示时间
  hasTime?: boolean;
}

interface Util {
  // 封装 fetch 后的方法
  fetchData: (opts: { url: string; type?: string; data: any }) => Promise<any>;

  // 打开新窗口
  openWindow(url: string): void;

  // 关闭窗口
  popWindow(): void;
}

interface Bridge {}
