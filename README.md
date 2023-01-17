## Install

```bash
npm install chat-pro --save
```

```bash
yarn add chat-pro
```

## Usage

```jsx
import Chat, { Bubble, useMessages } from 'chat-pro';
import 'chat-pro/dist/index.css';

const App = () => {
  const { messages, appendMsg, setTyping } = useMessages([]);

  function handleSend(type, val) {
    if (type === 'text' && val.trim()) {
      appendMsg({
        type: 'text',
        content: { text: val },
        position: 'right',
      });

      setTyping(true);

      setTimeout(() => {
        appendMsg({
          type: 'text',
          content: { text: 'Bala bala' },
        });
      }, 1000);
    }
  }

  function renderMessageContent(msg) {
    const { content } = msg;
    return <Bubble content={content.text} />;
  }

  return (
    <Chat
      navbar={{ title: 'Assistant' }}
      messages={messages}
      renderMessageContent={renderMessageContent}
      onSend={handleSend}
    />
  );
};
```

## Theme

Visit [Customize Theme](https://chatui.io/docs/customize-theme) for detail
