import { RequestOptionsInit, RequestOptionsWithResponse, RequestResponse } from 'umi-request';
import { MessageProps, QuickReplyItemProps, ToolbarItemProps } from '..';
import { AutoCompleteItemProps } from '../components/AutoCompletes';
import { User } from '../components/Message/Message';
type MessageWithoutId = Omit<MessageProps, '_id'>;
export interface ObjectType {
  [key: string | number]: any;
}
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
  autoCompletes?: AutoCompleteItemProps[]; //联想输入
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
  openMediaUrl?: string | '/qa/manage/media/preview';
  request?: (url: string, options: RequestOptionsWithResponse) => Promise<RequestResponse<any>>;
  send?: (msg: MessageWithoutId) => Promise<CommonRequestResponse>;
}

export interface Handlers {
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

export type Ctx = {
  // 添加消息
  appendMessage(msg: MessageProps): void;

  // 发送消息
  postMessage(type: string, val: string): void;

  // 更新消息
  updateMessage(msgId: string, msg: MessageProps): void;

  // 删除消息
  deleteMessage(msgId: string): void;

  //设置联想输入数据
  setAutoCompletes: (list: AutoCompleteItemProps[]) => void;
  // // 埋点方法
  log: {
    // 点击埋点
    click(params: any, logParams: any): void;

    // // 曝光埋点
    // expo(params: any, logParams: any): void;
  };

  // // 界面相关的方法
  ui: {
    // // 滚动消息列表到底部
    scrollToEnd(opts?: { animated?: boolean }): void;

    // 隐藏快捷短语
    hideQuickReplies(): void;

    // 显示快捷短语
    showQuickReplies(): void;
  };

  // 配置
  config: Config;
  //requests
  requests: Requests;
  // // jsBridge 方法
  JSBridge?: Bridge;
  // // 工具函数
  util: Util;
};

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
    ) => void;
    fail: (content: string, duration?: number | undefined) => void;
    success: (content: string, duration?: number | undefined) => void;
    loading: (content: string, duration?: number | undefined) => void;
  };
  //格式化message
  formatReceiveMessage: (res: any) => any;
}

interface Bridge {}
export interface Components {
  [key: string | number]: React.FC<any> | React.ComponentType<any>;
}
