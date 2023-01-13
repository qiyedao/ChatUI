import React from 'react';
import Chat, {
  Bubble,
  MessageProps,
  useMessages,
  QuickReplyItemProps,
  useQuickReplies,
  ToolbarItemProps,
} from '../index';
import { formatReceiveMsg } from './chat';
import DefaultMsg from './components/Chat/DefaultMsg';
import { Components, Config, Handlers, Requests } from './types';

type MessageWithoutId = Omit<MessageProps, '_id'>;

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

interface ChatProProps {
  config: Config;
  requests: Requests;
  handlers: Handlers;
  components: Components;
}
const ChatPro: React.FC<ChatProProps> = ({ config, requests, handlers, components }) => {
  // 消息列表
  const { messages, appendMsg, setTyping, prependMsgs } = useMessages(config.messages);
  const { quickReplies, replace } = useQuickReplies(config.quickReplies);
  const msgRef = React.useRef(null);

  // 发送回调
  function handleSend(type: string, val: string) {
    console.log('messages', messages);
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
    }
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
        requests
          .request(url, {
            ...options,
            params: {
              ...options.params,
              sceneId: requests.sceneId,
              userId: requests.userId,
              token: requests.token,
            },
            getResponse: true,
          })
          .then(({ data }) => {
            if (data.retCode == 1) {
              console.log('daa');
              const msgData = formatReceiveMsg(data.data);
              appendMsg({
                type: msgData.answerType,
                content: { text: '亲，您遇到什么问题啦？请简要描述您的问题~', meta: msgData },
              });
            }
          });
      });
  }

  // 快捷短语回调，可根据 item 数据做出不同的操作，这里以发送文本消息为例
  function handleQuickReplyClick(item: QuickReplyItemProps) {
    handleSend('text', item.name);

    if (item.code === 'q1') {
      replace([
        {
          name: '短语a',
          code: 'qa',
          isHighlight: true,
        },
        {
          name: '短语b',
          code: 'qb',
        },
      ]);
    } else if (item.code === 'orderSelector') {
      appendMsg({
        type: 'order-selector',
        content: {},
      });
    }
  }

  function handleToolbarClick(item: ToolbarItemProps) {
    if (item.type === 'orderSelector') {
      appendMsg({
        type: 'order-selector',
        content: {},
      });
    }
  }

  function renderMessageContent(msg: MessageProps) {
    const { type = '', content } = msg;

    const MsgCard = components[type];
    if (MsgCard) {
      return (
        <MsgCard
          data={msg}
          meta={content?.meta || {}}
          ctx={{
            appendMessage: appendMsg,
          }}
        />
      );
    }
    // 根据消息类型来渲染
    switch (type) {
      case 'text':
        return <Bubble content={content.text} />;

      case 'image':
        return (
          <Bubble type="image">
            <img src={content.picUrl} alt="" />
          </Bubble>
        );
      case 0:
        return <DefaultMsg {...content?.meta} />;

      default:
        return null;
    }
  }

  return (
    <Chat
      toolbar={config.toolbar || toolbar}
      messagesRef={msgRef}
      onToolbarClick={handleToolbarClick}
      recorder={{ canRecord: config.inputType == 'voice' }}
      wideBreakpoint="600px"
      messages={messages}
      renderMessageContent={renderMessageContent}
      quickReplies={quickReplies}
      onQuickReplyClick={handleQuickReplyClick}
      onSend={handleSend}
      onImageSend={() => Promise.resolve()}
    />
  );
};
export default ChatPro;
