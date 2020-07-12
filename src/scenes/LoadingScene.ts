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
        // https://freesound.org/people/InspectorJ/sounds/360328/
        this.load.audio('thunder1', '../assets/audio/360328__inspectorj__thunder-very-close-rain-a.mp3');

        // https://freesound.org/people/Fission9/sounds/465314/
        this.load.audio('thunder2', '../assets/audio/465314__fission9__thunder.mp3');

        // https://freesound.org/people/SpaceJoe/sounds/505469/
        this.load.audio('heavy_rain', '../assets/audio/505469__spacejoe__heavy-rain-and-wind.mp3');

        this.load.image('boat', '../assets/sprites/boat.png');
        this.load.image('sailors', '../assets/sprites/sailors.png');
        this.load.image('oar', '../assets/sprites/oar.png');
        this.load.image('rock1', '../assets/sprites/rock1.png');
        this.load.image('rain_particle', '../assets/sprites/rain_particle.png');
        this.load.image('rain_particles', '../assets/sprites/rain_particles.png');
        this.load.image('rock_ripple', '../assets/sprites/rock_ripple.png');
        this.load.image('wave', '../assets/sprites/wave.png');
        this.load.image('wave_flipped', '../assets/sprites/wave_flipped.png');
        this.load.image('ocean_ripple', '../assets/sprites/ocean_ripple.png');
        this.load.image('boat_ripple', '../assets/sprites/boat_ripple.png');
        this.load.image('thunder_screen', '../assets/sprites/thunder_screen.png');
        this.load.image('rock_barrier', '../assets/sprites/rock_barrier.png');
        this.load.image('boat_fragment', '../assets/sprites/boat_fragment.png');
        this.load.image('land', '../assets/sprites/land.png');
        this.load.image('thanks_screen', '../assets/sprites/thanks_screen.png');
        this.load.image('crash_screen', '../assets/sprites/crash_screen.png');
        this.load.image('controls_screen', '../assets/sprites/controls_screen.png');

        // https://www.deviantart.com/berserkitty/art/Seamless-Cartoon-styled-Water-Texture-743787929
        this.load.image('water_texture', '../assets/sprites/water_texture.png');
    }

    private constructLoadingScrean(): void {
        this.add.sprite(0, 0, 'loading_screen').setOrigin(0);

        const loader = this.add.sprite(400, 200, 'loader')
            .setOrigin(0.5);
        this.add.tween({
            targets: [loader],
            duration: 1500,
            repeat: -1,
            angle: {
                getStart: () => 360,
                getEnd: () => 0,
            },
        });
    }

    create(): void {
        this.scene.start('MainScene');
    }

}