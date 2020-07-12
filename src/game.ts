import "phaser";
import { SetupScene } from "./scenes/SetupScene";
import { LoadingScene } from "./scenes/LoadingScene";
import { MainScene } from './scenes/MainScene';
import { ThankYouScene } from './scenes/ThankYouScene';

const config: Phaser.Types.Core.GameConfig = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: "game",
  disableContextMenu: true,
  backgroundColor: '#5577EE',
  scene: [
    SetupScene,
    LoadingScene,
    MainScene,
    ThankYouScene,
  ],
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
      gravity: { y: 600 }
    }
  }
};

let game: Phaser.Game = new Phaser.Game(config);
