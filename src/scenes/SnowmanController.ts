import StateMachine from '../statemachine/StateMachine'
import { sharedInstance as events } from './EventCenter'
import { AnimKeys, ImageKeys } from './keys'
export default class SnowmanController
{
	private sprite: Phaser.Physics.Matter.Sprite
	private stateMachine: StateMachine
	private moveTime = 0
	private cool = 1000
	private speed = 3
	private scene: Phaser.Scene

	constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite)
	{
		this.sprite = sprite
		this.scene = scene
		this.stateMachine = new StateMachine(this, ImageKeys.snowman)
		this.createAnimations()

		this.stateMachine
		.addState('idle', {
			onEnter: this.idleOnEnter
		})
		.addState('move-left', {
			onEnter: this.moveLeftOnEnter,
			onUpdate: this.moveLeftOnUpdate
		})
		.addState('move-right', {
			onEnter: this.moveRightOnEnter,
			onUpdate: this.moveRightOnUpdate
		})
		.addState('dead')
		.setState('idle')

		
	}

	update(dt: number)
	{
		this.stateMachine.update(dt)
	}

	private createAnimations()
	{
		this.sprite.anims.create({
			key: AnimKeys.snowmanIdle,
			frames: [{
				key: ImageKeys.snowman,
				frame: 'snowman_left_1.png'
			}],
			repeat: -1
		})

		this.sprite.anims.create({
			key: AnimKeys.walkLeft,
			frames: this.sprite.anims.generateFrameNames(ImageKeys.snowman, {
				start: 1,
				end: 2,
				prefix: 'snowman_left_',
				suffix: '.png'
			}),
			frameRate: 10,
			repeat: -1
		})

		this.sprite.anims.create({
			key: AnimKeys.walkRight,
			frames: this.sprite.anims.generateFrameNames(ImageKeys.snowman, {
				start: 1,
				end: 2,
				prefix: 'snowman_right_',
				suffix: '.png'
			}),
			frameRate: 10,
			repeat: -1
		})
	}
	
	private idleOnEnter()
	{
		this.sprite.play(AnimKeys.snowmanIdle)
		const r = Phaser.Math.Between(1, 100)
		if (r < 50)
		{
			this.stateMachine.setState('move-left')
		}
		else
		{
			this.stateMachine.setState('move-right')
		}
	}

	private moveLeftOnEnter()
	{
		this.sprite.play(AnimKeys.walkLeft, true)
		this.moveTime = 0
		
	}

	private moveLeftOnUpdate(dt: number)
	{
		this.moveTime += dt
		this.sprite.setVelocityX(-this.speed)
		if (this.moveTime > this.cool)
		{
			this.stateMachine.setState('move-right')
		}
	}

	private moveRightOnEnter()
	{
		this.sprite.play(AnimKeys.walkRight, true)
		this.moveTime = 0
		
	}

	private moveRightOnUpdate(dt: number)
	{
		this.moveTime += dt
		this.sprite.setVelocityX(this.speed)

		if (this.moveTime > this.cool)
		{
			this.stateMachine.setState('move-left')
		}
	}
}
