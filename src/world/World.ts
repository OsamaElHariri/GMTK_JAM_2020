import { MainScene } from "../scenes/MainScene";
import { Signals } from "../Signals";
import { InputsMoveEngine } from "../move_engines/InputsMoveEngine";
import { Forces, Force } from "./Forces";
import { Sway } from "../vector_source/Sway";
import { LinearVectorSource } from "../vector_source/LinearVectorSource";
import { RadialVectorSource } from "../vector_source/RadialVectorSource";
import { Player } from "../actors/Player";
import { Rock } from "../environment/Rock";
import { Wave } from "../environment/Wave";
import { Interval } from "../utils/interval";


export class World extends Phaser.GameObjects.Container {
    static worldCount = 0;

    private id: number;

    forces = new Forces();
    private windForce: Force;

    private rocks: Rock[] = [];
    private waves: Wave[] = [];

    rainManagers: Phaser.GameObjects.Particles.ParticleEmitterManager[] = [];
    rain: Phaser.GameObjects.Particles.ParticleEmitter[] = [];

    oceanRippleManager: Phaser.GameObjects.Particles.ParticleEmitterManager;
    oceanRipple: Phaser.GameObjects.Particles.ParticleEmitter;

    rainSprite: Phaser.GameObjects.TileSprite;
    rainSprite2: Phaser.GameObjects.TileSprite;
    rainSprite3: Phaser.GameObjects.TileSprite;
    thunderScreen: Phaser.GameObjects.Sprite;

    water: Phaser.GameObjects.TileSprite;
    counter = 0;


    constructor(public scene: MainScene) {
        super(scene);
        this.id = scene.addObject(this);
        World.worldCount += 1;
        this.registerListeners();
        const player = new Player(this, 400, 400).moveWith(new InputsMoveEngine());
        this.scene.cameras.main.startFollow(player, true, 0.6);
        player.forces = this.forces;
        this.thunderScreen = this.scene.add.sprite(0, 0, 'thunder_screen')
            .setAlpha(0)
            .setOrigin(0)
            .setDepth(1000);
        this.createThunder()

        this.windForce = {
            sway: new Sway(180, -1, 1, 0.005),
            source: new LinearVectorSource(new Phaser.Math.Vector2(1, 0))
        };

        const rockForces = this.createRockForces();

        this.forces
            .add(this.windForce);

        rockForces.forEach(rockForce => {
            this.forces.add(rockForce);
            const radialSource = rockForce.source as RadialVectorSource
            this.rocks.push(
                new Rock(this, radialSource.origin.x, radialSource.origin.y, rockForce).setRockScale(0.2)
            );
        });


        this.waves.push(
            new Wave(this, 200, 400).setScale(0.5)
        );

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
        this.water = this.scene.add.
            tileSprite(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height, 'water_texture')
            .setOrigin(0)
            .setAlpha(0.05)
            .setScale(1.5)
            .setDepth(0);
        // this.createWindParticles();
        // this.createOceanParticles();
    }

    createRockForces() {
        return [
            {
                sway: new Sway(150, -0.5, 2, 0.007),
                source: new RadialVectorSource(new Phaser.Math.Vector2(200, 200), 250)
            },
            {
                sway: new Sway(150, -0.5, 2, 0.006),
                source: new RadialVectorSource(new Phaser.Math.Vector2(450, -100), 250)
            },
            {
                sway: new Sway(150, -0.5, 2, 0.007),
                source: new RadialVectorSource(new Phaser.Math.Vector2(250, -150), 250)
            },

        ];
    }

    createOceanParticles() {
        this.oceanRippleManager = this.scene.add.particles('ocean_ripple');
        this.oceanRipple = this.oceanRippleManager.setDepth(0).createEmitter({
            scale: { start: 0.4, end: 0.4, },
            // alpha: { start: 0, end: 2, ease: 'quadratic' },
            lifespan: 5000,
            // speed: { min: 60, max: 80 },
            speedY: { min: -40, max: -80 },

            // angle: { min: 105, max: 115 },
            quantity: 1,
            frequency: 1000,
            // rotate: { min: 0, max: 360 },
            tint: [0xfafafa, 0xeeeeff, 0xffffff],
            emitZone: { source: new Phaser.Geom.Rectangle(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height) }
        });

        this.oceanRipple.setAlpha(function (p, k, t) {
            return (1 - 2 * Math.abs(t - 0.5)) * 0.6;
        });
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
        this.counter += 1;
        this.forces.update();

        const windDirection = this.windForce.source.getDirection(new Phaser.Math.Vector2(0, 0));
        windDirection.scale(this.windForce.sway.getLength());

        this.rainSprite.tilePositionX -= windDirection.x / 12;
        this.rainSprite.tilePositionY -= windDirection.y / 12;

        this.rainSprite2.tilePositionX -= windDirection.x / 16;
        this.rainSprite2.tilePositionY -= windDirection.y / 16;

        this.rainSprite3.tilePositionX -= windDirection.x / 20;
        this.rainSprite3.tilePositionY -= windDirection.y / 20;

        this.water.tilePositionX = this.scene.cameras.main.scrollX;
        this.water.tilePositionY = this.scene.cameras.main.scrollY + this.counter * 2;

        this.rainSprite.setPosition(this.scene.cameras.main.scrollX, this.scene.cameras.main.scrollY);
        this.rainSprite2.setPosition(this.scene.cameras.main.scrollX, this.scene.cameras.main.scrollY);
        this.rainSprite3.setPosition(this.scene.cameras.main.scrollX, this.scene.cameras.main.scrollY);
        this.water.setPosition(this.scene.cameras.main.scrollX, this.scene.cameras.main.scrollY);
        this.thunderScreen.setPosition(this.scene.cameras.main.scrollX, this.scene.cameras.main.scrollY);

        this.rocks.forEach(rock => {
            this.waves.forEach(wave => {
                if (!wave.active) return;
                this.scene.physics.collide(wave, rock, () => {
                    wave.destroy();
                })
            });
        });
    }

    async createThunder() {
        if (!this.active) return;
        await Interval.seconds(10 + Math.floor(10 * Math.random()));
        if (!this.active) return;
        this.scene.add.tween({
            targets: [this.thunderScreen],
            repeat: 1,
            yoyo: true,
            duration: 70,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1,
            },
            onComplete: () => {
                this.createThunder();
            },
        });

    }

    destroy() {
        if (!this.active) return;
        this.scene.getEmitter().removeAllListeners();
        this.scene.stopUpdating(this.id);
        super.destroy();
    }
}