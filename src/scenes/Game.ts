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
	private snowmans: SnowmanController[] = []

	constructor()
	{
		super('game')
	}

	init()
	{
		this.cursors = this.input.keyboard.createCursorKeys();
		this.obstacles = new ObstaclesController()
		this.snowmans = []
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
				
				case 'health':
				{
					const health = this.matter.add.sprite(x + (width/2) , y + (height/2), ImageKeys.health, undefined, {
						isStatic: true,
						isSensor: true
					})

					health.setData('type', 'health')
					health.setData('healthPoints', 10)
					break
				}
				
				case 'snowman':
				{
					const snowman = this.matter.add.sprite(x + (width/2), y + (height/2), ImageKeys.snowman)
					.setFixedRotation();
					this.snowmans.push(new SnowmanController(this, snowman))
					this.obstacles.add('snowman', snowman.body as MatterJS.BodyType)
					break
				}
			}
		})

		this.matter.world.convertTilemapLayer(ground);
		console.log(this.obstacles)
	}

	destroy()
	{
		
	}

	update(t: number, dt: number)
	{
		this.playerController?.update(dt)

		// update the controller for each snowman
		this.snowmans.forEach(snowman => snowman.update(dt))

	}

}
