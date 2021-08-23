export class Observer {
    channels: { [c: string]: Array<Function> };

    constructor() {
        this.channels = {};
    }

    watch(channel: string, fn: Function) {
        if (!this.channels[channel]) this.channels[channel] = [];
        this.channels[channel].push(fn);
    }

    send(om: ObserverMessage) {
        if (!this.channels[om.channel]) return;
        for (let f of this.channels[om.channel]) {
            f(om.message);
        }
    }
}

export type ObserverMessage = {
    channel: string,
    message?: any
}