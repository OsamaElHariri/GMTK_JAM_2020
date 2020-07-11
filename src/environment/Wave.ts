import { World } from "../world/World";

export class Wave extends Phaser.GameObjects.Sprite {

    body: Phaser.Physics.Arcade.Body;

    constructor(public world: World, public x: number, public y: number) {
        super(world.scene, x, y, 'wave');
        world.scene.addObject(this);
        world.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);

        this.setDepth(10);
        this.body.setVelocity(0, -30);

    }

    update(time, delta) {
    }

    destroy() {
        super.destroy();
    }
}