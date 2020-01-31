// create a new scene
let gameScene = new Phaser.Scene("Game");

// initiate scene parameters
gameScene.init = function () {
	// player speed
	this.playerSpeed = 3;

	// enemy speed
	this.enemyMinSpeed = 2;
	this.enemyMaxSpeed = 4.5;

	// boundaries
	this.enemyMinY = 80;
	this.enemyMaxY = 280;
};

// load assets
gameScene.preload = function () {
	// load images
	this.load.image("background", "background.png");
	this.load.image("player", "player.png");
	this.load.image("enemy", "enemy.png");
	this.load.image("weapon", "weapon.png");
};

// called once after the preload ends
gameScene.create = function () {
	// create bg sprite
	let bg = this.add.sprite(0, 0, "background");
	bg.setPosition(320, 150);
	bg.setScale(2.8);

	// create the player
	this.player = this.add.sprite(0, 0, 'player');
	this.player.setPosition(20, 180);
	this.player.setScale(1);
	this.player.depth = 1;



	// goal
	this.weapon = this.add.sprite(0, 0, 'weapon');
	//set position
	this.weapon.setPosition(620, 180);
	this.weapon.depth = 1;

	// enemy group
	this.enemies = this.add.group({
		key: "enemy",
		repeat: 5,
		setXY: {
			x: 90,
			y: 100,
			stepX: 80,
			stepY: 20
		}
	});



	// set flipX, and speed
	Phaser.Actions.Call(
		this.enemies.getChildren(),
		function (enemy) {
			// flip enemy
			enemy.flipX = true;

			// set speed
			let dir = Math.random() < 0.5 ? 1 : -1;
			let speed =
				this.enemyMinSpeed +
				Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
			enemy.speed = dir * speed;
		},
		this
	);
};

// this is called up to 60 times per second
gameScene.update = function () {
	// check for active input (left click / touch)
	if (this.input.activePointer.isDown) {
		// player walks
		this.player.x += this.playerSpeed;
	}

	// treasure overlap check
	let playerRect = this.player.getBounds();
	let treasureRect = this.weapon.getBounds();

	if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
		alert("YOU DID IT!! YOU WON!!!");

		// restart the Scene
		this.scene.restart();
		return;
	}

	// get enemies
	let enemies = this.enemies.getChildren();
	let numEnemies = enemies.length;

	for (let i = 0; i < numEnemies; i++) {
		// enemy movement
		enemies[i].y += enemies[i].speed;

		// check we haven't passed min or max Y
		let conditionUp = enemies[i].speed < 0 && enemies[i].y <= this.enemyMinY;
		let conditionDown = enemies[i].speed > 0 && enemies[i].y >= this.enemyMaxY;

		// if we passed the upper or lower limit, reverse
		if (conditionUp || conditionDown) {
			enemies[i].speed *= -1;
		}

		// check enemy overlap
		let enemyRect = enemies[i].getBounds();

		if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
			console.log("Game over!");

			// restart the Scene
			this.scene.restart();
			return;
		}
	}
};

// set the configuration of the game
let config = {
	type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
	width: 640,
	height: 258,
	scene: gameScene
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);

