import Phaser from 'phaser'
import { AnimKeys, ImageKeys, JSONKeys, SceneKeys } from './keys';

export default class Preloader extends Phaser.Scene
{
    constructor()
    {
        super(SceneKeys.preloader)
    }

    preload()
    {
        this.load.atlas(ImageKeys.penquin, 'assets/penquin.png', 'assets/penquin.json');
        this.load.image(ImageKeys.tiles, 'assets/sheet.png');
        this.load.tilemapTiledJSON(JSONKeys.tilemap, 'assets/game.json');
        this.load.image(ImageKeys.star, 'assets/star.png');
        this.load.image(ImageKeys.health, 'assets/health.png')
    }

    create()
    {
        //this.createPenquinAnimations();

        this.scene.start('game')
    }

    

}