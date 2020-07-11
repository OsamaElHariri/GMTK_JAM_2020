import { InputKeys } from "../inputs/InputKeys";
import { Scene } from "./Scene";
import { World } from "../world/World";
import { Signals } from "../Signals";
import { Interval } from "../utils/interval";


export class MainScene extends Scene {

    world: World;
    muted = false;

    constructor() {
        super('MainScene');
    }

    create(): void {
        this.resetEmitter();
        InputKeys.setKeyboard(this.input.keyboard);
        this.setupListeners();
        this.world = new World(this);
    }

    private setupListeners() {
        const emitter = this.getEmitter();

        emitter.on(Signals.PlayerSpawn, async () => {
        });
    }
}