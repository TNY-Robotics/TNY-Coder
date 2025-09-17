export type TNYRemoteEvents = {
    loaded: []
    connected: []
    disconnected: []
    error: []
}


export class RobotError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "RobotError";
    }
}

export class TNYRemote extends EventEmitter<TNYRemoteEvents> {
    private static Instance : TNYRemote | null = null;
    private static Ref : Ref<TNYRemote | null> = ref(null);

    public static getInstance() {
        return this.Instance;
    }

    public static getRef() {
        return this.Ref;
    }
    
    private socket: WebSocket;
    private connected: boolean = false;

    private pendingRequests: Map<string, (data: any) => void> = new Map();

    private invoke(type: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.socket.readyState === WebSocket.OPEN) {
                const requestId = crypto.randomUUID();
                console.log('invoke', type, data, requestId);
                this.pendingRequests.set(requestId, resolve);
                this.socket.send(JSON.stringify({ type, id: requestId, data }));
            } else {
                reject(new Error('Socket is not open'));
            }
        });
    }

    constructor(url: string) {
        super();

        if (TNYRemote.Instance) {
            TNYRemote.Instance.close();
        }
        TNYRemote.Instance = this;
        TNYRemote.Ref.value = this;

        this.socket = new WebSocket(url);
        this.socket.onopen = () => {
            this.emit('loaded');
            this.socket.send(JSON.stringify({ type: 'ping' }));
        };
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'pong') {
                this.emit('connected');
                this.connected = true;
            }

            if (message.type === 'response' && message.id) {
                console.log('response', message);
                const resolver = this.pendingRequests.get(message.id);
                if (resolver) {
                    resolver(message.data);
                    this.pendingRequests.delete(message.id);
                } else {
                    console.warn(`No resolver found for request ID: ${message.id}`);
                }
            }
            if (message.type === 'error' && message.id) {
                const resolver = this.pendingRequests.get(message.id);
                if (resolver) {
                    resolver(Promise.reject(new RobotError(message.error)));
                    this.pendingRequests.delete(message.id);
                }
            }
        };
        this.socket.onerror = (event) => {
            this.emit('error');
        };
        this.socket.onclose = () => {
            if (this.connected) {
                this.emit('disconnected');
            }
            
            if (TNYRemote.Instance === this) {
                TNYRemote.Instance = null;
                TNYRemote.Ref.value = null;
            }
        };
    }

    public close() {
        this.socket.close();
    }

    public getMotorRotation(id: number): Promise<number> {
        return new Promise((resolve, reject) => {
            this.invoke('getMotorRotation', { id }).then(resolve).catch(reject);
        });
    }

    public rotateMotorBy(id: number, angle: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.invoke('rotateMotorBy', { id, angle }).then(resolve).catch(reject);
        });
    }

    public setMotorRotation(id: number, angle: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.invoke('setMotorRotation', { id, angle }).then(resolve).catch(reject);
        });
    }
}