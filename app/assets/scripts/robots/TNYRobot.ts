export abstract class TNYRobot {
    constructor(public name: string) {
        this.name = name;
    }

    public abstract useTNYServer(remote: TNYServer): void;

    public abstract update(deltaTime: number): void;
}