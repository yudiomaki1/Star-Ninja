class Level1 extends Phaser.Scene {
    constructor() {
        super({
            key: 'Level1'   //define o nome da cena
        });
    }
    //carrega os assets
    preload() {
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('sky', 'assets/sky.png');
        this.load.spritesheet('samurai', 'assets/RUN.png', { frameWidth: 48, frameHeight: 18 });
        this.load.image('floor', 'assets/tijolos.png');
        this.load.image('bomb', 'assets/bomb.png');
    }
    //adiciona as imagens a cena
    create() {
        this.add.image(400, 300, 'sky');
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.player = this.physics.add.sprite(100, 450, 'samurai').setScale(2);
        this.player.setCollideWorldBounds(true);

        this.floor = this.physics.add.staticGroup();
        this.floor.create(200, 400, 'floor');
        this.floor.create(600, 400, 'floor');
        this.floor.create(400, 250, 'floor');
        this.floor.create(75, 400, 'floor');
        this.floor.create(725, 400, 'floor');
        this.floor.create(550, 250, 'floor');
        this.floor.create(250, 250, 'floor');

        //Animação do personagem andando para a esquerda
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('samurai', { start: 0, end: 16 }),
            frameRate: 40,
            repeat: -1
        });
        //Animação do personagem parado
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'samurai', frame: 6 }],
            frameRate: 40,
        });
        //Animação do personagem andando para a direita
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('samurai', { start: 0, end: 16 }),
            frameRate: 20,
            repeat: -1
        });
        //acessa as teclas do teclado
        this.cursors = this.input.keyboard.createCursorKeys();

        //define a quantidade de estrelas e suas posições
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 5,
            setXY: { x: 19, y: 0, stepX: 150 }
        });
        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.6, 0.8));
        });

        //adiciona as colisões de todos os objetos
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.player, this.floor);
        this.physics.add.collider(this.stars, this.floor);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        //placar
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'score 0', { fontSize: '32px', fill: '#000' });

        //define as colisões da bomba
        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.floor);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    }

    // Responsavel pela atualização dos sprites, interações com objetos e comandos
    update() {
        //verifica se a tecla esta sendo pressionada e movimenta o personagem
        if (this.cursors.left.isDown) {
            this.player.setFlip(true);
            this.player.setVelocityX(-200);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setFlip(false);
            this.player.setVelocityX(200);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
        while (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-600);
            break;
        }
    }
    //Interações das estrelas com o jogador
    collectStar(player, star) {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
            //spawna a bomba 
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-350, 100), 10);
        }
    }
    //Leva o jogador para a tela de game over após ser atingido pela bomba
    hitBomb(player, bomb) {
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play('turn');
        this.gameOver = true;
        this.scene.start('GameOver');
    }
}