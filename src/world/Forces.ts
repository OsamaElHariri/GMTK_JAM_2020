import { Sway } from "../vector_source/Sway";
import { VectorSource } from "../vector_source/VectorSource";

export type Force = { sway: Sway, source: VectorSource };
export class Forces {

    forces: Force[] = [];

    constructor() { }

    add(force: Force): Forces {
        this.forces.push(force);
        return this;
    }

    getForces(pos: Phaser.Math.Vector2): Phaser.Math.Vector2[] {
        return this.forces.map(force => {
            const sourceDir = force.source.getDirection(pos);
            sourceDir.scale(force.sway.getLength() * force.source.getDecay(pos));
            return sourceDir;
        });
    }

    update() {
        this.forces.forEach(force => {
            force.sway.update();
        });
    }
}