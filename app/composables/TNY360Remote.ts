export class TNY360Remote {
    constructor(private remote: TNYRemote) {
        this.remote = remote;
    }

    public ping(): Promise<boolean> {
        return this.remote.send(0x00, [], [Type.BOOL], []).then((args) => {
            return args[0] as boolean;
        });
    }

    public getMotorCurrentAngle(motorIndex: number): Promise<number> {
        return this.remote.send(0x20, [Type.BYTE], [Type.FLOAT], [motorIndex]).then((args) => {
            return args[0] as number;
        });
    }

    public getMotorTargetAngle(motorIndex: number): Promise<number> {
        return this.remote.send(0x21, [Type.BYTE], [Type.FLOAT], [motorIndex]).then((args) => {
            return args[0] as number;
        });
    }

    public setMotorTargetAngle(motorIndex: number, angle: number, duration: number = 0.0): Promise<void> {
        return this.remote.send(0x60, [Type.BYTE, Type.FLOAT, Type.FLOAT], [], [motorIndex, angle, duration]).then(() => {});
    }

    public setLEDColor(id: number, hexColor: string, duration: number = 0.5): Promise<void> {
        if (hexColor.startsWith('#')) {
            hexColor = hexColor.slice(1);
        }
        const r = parseInt(hexColor.slice(0, 2), 16);
        const g = parseInt(hexColor.slice(2, 4), 16);
        const b = parseInt(hexColor.slice(4, 6), 16);
        return this.remote.send(0x62, [Type.BYTE, Type.BYTE, Type.BYTE, Type.BYTE, Type.FLOAT], [], [id, r, g, b, duration]).then(() => {});
    }
}
