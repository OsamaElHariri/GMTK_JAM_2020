import { World } from "../world/World";
import { MoveEngine } from "../move_engines/MoveEngine";
import { EmptyMoveEngine } from "../move_engines/EmptyMoveEngine";
import { CircleUtils } from "../utils/CircleUtils";
import { Forces } from "../world/Forces";

export class Actor extends Phaser.GameObjects.Ellipse {
    id: number;

    body: Phaser.Physics.Arcade.Body;
    facingRotation = 0;

    forces = new Forces();

    speed: number = 160;

    protected mainContainer: Phaser.GameObjects.Container;

    protected moveEngine: MoveEngine = new EmptyMoveEngine();

    constructor(public world: World, public x: number, public y: number) {
        super(world.scene, x, y, 12, 12);
        this.id = world.scene.addObject(this);
        world.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.depth = 10;

        this.mainContainer = this.scene.add.container(x, y).setDepth(100);
    }

    setSpeed(speed: number) {
        this.speed = speed;
        return this;
    }

    moveWith(moveEngine: MoveEngine) {
        this.moveEngine = moveEngine;
        return this;
    }

    update(time: number, delta: number) {
        if (!this.active) return;
        const originalMoveVector = this.getMoveVector();
        const moveVector = originalMoveVector.clone();

        this.forces.getForces(new Phaser.Math.Vector2(this.x, this.y)).forEach(force => {
            moveVector.add(force);
        });

        this.mainContainer.setPosition(this.x, this.y);
        this.setBodyVelocity(moveVector.x, moveVector.y);

        const thetaDiff = CircleUtils.rotationTowardsTargetTheta(this.mainContainer.rotation, this.facingRotation);
        this.mainContainer.rotation += 0.05 * thetaDiff;

        const velocity = originalMoveVector.normalize();
        if (velocity.length()) {
            const radians = Math.atan2(velocity.y, velocity.x) + Math.PI / 2;
            this.faceMoveDirection(radians);
        }
    }

    setBodyVelocity(x: number, y: number) {
        this.body.setVelocity(x, y);
    }

    protected faceMoveDirection(rotation: number) {
        this.facingRotation = rotation;
    }

    setSpriteRotation(rotation) {
        this.mainContainer.rotation = rotation;
    }

    protected getMoveVector() {
        const moveVector = new Phaser.Math.Vector2(this.moveEngine.getHorizontalAxis(), this.moveEngine.getVerticalAxis()).normalize();
        return moveVector.scale(this.speed);
    }

    destroy() {
        if (!this.active) return;
        this.mainContainer.destroy();
        super.destroy();
    }

}