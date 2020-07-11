export class VectorSource {
    constructor() {

    }

    update() {

    }

    getDirection(pos: Phaser.Math.Vector2) {
        return new Phaser.Math.Vector2(1, 0);
    }

    getDecay(pos: Phaser.Math.Vector2) {
        return 1;
    }
}