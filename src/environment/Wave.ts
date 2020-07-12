import { World } from "../world/World";

export class Wave extends Phaser.GameObjects.Sprite {

    body: Phaser.Physics.Arcade.Body;
    waveSpeed = 30;

    constructor(public world: World, public x: number, public y: number, spriteKey: string, forward = true) {
        super(world.scene, x, y, spriteKey);
        this.setOrigin(0.5);
        world.scene.addObject(this);
        world.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);

        let xVelocity = spriteKey == 'wave_flipped' ? 1 : 0;
        let yVelocity = spriteKey == 'wave' ? -1 : 0;
        this.setScale(0.5);
        if (!forward) {
            xVelocity *= -1;
            yVelocity *= -1;
            this.setScale(-0.5);
            this.body.setOffset(this.width, this.height)
        }

        this.setDepth(10);
        this.body.setVelocity(xVelocity * this.waveSpeed, yVelocity * this.waveSpeed);

    }

    update(time, delta) {
    }

    destroy() {
        super.destroy();
    }
}