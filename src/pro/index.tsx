import React from 'react';
import ReactDOM from 'react-dom';
import request from 'umi-request';
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
    if (!options.requests.request) {
      options.requests.request = request;
    }
    if (!options.requests.tokenUrl) {
      options.requests.tokenUrl = '/qa/security/token/';
    }
    if (!options.requests.openMediaUrl) {
      options.requests.openMediaUrl = '/qa/manage/media/preview';
    }
    this.requests = options.requests;
    this.components = options.components;
    this.handlers = options.handlers;
  }
  setConfig(key: string | number, value: any) {
    this.config = {
      ...this.config,
      [key]: value,
    };
  }

  handleMessageAvtar() {
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
    if (this.requests?.tokenUrl && this.requests.request) {
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
        }
      }
    }
  }

  async init() {
    await this.handleGetToken();

    this.handleMessageAvtar();

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
