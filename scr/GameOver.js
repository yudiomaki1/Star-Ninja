class GameOver extends Phaser.Scene{
    constructor(){
        super({key:'GameOver'});   //define o nome da cena
    }
    //carrega os assets
    preload(){
        this.load.image('background', 'assets/sky.png')
        this.load.image('GameOverImage', 'assets/GameOver.png');
        this.load.image('restart', 'assets/restart_bt.png');
    }
    //adiciona as imagens a cena
    create(){
        this.add.image(400, 300, 'background');
        this.add.image(400, 180, 'GameOverImage').setScale(0.5);
        //adiciona botão de restart
        var restart = this.add.image(400, 450, 'restart').setInteractive().setScale(0.5);
        //ao clicar em restart o jogo reinicia
        restart.on('pointerdown',()=> {
            this.scene.start('Level1')
        });
    }
}
