import React from 'react';
import Chat, {
  Bubble,
  MessageProps,
  useMessages,
  QuickReplyItemProps,
  useQuickReplies,
  ToolbarItemProps,
  toast,
} from '../index';
import { formatReceiveMsg, getNoClickList } from './utils/chatUtils';
import AccurateMsg from './components/Chat/AccurateMsg';
import DefaultMsg from './components/Chat/DefaultMsg';
import { Components, Config, Ctx, Handlers, ObjectType, Requests } from './types';
import useAutoCompletes from '../hooks/useAutoCompletes';
import { AutoCompleteItemProps } from '../components/AutoCompletes';

interface ChatProProps {
  config: Config;
  requests: Requests;
  handlers: Handlers;
  components: Components;
}
const ChatPro: React.FC<ChatProProps> = ({ config, requests, components, handlers }) => {
  // 消息列表
  const { messages, appendMsg, updateMsg, deleteMsg, setTyping } = useMessages(config.messages);
  const { quickReplies, quickRepliesVisible, setQuickRepliesVisible } = useQuickReplies(
    config.quickReplies,
  );
  const { autoCompletes, autoCompletesVisible, setAutoCompletesVisible, setAutoCompletes } =
    useAutoCompletes(config.autoCompletes);

  const msgRef = React.useRef(null);

  const formatParams = (params: any) => {
    const newParams = {
      sceneId: requests.sceneId,
      userId: requests.userId,
      token: requests.token,
      channel: 1,
      version: 0,
    };
    return { ...newParams, ...params };
  };

  const toolbar = [
    {
      type: 'smile',
      icon: 'smile',
      title: '表情',
    },
    {
      type: 'orderSelector',
      icon: 'shopping-bag',
      title: '宝贝',
    },
    {
      type: 'image',
      icon: 'image',
      title: '图片',
    },
    {
      type: 'camera',
      icon: 'camera',
      title: '拍照',
    },
    {
      type: 'photo',
      title: 'Photo',
      img: 'https://gw.alicdn.com/tfs/TB1eDjNj.T1gK0jSZFrXXcNCXXa-80-80.png',
    },
  ];
  const fetchData = (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data: ObjectType,
    ...options: any
  ) => {
    if (method === 'GET' || method === 'DELETE') {
      return requests.request(url, {
        params: formatParams(data),
        method,
        getResponse: true,
        ...options,
      });
    } else {
      return requests.request(url, {
        data: formatParams(data),
        method,
        getResponse: true,
        ...options,
      });
    }
  };
  const formatReceiveMessage = handlers?.formatReceiveMsg || formatReceiveMsg;
  const ctx: Ctx = {
    config,
    requests,
    appendMessage: appendMsg,
    updateMessage: updateMsg,
    deleteMessage: deleteMsg,
    postMessage: handleSend,
    util: {
      fetchData: fetchData,
      openWindow: (url: string) => {
        window.open(url);
      },
      popWindow() {
        window.close();
      },
      toast: toast,
      formatReceiveMessage,
    },
    ui: {
      hideQuickReplies: () => setQuickRepliesVisible(false),
      showQuickReplies: () => setQuickRepliesVisible(true),
      setAutoCompletes: (list: AutoCompleteItemProps[]) => setAutoCompletes(list),
    },
  };

  // 发送回调
  function handleSend(type: string, val: string) {
    if (type === 'text' && val.trim()) {
      // TODO: 发送请求
      appendMsg({
        type: 'text',
        content: { text: val },
        position: 'right',
      });

      setTimeout(() => {
        setTyping(true);
      }, 10);

      requests
        .send({
          type: 'text',
          content: { text: val },
        })
        .then((res) => {
          let { url, options } = res;
          if (requests.baseUrl) {
            url = requests.baseUrl + url;
          }
          ctx.util
            .fetchData(
              url,
              'GET',
              {
                ...options.params,
              },
              options,
            )
            .then(({ data }) => {
              if (data.retCode == 1) {
                const msgData = formatReceiveMessage(data.data);
                appendMsg({
                  type: msgData.answerType,
                  content: { data: msgData, meta: {} },
                });
              } else {
                toast.fail(data.message || '请求失败');
              }
            });
        });
    }
  }

  // 快捷短语回调，可根据 item 数据做出不同的操作，这里以发送文本消息为例
  function handleQuickReplyClick(item: QuickReplyItemProps) {
    if (item.code == 'text') {
      handleSend('text', item.name);
    } else {
      if (handlers.onClickQuickReply) {
        handlers.onClickQuickReply(item, ctx);
      }
    }
  }
  function handleAutoComplete(item: AutoCompleteItemProps) {
    if (item.code == 'text') {
      handleSend('text', item.name);
    } else {
      if (handlers.onClickAutoComplete) {
        handlers.onClickAutoComplete(item, ctx);
      }
    }
    setAutoCompletesVisible(false);
  }
  function handleInputChange(value: string) {
    if (handlers.onInputChange) {
      handlers.onInputChange(value, ctx);
    }
  }
  function handleToolbarClick(item: ToolbarItemProps) {
    if (handlers.onToolbarClick) {
      handlers.onToolbarClick(item, ctx);
    }
  }
  const TemplateTypeList = ['text', 'image', 0, 1];
  function renderMessageContent(msg: MessageProps) {
    const { type = '' } = msg;

    const MsgCard = components ? components[type] : null;
    if (MsgCard) {
      return <MsgCard data={msg?.content?.data} meta={msg?.content?.meta || {}} ctx={ctx} />;
    } else {
      if (TemplateTypeList.includes(type)) {
      } else {
        toast.show('请注册模板组件');
      }
    }
    // 根据消息类型来渲染
    switch (type) {
      case 'text':
        return <Bubble content={msg?.content?.text} />;

      case 'image':
        return (
          <Bubble type="image">
            <img src={msg?.content?.picUrl} alt="" />
          </Bubble>
        );
      case 0:
        return <DefaultMsg data={msg?.content?.data} meta={msg?.content?.meta || {}} ctx={ctx} />;
      case 1:
        return <AccurateMsg data={msg?.content?.data} meta={msg?.content?.meta || {}} ctx={ctx} />;

      default:
        return null;
    }
  }

  return (
    <Chat
      messagesRef={msgRef}
      toolbar={config.toolbar || toolbar}
      onToolbarClick={handleToolbarClick}
      recorder={{ canRecord: config.inputType == 'voice' }}
      wideBreakpoint="600px"
      messages={getNoClickList(messages)}
      renderMessageContent={renderMessageContent}
      quickReplies={quickReplies}
      quickRepliesVisible={quickRepliesVisible}
      autoCompletes={autoCompletes}
      autoCompletesVisible={autoCompletesVisible}
      onAutoCompleteClick={handleAutoComplete}
      onQuickReplyClick={handleQuickReplyClick}
      onSend={handleSend}
      onInputChange={handleInputChange}
      placeholder={config.placeholder}
      onImageSend={() => Promise.resolve()}
    />
  );
};
export default ChatPro;
