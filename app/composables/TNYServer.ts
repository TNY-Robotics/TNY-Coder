const WebSocket = require('ws');

export type TNYServerEvents = {
    connected: []
    disconnected: []
    error: []
}

type HandlerFunction = (...args: any[]) => Promise<any[]>;
interface CommandHandler {
    inputTypes: Type[];
    outputTypes: Type[];
    handler: HandlerFunction;
}

export class TNYServer extends EventEmitter<TNYServerEvents> {
    private wss: any;

    private handlers: Map<CommandID, CommandHandler> = new Map();

    constructor(port: number = 5621) {
        super();

        this.wss = new WebSocket.Server({ port });

        this.wss.on('connection', (ws: any) => {
            this.emit('connected');
            ws.on('message', (msg: Buffer) => {
                if (msg.length < 1) {
                    console.warn('Received empty message');
                    return;
                }
                const randomId = msg.readUInt16LE(0);
                const commandId = msg.readUInt8(2);
                const handlerEntry = this.handlers.get(commandId);
                if (!handlerEntry) {
                    console.warn(`No handler for random ID: ${randomId}`);
                    return;
                }
                const { inputTypes, outputTypes, handler } = handlerEntry;
                const expectedInputSize = sizeof(inputTypes);
                if (msg.length - 1 < expectedInputSize) {
                    console.warn(`Insufficient data for command ID ${commandId}: expected ${expectedInputSize}, got ${msg.length - 1}`);
                    return;
                }
                let offset = 3;
                const inputs: any[] = [];
                for (const type of inputTypes) {
                    switch (type) {
                        case Type.BYTE:  inputs.push(msg.readUInt8(offset)); break;
                        case Type.INT:   inputs.push(msg.readInt32LE(offset)); break;
                        case Type.FLOAT: inputs.push(msg.readFloatLE(offset)); break;
                        case Type.BOOL:  inputs.push(!!msg.readUInt8(offset)); break;
                        default: throw new Error(`Unknown type: ${type}`);
                    }
                    offset += sizeof(type);
                }
                handler(...inputs).then((outputs) => {
                    const expectedOutputSize = sizeof(outputTypes);
                    const responseBuffer = Buffer.alloc(1 + expectedOutputSize);
                    responseBuffer.writeUInt8(commandId, 0);
                    let outOffset = 1;
                    for (let i = 0; i < outputTypes.length; i++) {
                        const type = outputTypes[i];
                        const value = outputs[i];
                        switch (type) {
                            case Type.BYTE:  responseBuffer.writeUInt8(value, outOffset); break;
                            case Type.INT:   responseBuffer.writeInt32LE(value, outOffset); break;
                            case Type.FLOAT: responseBuffer.writeFloatLE(value, outOffset); break;
                            case Type.BOOL:  responseBuffer.writeUInt8(value ? 1 : 0, outOffset); break;
                            default: throw new Error(`Unknown type: ${type}`);
                        }
                        outOffset += sizeof(type);
                    }
                    ws.send(responseBuffer);
                }).catch((err) => {
                    console.error(`Error handling command ID ${commandId}:`, err);
                });
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

    public handle(commandId: CommandID, inputTypes: Type[], outputTypes: Type[], handler: HandlerFunction) {
        if (this.handlers.has(commandId)) {
            throw new Error(`Handler for command ID ${commandId} already exists`);
        }
        this.handlers.set(commandId, { inputTypes, outputTypes, handler });
    }

    public clearHandlers() {
        this.handlers.clear();
    }
}