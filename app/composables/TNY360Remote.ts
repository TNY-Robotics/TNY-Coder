const DEG_TO_RAD = (x: number) => x * Math.PI / 180;
const RAD_TO_DEG = (x: number) => x * 180 / Math.PI;

export class TNY360Remote {
    constructor(private remote: TNYRemote) {
        this.remote = remote;
    }

    public ping(): Promise<boolean> {
        return this.remote.send(0x00, [], [Type.BOOL], []).then((args) => {
            return args[0] as boolean;
        });
    }

    public getJointState(jointIndex: number): Promise<boolean> {
        return this.remote.send(0x20, [Type.BYTE], [Type.BOOL], [jointIndex]).then((args) => {
            return args[0] as boolean;
        });
    }

    public getJointTarget(jointIndex: number): Promise<number> {
        return this.remote.send(0x21, [Type.BYTE], [Type.FLOAT], [jointIndex]).then((args) => {
            return RAD_TO_DEG(args[0] as number);
        });
    }

    public getJointPosition(jointIndex: number): Promise<number> {
        return this.remote.send(0x22, [Type.BYTE], [Type.FLOAT], [jointIndex]).then((args) => {
            return RAD_TO_DEG(args[0] as number);
        });
    }

    public setJointState(jointIndex: number, enabled: boolean): Promise<void> {
        return this.remote.send(0x60, [Type.BYTE, Type.BOOL], [], [jointIndex, enabled]).then(() => {});
    }

    public setJointTarget(jointIndex: number, angle: number): Promise<void> {
        return this.remote.send(0x61, [Type.BYTE, Type.FLOAT], [], [jointIndex, DEG_TO_RAD(angle)]).then(() => {});
    }

    public setBodyPosture(rotX: number, rotY: number, rotZ: number, posX: number, posY: number, posZ: number): Promise<void> {
        return this.remote.send(0x65, [Type.FLOAT, Type.FLOAT, Type.FLOAT, Type.FLOAT, Type.FLOAT, Type.FLOAT], [], [
            posX*10, // robot works in mm not cm
            posY*10, // robot works in mm not cm
            posZ*10, // robot works in mm not cm
            DEG_TO_RAD(rotX),
            DEG_TO_RAD(rotY),
            DEG_TO_RAD(rotZ),
        ]).then(() => {});
    }
}
