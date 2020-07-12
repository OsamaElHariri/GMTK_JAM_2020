import { Scene } from "./Scene";
import { Interval } from "../utils/interval";

export class LoadingScene extends Scene {
    constructor() {
        super('LoadingScene');
    }

    preload() {
        this.loadAssets();
        this.constructLoadingScrean();
    }

    private loadAssets() {
        // this.load.audio('ipsi', '../assets/audio/Ipsi.mp3');

        this.load.image('boat', '../assets/sprites/boat.png');
        this.load.image('sailors', '../assets/sprites/sailors.png');
        this.load.image('oar', '../assets/sprites/oar.png');
        this.load.image('rock1', '../assets/sprites/rock1.png');
        this.load.image('rain_particle', '../assets/sprites/rain_particle.png');
        this.load.image('rain_particles', '../assets/sprites/rain_particles.png');
        this.load.image('rock_ripple', '../assets/sprites/rock_ripple.png');
        this.load.image('wave', '../assets/sprites/wave.png');
        this.load.image('ocean_ripple', '../assets/sprites/ocean_ripple.png');
        this.load.image('boat_ripple', '../assets/sprites/boat_ripple.png');
        this.load.image('thunder_screen', '../assets/sprites/thunder_screen.png');
        this.load.image('rock_barrier', '../assets/sprites/rock_barrier.png');
        this.load.image('boat_fragment', '../assets/sprites/boat_fragment.png');

        // https://www.deviantart.com/berserkitty/art/Seamless-Cartoon-styled-Water-Texture-743787929
        this.load.image('water_texture', '../assets/sprites/water_texture.png');
    }

    private constructLoadingScrean(): void {
    }

    create(): void {
        this.scene.start('MainScene');
    }

}