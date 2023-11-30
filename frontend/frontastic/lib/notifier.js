export class Notifier {
  constructor(context, messageHandlers = {}) {
    this.context = {
      customer: 'demo',
      idDebug: false,
      endpoint: 'preview',
      ...context,
    };
    this.messageHandlers = messageHandlers;

    if (!this.context.previewId) {
      throw new Error('context.previewId is required');
    }

    this.webSocket = null;
    this.connected = false;
    this.connectionFails = 0;

    this.connect();
  }

  connect() {
    this.webSocket = new WebSocket(
      (this.context.isDebug ? 'ws://' : 'wss://') +
        `${this.context.customer}.frontastic.io` +
        (this.context.isDebug ? '.local' : '') +
        `:8080/ws?${this.context.endpoint}=${this.context.previewId}`,
    );

    this.webSocket.onmessage = this.handleMessage.bind(this);
    this.webSocket.onopen = () => {
      this.connectionFails = 0;
      this.connected = true;
    };
    this.webSocket.onclose = () => {
      this.webSocket = null;
      this.connected = false;
      setTimeout(this.connect.bind(this), Math.min(++this.connectionFails, 30) * 1000);
    };
  }

  handleMessage(event) {
    let message = JSON.parse(event.data);

    if (message.Name === 'Ping') {
      return;
    }

    if (this.messageHandlers[message.Name]) {
      return this.messageHandlers[message.Name](message.Payload, message);
    }

    // eslint-disable-next-line no-console
    console.info('Unknown WebSocket message', message);
    // Do nothing for other messages
  }

  sendMessage(message, retry = false) {
    message.Channel = this.context.previewId;
    message.Payload = message.Payload || [];

    if (this.connected) {
      return this.webSocket.send(JSON.stringify(message));
    }

    if (retry) {
      setTimeout(() => {
        this.sendMessage(message, true);
      }, 100);
    }
  }
}
