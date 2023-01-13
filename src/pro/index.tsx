import React from 'react';
import ReactDOM from 'react-dom';
import ChatPro from './ChatPro';
import { Components, Config, Handlers, Options, Requests } from './types';

export class ChatSDK {
  root: HTMLElement;
  components: Components | undefined;
  requests: Requests | undefined;
  config: Config | undefined;
  handlers: Handlers | undefined;
  constructor(options: Options) {
    this.root = options.root;
    this.config = options.config;
    this.requests = options.requests;
    this.components = options.components;
    this.handlers = options.handlers;
  }
  handleMessageAvtar() {
    console.log('token 5');

    if (this.config) {
      const messages = this.config?.messages || [];
      messages.map((item) => {
        if (item.type !== 'system') {
          if (item.position == 'right') {
            item.user = this.config?.user || {};
          } else {
            item.user = this.config?.robot || {};
          }
        }
      });
      this.config.messages = messages;
    }
  }
  async handleGetToken() {
    console.log('token 2');

    if (this.requests?.tokenUrl) {
      const { data } = await this.requests.request(this.requests.baseUrl + this.requests.tokenUrl, {
        params: {
          param: 'test',
          channel: 1,
          version: 0,
          userId: this.requests.userId,
          sceneId: this.requests.sceneId,
        },
        getResponse: true,
      });
      if (data.retCode == 1) {
        if (this.requests) {
          this.requests.token = data.data;
          console.log('token', '3');
        }
      }
      console.log(data, 'res');
    }
  }

  async init() {
    setTimeout(() => {
      console.log('0');

      new Promise((resolve) => {
        console.log('00');
        resolve('00');
        console.log('000');
      }).then((res) => {
        console.log('0000');
      });
    });
    console.log('token 1');
    await this.handleGetToken();
    console.log('token 4');

    setTimeout(() => {
      console.log('01');

      new Promise((resolve) => {
        console.log('001');
        resolve('001');
        console.log('0001');
      }).then((res) => {
        console.log('00001');
      });
    });
    this.handleMessageAvtar();
    console.log(this.requests?.token, 'token 6', this.requests?.tokenUrl);

    ReactDOM.render(
      <ChatPro
        config={this.config as Config}
        requests={this.requests as Requests}
        handlers={this.handlers as Handlers}
        components={this.components as Components}
      />,
      this.root,
    );
  }
}
window.ChatSDK = ChatSDK;
