import Phaser from 'phaser'
import { AnimKeys, ImageKeys, JSONKeys } from './keys'
import ObstaclesController from './ObstaclesController'
import PlayerController from './PlayerController'
import SnowmanController from './SnowmanController'

export default class Game extends Phaser.Scene
{
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	private penquin?: Phaser.Physics.Matter.Sprite;
	private playerController?: PlayerController;

	constructor()
	{
		super('game')
	}

	init()
	{
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	create()
	{
		this.scene.launch('ui')

		const map = this.make.tilemap({
			key: JSONKeys.tilemap,
		});
		const tileset = map.addTilesetImage('iceworld', ImageKeys.tiles);

		const ground = map.createLayer('ground', tileset, 0, 0);
		const background = map.createLayer('background', tileset, 0, 0);

		ground.setCollisionByProperty({
			collides: true
		})

		this.cameras.main.scrollY = 240;

		const objectsLayer = map.getObjectLayer('objects')

		objectsLayer.objects.forEach(objData => {
			const {width, height} = this.scale;
			const {x = width*0.5, y = height*1.3, name} = objData

			switch (name)
			{
				case 'penguin-spawn':
				{
					this.penquin = this.matter.add.sprite(x, y, ImageKeys.penquin)
					.setFixedRotation();
					this.playerController = new PlayerController(this.penquin, this.cursors);
					this.cameras.main.startFollow(this.penquin);

					//this.matter.add.sprite(x, y-100, ImageKeys.star);
					break;
				}

				case 'star':
				{
					const star = this.matter.add.sprite(x, y, ImageKeys.star, undefined, {
						isStatic: true,
						isSensor: true,
						
					});

					star.setData('type', 'star')
					break;
				}
			}
		})

		this.matter.world.convertTilemapLayer(ground);
	}

	destroy()
	{
		
	}

	update(t: number, dt: number)
	{
		if (!this.playerController)
		{
			return
		}

		this.playerController.update(dt);

	}

	
}
