import { TNYRobot } from "./TNYRobot";

export class TNY360 extends TNYRobot {
    public static JOINTS_COUNT = 14;

    private jointCurrentAngles: number[] = Array(TNY360.JOINTS_COUNT).fill(0);
    private jointTargetAngles: number[] = Array(TNY360.JOINTS_COUNT).fill(0);

    constructor() {
        super('TNY - 360');
    }

    public useTNYServer(server: globalThis.TNYServer): void {
        // simple ping command to check connection
        server.handle(0x00, [], [Type.BOOL], async () => {
            return [true];
        });

        // get joint target angle
        server.handle(0x20, [Type.BYTE], [Type.FLOAT], async (jointIndex: number) => {
            if (jointIndex < 0 || jointIndex >= TNY360.JOINTS_COUNT) {
                throw new Error(`Invalid joint index: ${jointIndex}`);
            }
            return [this.jointCurrentAngles[jointIndex]];
        });

        // get joint current angle
        server.handle(0x21, [Type.BYTE], [Type.FLOAT], async (jointIndex: number) => {
            if (jointIndex < 0 || jointIndex >= TNY360.JOINTS_COUNT) {
                throw new Error(`Invalid joint index: ${jointIndex}`);
            }
            return [this.jointTargetAngles[jointIndex]];
        });

        // set joint target angle
        server.handle(0x60, [Type.BYTE, Type.FLOAT], [], async (jointIndex: number, angle: number) => {
            if (jointIndex < 0 || jointIndex >= TNY360.JOINTS_COUNT) {
                throw new Error(`Invalid joint index: ${jointIndex}`);
            }
            this.jointTargetAngles[jointIndex] = angle;
            return [];
        });
    }

    public override update(deltaTime: number): void {
        // Update joint angles towards target angles
        const speed = 180; // degrees per second
        for (let i = 0; i < TNY360.JOINTS_COUNT; i++) {
            const target = this.jointTargetAngles[i];
            const current = this.jointCurrentAngles[i];
            if ((target === undefined) || (current === undefined)) continue;

            const diff = target - current;
            if (Math.abs(diff) > 0.1) {
                const step = Math.sign(diff) * speed * deltaTime;
                this.jointCurrentAngles[i] = current + step;
                // Clamp to target
                if (Math.sign(diff) !== Math.sign(target - (current + step))) {
                    this.jointCurrentAngles[i] = target;
                }
            }
        }

        let text = "[";
        for (let i = 0; i < TNY360.JOINTS_COUNT; i++) {
            text = text.concat(this.jointCurrentAngles[i]?.toFixed(1) ?? "x.x");
            if (i < TNY360.JOINTS_COUNT - 1) text = text.concat(", ");
        }
        text = text.concat("]");
        console.log(text);
    }
}