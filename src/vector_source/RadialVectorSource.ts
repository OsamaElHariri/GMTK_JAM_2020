import { VectorSource } from "./VectorSource"
import { NumberUtils } from "../utils/NumberUtils";

export class RadialVectorSource extends VectorSource {
    constructor(public origin: Phaser.Math.Vector2, public effectRadius: number) {
        super();
    }

    update() {

    }

    getDirection(pos: Phaser.Math.Vector2) {
        return new Phaser.Math.Vector2(this.origin.x - pos.x, this.origin.y - pos.y).normalize();
    }

    getDecay(pos: Phaser.Math.Vector2) {
        return 1 - NumberUtils.clamp(0, 1, pos.distance(this.origin) / this.effectRadius);
    }
}