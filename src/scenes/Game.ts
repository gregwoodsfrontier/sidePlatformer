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
	private obstacles!: ObstaclesController;

	constructor()
	{
		super('game')
	}

	init()
	{
		this.cursors = this.input.keyboard.createCursorKeys();
		this.obstacles = new ObstaclesController()
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
		map.createLayer('obstacles', tileset);

		ground.setCollisionByProperty({
			collides: true
		})

		this.cameras.main.scrollY = 240;

		const objectsLayer = map.getObjectLayer('objects')

		objectsLayer.objects.forEach(objData => {
			const {x = 0, y = 0, name, width = 0, height = 0} = objData

			switch (name)
			{
				case 'penguin-spawn':
				{
					this.penquin = this.matter.add.sprite(x, y, ImageKeys.penquin)
					.setFixedRotation();
					this.playerController = new PlayerController(this, this.penquin,
						this.cursors,
						this.obstacles);
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

				case 'spikes':
					{
						const spikes = this.matter.add.rectangle(x + (width/2), y + (height/2), width, height, {
							isStatic: true,
						})
						this.obstacles.add('spikes', spikes)
						break
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
