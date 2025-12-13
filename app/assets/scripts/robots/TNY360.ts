import { TNYRobot } from "./TNYRobot";

export class TNY360 extends TNYRobot {
    public static MOTORS_COUNT = 14;

    private motorCurrentAngles: number[] = Array(TNY360.MOTORS_COUNT).fill(0);
    private motorTargetAngles: number[] = Array(TNY360.MOTORS_COUNT).fill(0);

    constructor() {
        super('TNY - 360');
    }

    public useTNYServer(server: globalThis.TNYServer): void {
        // simple ping command to check connection
        server.handle(0x00, [], [Type.BOOL], async () => {
            return [true];
        });

        // get motor current angle
        server.handle(0x20, [Type.BYTE], [Type.FLOAT], async (motorIndex: number) => {
            if (motorIndex < 0 || motorIndex >= TNY360.MOTORS_COUNT) {
                throw new Error(`Invalid motor index: ${motorIndex}`);
            }
            return [this.motorCurrentAngles[motorIndex]];
        });

        // get motor target angle
        server.handle(0x21, [Type.BYTE], [Type.FLOAT], async (motorIndex: number) => {
            if (motorIndex < 0 || motorIndex >= TNY360.MOTORS_COUNT) {
                throw new Error(`Invalid motor index: ${motorIndex}`);
            }
            return [this.motorTargetAngles[motorIndex]];
        });

        // set motor target angle
        server.handle(0x60, [Type.BYTE, Type.FLOAT], [], async (motorIndex: number, angle: number) => {
            if (motorIndex < 0 || motorIndex >= TNY360.MOTORS_COUNT) {
                throw new Error(`Invalid motor index: ${motorIndex}`);
            }
            this.motorTargetAngles[motorIndex] = angle;
            return [];
        });
    }

    public override update(deltaTime: number): void {
        // Update motor angles towards target angles
        const speed = 180; // degrees per second
        for (let i = 0; i < TNY360.MOTORS_COUNT; i++) {
            const target = this.motorTargetAngles[i];
            const current = this.motorCurrentAngles[i];
            if ((target === undefined) || (current === undefined)) continue;

            const diff = target - current;
            if (Math.abs(diff) > 0.1) {
                const step = Math.sign(diff) * speed * deltaTime;
                this.motorCurrentAngles[i] = current + step;
                // Clamp to target
                if (Math.sign(diff) !== Math.sign(target - (current + step))) {
                    this.motorCurrentAngles[i] = target;
                }
            }
        }

        let text = "[";
        for (let i = 0; i < TNY360.MOTORS_COUNT; i++) {
            text = text.concat(this.motorCurrentAngles[i]?.toFixed(1) ?? "x.x");
            if (i < TNY360.MOTORS_COUNT - 1) text = text.concat(", ");
        }
        text = text.concat("]");
        console.log(text);
    }
}