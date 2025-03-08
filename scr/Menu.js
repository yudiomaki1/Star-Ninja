class Menu extends Phaser.Scene {
    constructor(){
        super({
            key:'Menu',   //define o nome da cena
        });
    }

    //carrega os assets
    preload(){
        this.load.image('start', 'assets/start.png');
        this.load.image('background', 'assets/sky.png');
    }
    //adiciona as imagens a cena
    create(){
        this.add.image(400, 300, 'background');
        var start = this.add.image(400, 400, 'start').setInteractive().setScale(0.07); // botão de start
        this.add.text(400, 200, 'STAR NINJA',{ // adiciona o titulo do jogo
            fontSize:'60px',
            fontStyle: 'bold',
            fill: '#000000'
        }).setOrigin(0.5)

        start.on('pointerdown', ()=> {
            this.scene.start('Level1');   //quando o botão start for apertado o jogador irá para o level 1
        });
    }
}