import { Scene } from "./Scene";

export class ThankYouScene extends Scene {
    constructor() {
        super('ThankYouScene');
    }

    create() {
        this.add.sprite(0, 0, 'thanks_screen').setOrigin(0);
        this.input.keyboard.on('keydown-SPACE', event => {
            this.scene.start('MainScene');
        });
    }
}