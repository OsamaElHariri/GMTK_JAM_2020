import { VectorSource } from "./VectorSource"

export class LinearVectorSource extends VectorSource {
    constructor(public direction: Phaser.Math.Vector2) {
        super();
    }

    update() {

    }

    getDirection(pos: Phaser.Math.Vector2) {
        return this.direction.clone().normalize();
    }
}