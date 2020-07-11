import { World } from "../world/World";
import { Actor } from "./Actor";
import { NumberUtils } from "../utils/NumberUtils";

export class Player extends Actor {
    private counter = 0;
    private oars: Phaser.GameObjects.Sprite[] = [];
    private spriteScale = 0.3;
    private oarRotationStrength = 0;
    private oarRotationStrengthIncrement = 0.01;

    constructor(public world: World, public x: number, public y: number) {
        super(world, x, y);

        this.mainContainer.add([
            this.scene.add.sprite(0, 0, 'boat')
                .setOrigin(0.5)
                .setScale(this.spriteScale),
            ...this.getOars(),
            this.scene.add.sprite(0, 24 * this.spriteScale, 'sailors')
                .setOrigin(0.5)
                .setScale(this.spriteScale),
        ]);
    }

    getOars() {
        const topLeftOar = this.scene.add.sprite(-40 * this.spriteScale, -35 * this.spriteScale, 'oar')
            .setOrigin(0.5, 0.75)
            .setRotation(-Math.PI / 2)
            .setScale(this.spriteScale);

        const topRightOar = this.scene.add.sprite(40 * this.spriteScale, -35 * this.spriteScale, 'oar')
            .setOrigin(0.5, 0.75)
            .setRotation(Math.PI / 2)
            .setScale(this.spriteScale);

        const bottomLeftOar = this.scene.add.sprite(-40 * this.spriteScale, 76 * this.spriteScale, 'oar')
            .setOrigin(0.5, 0.75)
            .setRotation(-Math.PI / 2)
            .setScale(this.spriteScale);
        const bottomRightOar = this.scene.add.sprite(40 * this.spriteScale, 76 * this.spriteScale, 'oar')
            .setOrigin(0.5, 0.75)
            .setRotation(Math.PI / 2)
            .setScale(this.spriteScale);

        this.oars = [
            topLeftOar,
            topRightOar,
            bottomLeftOar,
            bottomRightOar,
        ];
        return this.oars;
    }

    update(time, delta) {
        super.update(time, delta);
        this.counter += 1;

        if (this.moveEngine.getHorizontalAxis() !== 0 || this.moveEngine.getVerticalAxis() !== 0) {
            if (this.oarRotationStrength < 1) this.oarRotationStrength += this.oarRotationStrengthIncrement;
        } else {
            if (this.oarRotationStrength > 0.1) this.oarRotationStrength -= this.oarRotationStrengthIncrement;
        }
        this.oarRotationStrength = NumberUtils.clamp(0.1, 1, this.oarRotationStrength);

        this.oars.forEach((oar, index) => {
            const initialRotation = Math.sign(oar.rotation) * Math.PI / 2;
            oar.setRotation(
                initialRotation
                + Math.sign(oar.rotation)
                * this.oarRotationStrength
                * Math.sin((this.counter + index * 5) / 20)
                * Math.PI / 6)
        });
    }
}