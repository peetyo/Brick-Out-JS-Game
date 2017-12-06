window.addEventListener('load', setUp);
let stage;
let paddle;
let balls = [];
let bricks = [];
let bouncedOff = 0;
let divide = 5;
let game = 'paused';
let difference;

function setUp() {
	stage = new createjs.Stage('stage');
	createjs.Ticker.framerate = 60;
	createjs.Ticker.addEventListener('tick', running);

	createPaddle();
	createBrick();
	createBrick2();
	createBall();

	stage.mouseMoveOutside = true;
	stage.addEventListener("stagemousemove", function (evt) {
		let margin = stage.canvas.width - paddle.graphics.command.w;
		let position = evt.stageX - paddle.regX;
		if (position <= margin && position >= 0) {
			paddle.x = evt.stageX;
		} else if (position > margin) {
			paddle.x = stage.canvas.width - paddle.regX;
		} else if (position < 0) {
			paddle.x = 0 + paddle.regX;
		}
	});
	window.addEventListener("click", start);
}


function start() {
	console.log('test')

	if (game === 'over') {
		game = 'paused';
		bouncedOff = 0;
		document.querySelector('h1').innerHTML = "Bounce Out!";
		document.querySelector('p').innerHTML = "Score: " + bouncedOff;
		stage.removeAllChildren();
		createPaddle();
		createBrick();
		createBrick2();
		createBall();
		start();
	} else if (game === 'paused') {
		game = 'running';
		document.querySelector('h1').innerHTML = "Bounce Out!";
	}
}

function createPaddle() {
	paddle = new createjs.Shape();
	paddle.width = 200;
	paddle.height = 30;
	paddle.graphics.beginFill('#a4d2e2');
	paddle.graphics.drawRect(0, 0, paddle.width, paddle.height);
	paddle.regX = 100;
	paddle.x = 400;
	paddle.y = stage.canvas.height - paddle.graphics.command.h;
	stage.addChild(paddle);
}

function createBrick() {
	let brick = new createjs.Shape();
	brick.width = 100;
	brick.height = 50;
	brick.graphics.beginFill('#d6437c');
	brick.graphics.drawRect(0, 0, brick.width, brick.height);
	brick.x = 200;
	brick.y = 350;
	stage.addChild(brick);
	bricks.push(brick);
}

function createBrick2() {
	let brick = new createjs.Shape();
	brick.width = 100;
	brick.height = 50;
	brick.graphics.beginFill('#d6437c');
	brick.graphics.drawRect(0, 0, brick.width, brick.height);
	brick.x = 450;
	brick.y = 350;
	stage.addChild(brick);
	bricks.push(brick);
}

function createBall() {
	let ball = new createjs.Shape()

	ball.width = ball.height = 30;
	ball.graphics.beginFill('#da86ef');
	ball.graphics.drawRect(0, 0, ball.width, ball.width);
	ball.x = 200;
	ball.y = 500;
	stage.addChild(ball);
	balls.push(ball);

	ball.speedY = -4;
	ball.speedX = 0;
	// Peter
}

function bouncing(target) {
	// every frame we check for collisions first and them move the ball 
	if (target.x + target.width >= stage.canvas.width) {
		target.speedX = -Math.abs(target.speedX);
	} else if (target.x <= 0) {
		target.speedX = Math.abs(target.speedX);
	}
	if (target.y + target.height - 10 > stage.canvas.height) {
		game = 'over';
	}
	if (target.y <= 0) {
		target.speedY = Math.abs(target.speedY);
	}
	let paddleX = paddle.x - paddle.regX;
	if (paddleX < target.x + target.width &&
		paddleX + paddle.width > target.x &&
		paddle.y < target.y + target.height &&
		paddle.height + paddle.y > target.y) {
		difference = balls[0].x + balls[0].width / 2 - paddle.x;
		target.speedY = -Math.abs(target.speedY);
		console.log(difference);
		target.speedX = difference * 3.2 / 100;
		// difference * """"3.5""  / 100; 3.5 has to be based on the xspeed of the balls

		bouncedOff++;
		document.querySelector('p').innerHTML = "Score: " + bouncedOff;
	}
	for (i = 0; i < bricks.length; i++) {
		// brick collision
		if (bricks[i].x < target.x + target.width &&
			bricks[i].x + bricks[i].width > target.x &&
			bricks[i].y < target.y + target.height &&
			bricks[i].height + bricks[i].y > target.y) {
			console.log("collision")

			let a = target.x + target.width;

			if ((target.x) <= (bricks[i].x + bricks[i].width) && target.y > bricks[i].y && target.y < bricks[i].y + bricks[i].height && bricks[i].x + bricks[i].width / 2 < target.x && target.x >= bricks[i].x + bricks[i].width - 4.5) {
				// -4.5 this is how further in the brick the ball can go its not 4 because when you hit with the side of the paddle values go over 100 and speed goes a bit above 4. each frame they move with 4px so they might align with the border or go up to ~4px in the brick.
				console.log('right');
				target.speedX = Math.abs(target.speedX);
			}
			if ((target.x + target.width >= bricks[i].x) && target.y > bricks[i].y && target.y < bricks[i].y + bricks[i].height && bricks[i].x + bricks[i].width / 2 > target.x && target.x + target.width <= bricks[i].x + 4.5) {
				target.speedX = -Math.abs(target.speedX);
				console.log('left');
			}
			if ((target.y + target.height) >= bricks[i].y && target.y < bricks[i].y && target.y + target.height <= bricks[i].y + 4.5) {
				target.speedY = -Math.abs(target.speedY);
				console.log('up');
			}
			if (target.y <= bricks[i].y + bricks[i].height && target.y >= bricks[i].y + bricks[i].height - 4.5) {
				target.speedY = Math.abs(target.speedY);
				console.log('down');
			}
		}
	}
	// moves the ball
	target.y += target.speedY;
	target.x += target.speedX //Math.abs(target.randomX);
}

function level1() {

}

function running() {
	stage.update();
	if (game === 'over') {
		document.querySelector('h1').innerHTML = "You scored:  " + bouncedOff + "! Click to play again.";
		balls = [];

		divide = 5;
	} else if (game === 'running') {
		for (i = 0; i < balls.length; i++) {
			bouncing(balls[i]);
		}
	}

}
