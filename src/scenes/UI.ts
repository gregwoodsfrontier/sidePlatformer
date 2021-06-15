import Phaser from 'phaser'
import { sharedInstance as events } from './EventCenter'
import { EventKeys } from './keys'

export default class UI extends Phaser.Scene
{
    private starsLabel!: Phaser.GameObjects.Text
    private starsCollected = 0

    constructor()
    {
        super({
            key: 'ui'
        })
    }

    init()
    {
        this.starsCollected = 0
    }

    create()
    {
        this.starsLabel = this.add.text(10, 10, 'Stars: 0', {
            fontSize: '32px',
            color:'#000000'
        })

        events.on(EventKeys.starsCollected, this.handleStarCollected, this)

        this.events.once(Phaser.Scenes.Events.DESTROY, () => {
            events.off(EventKeys.starsCollected, this.handleStarCollected, this)
        })

    }

    private handleStarCollected()
    {
        this.starsCollected += 1
        this.starsLabel.text = `Stars: ${this.starsCollected}`
    }
	
}