import React, { useEffect } from 'react';
import '../../../src';
export default () => {
  useEffect(() => {
    const chat = new window.ChatSDK({ root: document.getElementById('chat') as HTMLElement });
    chat.init();
  }, []);
  return <div style={{ height: 'calc(100vh - 0px)' }} id="chat"></div>;
};
