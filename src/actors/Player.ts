import { World } from "../world/World";
import { Actor } from "./Actor";
import { NumberUtils } from "../utils/NumberUtils";
import { Interval } from "../utils/interval";

export class Player extends Actor {
    spriteScale = 0.25;
    private counter = 0;
    private oars: Phaser.GameObjects.Sprite[] = [];
    private oarRotationStrength = 0;
    private oarRotationStrengthIncrement = 0.01;

    private boostTimeThreshold = 200;
    private boostAmount = 50;
    private boostTime = 300;

    private horizontalBoostVal = 0;
    private horizontalBoostTime = 0;
    private horizontalBoostUntil = 0;
    private verticalBoostVal = 0;
    private verticalBoostTime = 0;
    private verticalBoostUntil = 0;

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
        this.spawnBoatRipples();
    }

    async spawnBoatRipples() {
        if (!this.active) return;
        await Interval.milliseconds(150);
        if (!this.active) return;
        const ripple = this.scene.add.sprite(0, 0, 'boat_ripple');

        const container = this.scene.add.container(this.x, this.y, [ripple])
            .setRotation(this.body.velocity.angle() + Math.PI / 2)
            .setScale(Math.random() < 0.5 ? 1 : -1, 1);
        this.scene.add.tween({
            targets: [ripple],
            duration: 800,
            y: {
                getStart: () => 0,
                getEnd: () => 100,
            },
            scaleX: {
                getStart: () => 0.1,
                getEnd: () => 0.6,
            },
            scaleY: {
                getStart: () => 0.1,
                getEnd: () => 0.6,
            },
            alpha: {
                getStart: () => 0.6,
                getEnd: () => 0,
            },
            onComplete: () => {
                if (this.active && container.active) container.removeAll(true).destroy();
            }
        });
        this.spawnBoatRipples();
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
        if (!this.active) return;
        super.update(time, delta);
        this.counter += 1;

        const verticalEngineBoost = this.moveEngine.getVerticalAxisJustPressed();
        if (verticalEngineBoost) {

            if (this.verticalBoostVal === verticalEngineBoost && Date.now() - this.verticalBoostTime < this.boostTimeThreshold) {
                this.verticalBoostUntil = Date.now() + this.boostTime;
            } else {
                this.verticalBoostUntil = 0;
                this.verticalBoostVal = verticalEngineBoost;
            }
            this.verticalBoostTime = Date.now();
        }

        const horizontalEngineBoost = this.moveEngine.getHorizontalAxisJustPressed();
        if (horizontalEngineBoost) {

            if (this.horizontalBoostVal === horizontalEngineBoost && Date.now() - this.horizontalBoostTime < this.boostTimeThreshold) {
                this.horizontalBoostUntil = Date.now() + this.boostTime;
            } else {
                this.horizontalBoostUntil = 0;
                this.horizontalBoostVal = horizontalEngineBoost;
            }
            this.horizontalBoostTime = Date.now();
        }

        const hasBoost = this.hasVerticalBoost() || this.hasHorizontalBoost();
        if (this.moveEngine.getHorizontalAxis() !== 0
            || this.moveEngine.getVerticalAxis() !== 0
            || hasBoost) {
            if (this.oarRotationStrength < 1) this.oarRotationStrength += this.oarRotationStrengthIncrement;
        } else {
            if (this.oarRotationStrength > 0.1) this.oarRotationStrength -= this.oarRotationStrengthIncrement;
        }
        this.oarRotationStrength = NumberUtils.clamp(0.1, 1, this.oarRotationStrength);
        let oarRotationStrength = this.oarRotationStrength;

        if (hasBoost) this.counter += 4;
        this.oars.forEach((oar, index) => {
            const initialRotation = Math.sign(oar.rotation) * Math.PI / 2;
            oar.setRotation(
                initialRotation
                + Math.sign(oar.rotation)
                * oarRotationStrength
                * Math.sin((this.counter + index * 6) / 20)
                * Math.PI / 6)
        });
    }

    protected getMoveVector() {
        const moveVector = new Phaser.Math.Vector2(this.moveEngine.getHorizontalAxis(), this.moveEngine.getVerticalAxis());
        if (this.hasVerticalBoost()) {
            moveVector.y = this.verticalBoostVal;
        }
        if (this.hasHorizontalBoost()) {
            moveVector.x = this.horizontalBoostVal;
        }
        return moveVector.normalize().scale(this.speed);
    }

    setBodyVelocity(x: number, y: number) {
        if (this.hasVerticalBoost()) y += this.boostAmount * this.verticalBoostVal;
        if (this.hasHorizontalBoost()) x += this.boostAmount * this.horizontalBoostVal;
        super.setBodyVelocity(x, y);
    }

    hasVerticalBoost() {
        return Date.now() < this.verticalBoostUntil;
    }

    hasHorizontalBoost() {
        return Date.now() < this.horizontalBoostUntil;
    }
}