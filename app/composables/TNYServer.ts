const WebSocket = require('ws');

export type TNYServerEvents = {
    connected: []
    disconnected: []
    error: []
}

export class TNYServer extends EventEmitter<TNYServerEvents> {
    private wss: any;

    private handlers: Map<string, (data: any) => Promise<any>> = new Map();

    constructor(port: number = 5621) {
        super();

        this.wss = new WebSocket.Server({ port });

        this.wss.on('connection', (ws: any) => {
            this.emit('connected');
            ws.on('message', (message: string) => {
                const content = JSON.parse(message);
                console.log('content', content);
                if (content.type === 'ping') {
                    ws.send(JSON.stringify({ type: 'pong' }));
                    return;
                }

                // Handle other message types as needed
                const handler = this.handlers.get(content.type);
                if (handler) {
                    handler(content.data).then((response) => {
                        ws.send(JSON.stringify({ type: 'response', id: content.id, data: response }));
                    }).catch((error) => {
                        ws.send(JSON.stringify({ type: 'error', id: content.id, error: error.message }));
                    });
                } else {
                    ws.send(JSON.stringify({ type: 'error', id: content.id, error: 'Unknown command' }));
                }
            });
            ws.on('close', () => {
                this.emit('disconnected');
            });
            ws.on('error', (error: any) => {
                this.emit('error');
            });
        });
    }

    public close() {
        this.wss.close();
    }

    public handle(type: string, handler: (data: any) => Promise<any>) {
        this.handlers.set(type, handler);
    }
}