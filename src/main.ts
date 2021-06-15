import Phaser from 'phaser'
import Preloader from './scenes/preloader'
import Game from './scenes/Game'
import UI from './scenes/UI'
import GameOver from './scenes/GameOver'
import { ColorKeys } from './scenes/keys'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 600,
	height: 600,
	backgroundColor: ColorKeys.lightCyan,
	physics: {
		default: 'matter',
		matter: {
			debug: true
		}
	},
	scene: [Preloader, Game, UI, GameOver]
}

export default new Phaser.Game(config)
