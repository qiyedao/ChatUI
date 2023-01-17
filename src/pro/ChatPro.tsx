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
import umiRequest from 'umi-request';
import { MessageContainerHandle } from '../components/MessageContainer';
import { ComposerHandle } from '../components/Composer';
interface ChatProProps {
  config: Config;
  requests: Requests;
  handlers: Handlers;
  components: Components;
}
const ChatPro: React.FC<ChatProProps> = (props) => {
  const { config, requests, components, handlers } = props;

  const {
    send = async (msg) => {
      return {
        url: '/qa/server/qa/question',
        options: {
          params: {
            questioning: msg.content.text,
            version: 0,
            channel: 1,
          },
        },
      };
    },
    request = umiRequest,
  } = requests;
  // 消息列表
  const { messages, appendMsg, updateMsg, deleteMsg, setTyping } = useMessages(config.messages);
  const { quickReplies, quickRepliesVisible, setQuickRepliesVisible } = useQuickReplies(
    config.quickReplies,
  );
  const { autoCompletes, autoCompletesVisible, setAutoCompletes } = useAutoCompletes(
    config.autoCompletes,
  );

  const msgRef = React.useRef<MessageContainerHandle>(null);
  const composerRef = React.useRef<ComposerHandle>(null);
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
      type: 'image',
      icon: 'image',
      title: '图片',
    },
    {
      type: 'camera',
      icon: 'camera',
      title: '拍照',
    },
  ];
  const fetchData = (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data: ObjectType,
    ...options: any
  ) => {
    if (method === 'GET' || method === 'DELETE') {
      return request(url, {
        params: formatParams(data),
        method,
        getResponse: true,
        ...options,
      });
    } else {
      return request(url, {
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
    setAutoCompletes: (list: AutoCompleteItemProps[]) => setAutoCompletes(list),

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
    log: {
      click(params, logParams) {
        handlers?.track?.({ ...logParams, ...params });
      },
    },
    ui: {
      hideQuickReplies: () => setQuickRepliesVisible(false),
      showQuickReplies: () => setQuickRepliesVisible(true),
      scrollToEnd: scrollToEnd,
    },
  };

  function scrollToEnd({ animated = true }) {
    msgRef?.current?.scrollToEnd({ animated });
  }
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

      send({
        type: 'text',
        content: { text: val },
      }).then((res) => {
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
    handlers?.track?.({ event: 'QuickReplyClick', item });
  }
  function handleAutoComplete(item: AutoCompleteItemProps) {
    handleSend('text', item.name);
    handlers?.track?.({ event: 'AutoCompleteClick', item });

    if (handlers.onClickAutoComplete) {
      handlers.onClickAutoComplete(item, ctx);
    }

    composerRef?.current?.setText('');

    setAutoCompletes([]);
  }

  function handleInputChange(value: string) {
    if (handlers.onInputChange) {
      handlers.onInputChange(value, ctx);
    }
    handlers?.track?.({ event: 'InputChange', value });
  }
  function handleToolbarClick(item: ToolbarItemProps) {
    if (handlers.onToolbarClick) {
      handlers.onToolbarClick(item, ctx);
    }
    handlers?.track?.({ event: 'ToolbarClick', item });
  }
  function onSend(type: string, val: string) {
    handleSend(type, val);
    handlers?.track?.({ event: 'SendClick', val });
    setAutoCompletes([]);
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
      composerRef={composerRef}
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
      onSend={onSend}
      onInputChange={handleInputChange}
      placeholder={config.placeholder}
      onImageSend={() => Promise.resolve()}
    />
  );
};
export default ChatPro;
