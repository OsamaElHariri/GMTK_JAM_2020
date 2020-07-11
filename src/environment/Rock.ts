import { World } from "../world/World";
import { Force } from "../world/Forces";
import { RadialVectorSource } from "../vector_source/RadialVectorSource";

export class Rock extends Phaser.GameObjects.Sprite {

    private rockRipple: Phaser.GameObjects.Sprite;
    private rangeIndicatorRipple: Phaser.GameObjects.Sprite;
    private forceIndicatorRipple: Phaser.GameObjects.Sprite;

    private counter = 0;

    body: Phaser.Physics.Arcade.Body;

    constructor(public world: World, public x: number, public y: number, private force: Force) {
        super(world.scene, x, y, 'rock1');
        world.scene.addObject(this);
        world.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);

        this.setDepth(10);

        this.rangeIndicatorRipple = this.scene.add.sprite(x, y, 'rock_ripple')
            .setTint(0xcdf1f0)
            .setAlpha(0.15);
        const initialRangeScale = (force.source as RadialVectorSource).effectRadius * 2 / this.rangeIndicatorRipple.width;

        this.scene.add.tween({
            targets: [this.rangeIndicatorRipple],
            duration: 1000,
            yoyo: true,
            repeat: -1,
            scaleX: {
                getStart: () => initialRangeScale - 0.05,
                getEnd: () => initialRangeScale + 0.05,
            },
            scaleY: {
                getStart: () => initialRangeScale - 0.05,
                getEnd: () => initialRangeScale + 0.05,
            },
        });

        this.forceIndicatorRipple = this.scene.add.sprite(x, y, 'rock_ripple')
            .setTint(0xa8dcda)
            .setAlpha(0.3);

        this.rockRipple = this.scene.add.sprite(x, y, 'rock_ripple')
            .setTint(0xeffffe)
            .setAlpha(0.6);
        this.rockRipple
            .setScale(this.width / this.rockRipple.width);

    }

    setRockScale(x: number) {
        super.setScale(x);
        this.rockRipple.setScale(this.width / this.rockRipple.width * x + 0.05);
        return this;
    }

    update(time, delta) {
        this.counter += 1;
        this.rockRipple.setRotation(Math.sin(this.counter / 100) * Math.PI / 4);
        this.rangeIndicatorRipple.setRotation(Math.sin(this.counter / 150) * Math.PI / 6);
        this.forceIndicatorRipple.setRotation(Math.sin(this.counter / 200) * Math.PI / 8);

        const minScale = this.rockRipple.scaleX * 0.9;
        const maxScale = this.rangeIndicatorRipple.scaleX * 0.9;
        const sway = this.force.sway;
        const swayLength = -sway.getLength();
        this.forceIndicatorRipple.setScale(this.forceIndicatorRipple.scaleX + 0.005 * Math.sign(swayLength));
        if (this.forceIndicatorRipple.scaleX <= minScale && swayLength < 0) {
            this.forceIndicatorRipple.setScale(maxScale);
        } else if (this.forceIndicatorRipple.scaleX >= maxScale && swayLength > 0) {
            this.forceIndicatorRipple.setScale(minScale);
        } else {
            let multiplier = 1;
            if (Math.abs(sway.maxScale) < Math.abs(sway.minScale) && swayLength < 0) {
                multiplier = 0.1;
            } else if (Math.abs(sway.maxScale) > Math.abs(sway.minScale) && swayLength > 0) {
                multiplier = 0.1;
            }

            this.forceIndicatorRipple.setScale(this.forceIndicatorRipple.scaleX + 0.0005 * Math.sign(swayLength) * multiplier);
        }

        const alpha = (1 - (this.forceIndicatorRipple.scaleX - minScale) / (maxScale - minScale)) * 0.3;
        this.forceIndicatorRipple.setAlpha(alpha);
    }

    destroy() {
        this.rockRipple.destroy();
        this.rangeIndicatorRipple.destroy();
        this.forceIndicatorRipple.destroy();
        super.destroy();
    }
}