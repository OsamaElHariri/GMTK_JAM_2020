export class Scene extends Phaser.Scene {
    paused = false;

    private emitter: SceneEventEmitter;

    private objectCount = 0;
    private objects: { [id: number]: Phaser.GameObjects.GameObject } = {};

    getEmitter() {
        if (!this.emitter) {
            this.emitter = new SceneEventEmitter(this);
        }
        return this.emitter;
    }

    protected resetEmitter() {
        if (this.emitter) {
            this.emitter.destroy;
            this.emitter = null;
        }
    }

    addObject(object: Phaser.GameObjects.GameObject) {
        this.add.existing(object);
        this.objects[this.objectCount] = object;
        return this.objectCount++;
    }

    update(time: number, delta: number) {
        for (const id in this.objects) {
            if (this.objects.hasOwnProperty(id)) {
                const gameObject = this.objects[id];
                gameObject.update(time, delta / 1000);
            }
        }
    }

    stopUpdating(id: number) {
        delete this.objects[id];
    }
}

class SceneEventEmitter extends Phaser.GameObjects.GameObject {
    constructor(scene: Scene) {
        super(scene, '');
    }

    onSignal(event: string | symbol, fn: Function, context?: any): { cancel: Function } {
        super.on(event, fn, context);
        return {
            cancel: () => this.off(event, fn, context)
        }
    }
}