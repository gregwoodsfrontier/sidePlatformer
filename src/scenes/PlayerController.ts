import Phaser from 'phaser'
import StateMachine from '../statemachine/StateMachine'
import { AnimKeys, ImageKeys, JSONKeys } from './keys'
import { sharedInstance as events } from './EventCenter'
import ObstaclesController from './ObstaclesController'

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys
export default class PlayerController
{
	private sprite: Phaser.Physics.Matter.Sprite
	private stateMachine: StateMachine
	private cursors: CursorKeys

	constructor(sprite: Phaser.Physics.Matter.Sprite,
		cursors: CursorKeys)
	{
		this.sprite = sprite;
		this.cursors =cursors;

		this.createAnimations();

		this.stateMachine = new StateMachine(this, 'player')

		this.stateMachine.addState('idle', {
			onEnter: this.idleOnEnter,
			onUpdate: this.idleOnUpdate,
		})
			.addState('walk', {
				onEnter: this.walkOnEnter,
				onUpdate: this.walkOnUpdate,
			})
			.addState('jump', {
				onEnter: this.jumpOnEnter,
				onUpdate: this.jumpOnUpdate,
			})
			.setState('idle');

		this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
			if (this.stateMachine.isCurrentState('jump'))
			{
				this.stateMachine.setState('idle');
			} 
		});

	}

	private idleOnEnter()
	{
		this.sprite.play(AnimKeys.playerIdle);
	}

	private idleOnUpdate()
	{
		if (this.cursors.left.isDown || this.cursors.right.isDown)
		{
			this.stateMachine.setState('walk')
		}

		const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);
		if (spaceJustPressed)
		{
			this.stateMachine.setState('jump')
		}

	}

	private walkOnEnter()
	{
		this.sprite.play(AnimKeys.playerWalk);
	}

	private walkOnUpdate()
	{
		this.handlePlayerInput();
	}

	private jumpOnEnter()
	{
		this.sprite.setVelocityY(-13);
		this.sprite.play(AnimKeys.playerJump);
	}

	private jumpOnUpdate()
	{
		const speed = 5;

		if (this.cursors.right.isDown)
		{
			this.sprite.setVelocityX(speed);
			this.sprite.flipX = false;
		}
		else if (this.cursors.left.isDown)
		{
			this.sprite.setVelocityX(-speed);
			this.sprite.flipX = true;
		}
		
	}

	private createAnimations()
    {
        this.sprite.anims.create({
            key: AnimKeys.playerIdle,
            frames: [{
                key: ImageKeys.penquin,
                frame: 'penguin_walk01.png'
            }]
        });

        this.sprite.anims.create({
            key: AnimKeys.playerWalk,
            frameRate: 10,
            frames: this.sprite.anims.generateFrameNames(ImageKeys.penquin, {
                start: 1,
                end: 4,
                prefix: 'penguin_walk0',
                suffix: '.png'
            }),
            repeat: -1
        });

		this.sprite.anims.create({
            key: AnimKeys.playerJump,
            frameRate: 10,
            frames: this.sprite.anims.generateFrameNames(ImageKeys.penquin, {
                start: 1,
                end: 3,
                prefix: 'penguin_jump0',
                suffix: '.png'
            })
        });
    }

	private handlePlayerInput()
	{
		const speed = 5;

		if (this.cursors.right.isDown)
		{
			this.sprite.setVelocityX(speed);
			
			this.sprite.flipX = false;
		}
		else if (this.cursors.left.isDown)
		{
			this.sprite.setVelocityX(-speed);
			this.sprite.flipX = true;
		}
		else
		{
			this.sprite.setVelocityX(0);
			this.stateMachine.setState('idle')
		}

		const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);
		if (spaceJustPressed)
		{
			this.stateMachine.setState('jump')
		}
	}

	

	update(dt: number)
	{
		this.stateMachine.update(dt);
	}
}
