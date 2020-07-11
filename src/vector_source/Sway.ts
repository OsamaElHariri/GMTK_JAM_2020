import { NumberUtils } from "../utils/NumberUtils";

export class Sway {

    private ratio = 0
    private incrementDirection = 1;

    constructor(public baseLength: number, public minScale: number, public maxScale: number, public ratioIncrement: number) { }

    update() {
        if (this.ratio <= 0) this.incrementDirection = 1;
        else if (this.ratio >= 1) this.incrementDirection = -1;
        this.ratio = NumberUtils.clamp(this.ratio + this.ratioIncrement * this.incrementDirection, 0, 1);
    }

    getLength() {
        return NumberUtils.map(this.minScale, this.maxScale,
            Phaser.Math.Easing.Quadratic.InOut(this.ratio)
        ) * this.baseLength;
    }
}