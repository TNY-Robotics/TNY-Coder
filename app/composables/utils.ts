export class EventEmitter<Events extends Record<string, any[]>> {
    private listeners: {
        [K in keyof Events]?: ((...args: Events[K]) => void)[]
    } = {};

    on<K extends keyof Events>(event: K, callback: (...args: Events[K]) => void) {
        (this.listeners[event] ??= []).push(callback);
    }

    off<K extends keyof Events>(event: K, callback: (...args: Events[K]) => void) {
        this.listeners[event] = (this.listeners[event] ?? []).filter(cb => cb !== callback);
    }

    emit<K extends keyof Events>(event: K, ...args: Events[K]) {
        for (const cb of this.listeners[event] ?? []) {
            cb(...args);
        }
    }
}