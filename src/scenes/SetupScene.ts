import { Scene } from "./Scene";

export class SetupScene extends Scene {

    constructor() {
        super({
            key: "SetupScene"
        });
    }

    preload(): void {
    }

    create(): void {
        this.scene.start('LoadingScene');
    }
}