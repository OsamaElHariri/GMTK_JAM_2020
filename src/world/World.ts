import { MainScene } from "../scenes/MainScene";
import { Signals } from "../Signals";
import { InputsMoveEngine } from "../move_engines/InputsMoveEngine";
import { Forces, Force } from "./Forces";
import { Sway } from "../vector_source/Sway";
import { LinearVectorSource } from "../vector_source/LinearVectorSource";
import { RadialVectorSource } from "../vector_source/RadialVectorSource";
import { Player } from "../actors/Player";
import { NumberUtils } from "../utils/NumberUtils";


export class World extends Phaser.GameObjects.Container {
    static worldCount = 0;

    private id: number;

    forces = new Forces();
    private windForce: Force;

    rainManagers: Phaser.GameObjects.Particles.ParticleEmitterManager[] = [];
    rain: Phaser.GameObjects.Particles.ParticleEmitter[] = [];

    rainSprite: Phaser.GameObjects.TileSprite;
    rainSprite2: Phaser.GameObjects.TileSprite;
    rainSprite3: Phaser.GameObjects.TileSprite;

    constructor(public scene: MainScene) {
        super(scene);
        this.id = scene.addObject(this);
        World.worldCount += 1;
        this.registerListeners();
        const player = new Player(this, 400, 400).moveWith(new InputsMoveEngine());
        player.forces = this.forces;

        this.windForce = {
            sway: new Sway(150, -0.25, 1.5, 0.005),
            source: new LinearVectorSource(new Phaser.Math.Vector2(200, 200))
        };

        this.forces
            .add({
                sway: new Sway(150, -0.5, 2, 0.007),
                source: new RadialVectorSource(new Phaser.Math.Vector2(200, 200), 400)
            })
            .add(this.windForce);

        this.scene.add.sprite(200, 200, 'rock1').setScale(0.5);

        scene.addObject(player);
        this.rainSprite = this.scene.add.
            tileSprite(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height, 'rain_particles')
            .setOrigin(0)
            .setAlpha(0.5)
            .setDepth(200);
        this.rainSprite2 = this.scene.add.
            tileSprite(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height, 'rain_particles')
            .setOrigin(0)
            .setAlpha(0.4)
            .setDepth(200)
            .setTilePosition(250);
        this.rainSprite3 = this.scene.add.
            tileSprite(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height, 'rain_particles')
            .setOrigin(0)
            .setAlpha(0.3)
            .setDepth(200)
            .setTilePosition(500);
        // this.createWindParticles();
    }

    createWindParticles(): void {
        const particleConfig = {
            // scale: { start: 0.2, end: 0.2, },    
            scaleX: { start: 0.6, end: 0.6 },
            scaleY: { start: 0.6, end: 0.6 },
            alpha: { start: 0.8, end: 0, ease: 'quadratic' },
            lifespan: 5000,
            // speed: { min: 60, max: 80 },
            // angle: { min: 105, max: 115 },
            quantity: 1,
            frequency: 1,
            // rotate: { min: 0, max: 360 },
            tint: [0xfafafa, 0xaaaaff, 0xffffff],

        };

        let rainManager = this.scene.add.particles('rain_particle');
        let rain = rainManager.setDepth(200).createEmitter({
            ...particleConfig,
            emitZone: { source: new Phaser.Geom.Rectangle(-20, 0, 10, this.scene.cameras.main.height) }
        });
        this.rainManagers.push(rainManager);
        this.rain.push(rain);

        rainManager = this.scene.add.particles('rain_particle');
        rain = rainManager.setDepth(200).createEmitter({
            ...particleConfig,
            emitZone: { source: new Phaser.Geom.Rectangle(0, -20, this.scene.cameras.main.width, 10) }
        });
        this.rainManagers.push(rainManager);
        this.rain.push(rain);

        rainManager = this.scene.add.particles('rain_particle');
        rain = rainManager.setDepth(200).createEmitter({
            ...particleConfig,
            emitZone: { source: new Phaser.Geom.Rectangle(this.scene.cameras.main.width + 20, 0, 10, this.scene.cameras.main.height) }
        });
        this.rainManagers.push(rainManager);
        this.rain.push(rain);

        rainManager = this.scene.add.particles('rain_particle');
        rain = rainManager.setDepth(200).createEmitter({
            ...particleConfig,
            emitZone: { source: new Phaser.Geom.Rectangle(0, this.scene.cameras.main.height + 20, this.scene.cameras.main.width, 10) }
        });
        this.rainManagers.push(rainManager);
        this.rain.push(rain);
    }

    private registerListeners() {
        const emitter = this.scene.getEmitter();

        emitter.on(Signals.PlayerSpawn, () => {
        });
    }

    update() {
        this.forces.update();

        const windDirection = this.windForce.source.getDirection(new Phaser.Math.Vector2(0, 0));
        windDirection.scale(this.windForce.sway.getLength());

        this.rainSprite.tilePositionX -= windDirection.x / 12;
        this.rainSprite.tilePositionY -= windDirection.y / 12;

        this.rainSprite2.tilePositionX -= windDirection.x / 16;
        this.rainSprite2.tilePositionY -= windDirection.y / 16;

        this.rainSprite3.tilePositionX -= windDirection.x / 20;
        this.rainSprite3.tilePositionY -= windDirection.y / 20;

        // const yScale = 0.6 + NumberUtils.clamp(0, 0.4, windDirection.x / 300);
        // this.rain.forEach(rain => {
        //     rain
        //         .setSpeedX({
        //             min: windDirection.x, max: windDirection.x
        //         })
        //         .setScaleX({
        //             min: yScale, max: yScale
        //         })
        //         .setSpeedY({
        //             min: windDirection.y, max: windDirection.y
        //         });
        // });
    }

    destroy() {
        if (!this.active) return;
        this.scene.getEmitter().removeAllListeners();
        this.scene.stopUpdating(this.id);
        super.destroy();
    }
}