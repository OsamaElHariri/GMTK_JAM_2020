import { Scene } from "./Scene";

export class SetupScene extends Scene {

    constructor() {
        super({
            key: "SetupScene"
        });
    }

    preload(): void {
        this.load.image('loading_screen', '../assets/sprites/loading_screen.png');
        this.load.image('loader', '../assets/sprites/loader.png');
    }

    create(): void {
        this.scene.start('LoadingScene');
    }
}