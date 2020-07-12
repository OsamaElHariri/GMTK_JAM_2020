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
    private player: Player;

    forces = new Forces();
    private windForce: Force;
    private oceanForce: Force;

    private rocks: Rock[] = [];
    private waves: Wave[] = [];

    rainManagers: Phaser.GameObjects.Particles.ParticleEmitterManager[] = [];
    rain: Phaser.GameObjects.Particles.ParticleEmitter[] = [];

    shipWreckManager: Phaser.GameObjects.Particles.ParticleEmitterManager;
    shipWreck: Phaser.GameObjects.Particles.ParticleEmitter;

    rainSprite: Phaser.GameObjects.TileSprite;
    rainSprite2: Phaser.GameObjects.TileSprite;
    rainSprite3: Phaser.GameObjects.TileSprite;
    thunderScreen: Phaser.GameObjects.Sprite;

    water: Phaser.GameObjects.TileSprite;
    oceanCounter = 0;

    leftRockBarrierIndicator: Phaser.GameObjects.Rectangle;
    rightRockBarrierIndicator: Phaser.GameObjects.Rectangle;
    leftRockBarrier: Phaser.GameObjects.TileSprite;
    rightRockBarrier: Phaser.GameObjects.TileSprite;

    constructor(public scene: MainScene) {
        super(scene);
        this.id = scene.addObject(this);
        World.worldCount += 1;
        this.registerListeners();
        this.player = new Player(this, 400, 400).moveWith(new InputsMoveEngine());
        this.scene.cameras.main.startFollow(this.player, true, 0.6);
        this.player.forces = this.forces;
        this.thunderScreen = this.scene.add.sprite(0, 0, 'thunder_screen')
            .setAlpha(0)
            .setOrigin(0)
            .setDepth(1000);
        this.createThunder()

        this.windForce = {
            sway: new Sway(180, -1, 1, 0.005),
            source: new LinearVectorSource(new Phaser.Math.Vector2(1, 0))
        };

        this.oceanForce = {
            sway: new Sway(20, -1, 1, 0.004),
            source: new LinearVectorSource(new Phaser.Math.Vector2(0, 1))
        };

        const rockForces = this.createRockForces();

        this.forces
            .add(this.oceanForce)
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

        this.leftRockBarrier = this.scene.add.
            tileSprite(-660, 0, 660, 1200, 'rock_barrier')
            .setOrigin(0)
            .setDepth(1);
        this.leftRockBarrierIndicator = this.scene.add.rectangle(
            this.leftRockBarrier.x,
            this.leftRockBarrier.y,
            this.leftRockBarrier.width - 50,
            this.leftRockBarrier.height,
            0xff77aa,
            0.2)
            .setOrigin(0);

        this.rightRockBarrier = this.scene.add.
            tileSprite(1000, 0, 660, 1200, 'rock_barrier')
            .setOrigin(0)
            .setDepth(1);
        this.rightRockBarrierIndicator = this.scene.add.rectangle(
            this.rightRockBarrier.x + 50,
            this.rightRockBarrier.y,
            this.rightRockBarrier.width - 50,
            this.rightRockBarrier.height,
            0xff77aa,
            0.2)
            .setOrigin(0);
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

    createWindParticles(): void {
        const particleConfig = {
            scaleX: { start: 0.6, end: 0.6 },
            scaleY: { start: 0.6, end: 0.6 },
            alpha: { start: 0.8, end: 0, ease: 'quadratic' },
            lifespan: 5000,
            quantity: 1,
            frequency: 1,
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

        if (this.oceanForce.sway.getLength() < 0) this.oceanCounter += 1;
        else this.oceanCounter += 2;

        this.water.tilePositionX = this.scene.cameras.main.scrollX;
        this.water.tilePositionY = this.scene.cameras.main.scrollY + this.oceanCounter;

        this.rainSprite.setPosition(this.scene.cameras.main.scrollX, this.scene.cameras.main.scrollY);
        this.rainSprite2.setPosition(this.scene.cameras.main.scrollX, this.scene.cameras.main.scrollY);
        this.rainSprite3.setPosition(this.scene.cameras.main.scrollX, this.scene.cameras.main.scrollY);
        this.water.setPosition(this.scene.cameras.main.scrollX, this.scene.cameras.main.scrollY);
        this.thunderScreen.setPosition(this.scene.cameras.main.scrollX, this.scene.cameras.main.scrollY);

        this.leftRockBarrier.tilePositionY = this.scene.cameras.main.scrollY;
        this.leftRockBarrier.y = this.scene.cameras.main.scrollY;
        this.leftRockBarrierIndicator.y = this.scene.cameras.main.scrollY;
        this.rightRockBarrier.tilePositionY = this.scene.cameras.main.scrollY;
        this.rightRockBarrier.y = this.scene.cameras.main.scrollY;
        this.rightRockBarrierIndicator.y = this.scene.cameras.main.scrollY;

        this.rocks.forEach(rock => {
            this.waves.forEach(wave => {
                if (!wave.active) return;
                this.scene.physics.collide(wave, rock, () => {
                    wave.destroy();
                })
            });
        });

        let playerCollision = false;
        this.rocks.forEach(rock => {
            this.scene.physics.collide(this.player, rock, () => {
                playerCollision = true;
            })
        });

        if (playerCollision) this.destroyPlayer();

        if (this.player.active) {
            if (this.player.getCenter().x < this.leftRockBarrier.getRightCenter().x - 50) {
                this.destroyPlayer();
            } else if (this.player.getCenter().x > this.rightRockBarrier.getLeftCenter().x + 50) {
                this.destroyPlayer();
            }

        }
    }

    destroyPlayer() {
        this.createShipWreckParticles();
        this.player.destroy();
    }

    createShipWreckParticles() {
        this.shipWreckManager = this.scene.add.particles('boat_fragment');
        this.shipWreck = this.shipWreckManager.setDepth(10).createEmitter({
            scale: this.player.spriteScale,
            alpha: { start: 1, end: 0, ease: 'quadratic' },
            lifespan: 800,
            speed: 200,
            rotate: { min: 0, max: 360 },
            quantity: 40,
            tint: [0xfafafa, 0xffffff],
            emitZone: { source: new Phaser.Geom.Rectangle(0, 0, 3, 3) }
        });
        this.shipWreck.explode(40, this.player.x, this.player.y);

    }

    async createThunder() {
        if (!this.active) return;
        await Interval.seconds(10 + Math.floor(7 * Math.random()));
        if (!this.active) return;
        this.scene.cameras.main.shake(100, 0.03);
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