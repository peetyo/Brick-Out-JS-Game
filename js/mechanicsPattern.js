window.addEventListener('load', setUp);
let stage;
let paddle;
let balls = [];
let bricks = [];
let score = 0;
let divide = 5;
let game = 'paused';
let difference;

function setUp() {
	stage = new createjs.Stage('stage');
	createjs.Ticker.framerate = 60;
	createjs.Ticker.addEventListener('tick', running);

	createPaddle();
	createPattern();
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
	

	if (game === 'over') {
		game = 'paused';
		score = 0;
		document.querySelector('h1').innerHTML = "Bounce Out!";
		document.querySelector('p').innerHTML = "Score: " + score;
		stage.removeAllChildren();
		createPaddle();
		createPattern();
		createBall();
		start();
	} else if (game === 'paused') {
		console.log('start')
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
	brick.width = 67;
	brick.height = 25;
	brick.graphics.beginFill('#d6437c');
	brick.graphics.drawRect(0, 0, brick.width, brick.height);
	brick.x = 0;
	brick.y = 120;
	stage.addChild(brick);
	bricks.push(brick);
}
// #TERRIBLE
function createPattern() {
	createBrick();
	let numberOfBricks = 55;
	let margin = 7;
	let distanceX = bricks[0].x + bricks[0].width +margin ;
	let distanceY = bricks[0].height + margin;
	console.log(distanceX);
	for(i=1; i<numberOfBricks; i++){
		createBrick();
		if(i<11){
			bricks[i].x =(i)*distanceX;
		}else if(i<22){
			bricks[i].x =(i-11)*distanceX;
			bricks[i].y =bricks[0].y + 1*distanceY;
		}else if(i<33){
			bricks[i].x =(i-22)*distanceX;
			bricks[i].y =bricks[0].y + 2*distanceY;
		}else if(i<44){
			bricks[i].x =(i-33)*distanceX;
			bricks[i].y =bricks[0].y + 3*distanceY;
		}else if(i<55){
			bricks[i].x =(i-44)*distanceX;
			bricks[i].y =bricks[0].y + 4*distanceY;
		}
	}
}

function createBall() {
	let ball = new createjs.Shape()

	ball.width = ball.height = 20;
	ball.graphics.beginFill('#da86ef');
	ball.graphics.drawRect(0, 0, ball.width, ball.width);
	ball.x = 750;
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
		
		target.speedX = difference * 3.2 / 100;
		console.log(target.speedX);
		// difference * """"3.5""  / 100; 3.5 has to be based on the xspeed of the balls
	}
	for (i = 0; i < bricks.length; i++) {
		// brick collision
		if (bricks[i].x < target.x + target.width &&
			bricks[i].x + bricks[i].width > target.x &&
			bricks[i].y < target.y + target.height &&
			bricks[i].height + bricks[i].y > target.y) {
			console.log("collision")

			let a = target.x + target.width;

			if ((target.x) <= (bricks[i].x + bricks[i].width) && bricks[i].x + bricks[i].width / 2 < target.x && target.x >= bricks[i].x + bricks[i].width - 5) {
				// -5 this is how further in the brick the ball can go its not 4 because when you hit with the side of the paddle values go over 100 and speed goes a bit above 4. each frame they move with 4px so they might align with the border or go up to ~4px in the brick.
				console.log('right');
				target.speedX = Math.abs(target.speedX);
			}
			if ((target.x + target.width >= bricks[i].x) && bricks[i].x + bricks[i].width / 2 > target.x && target.x + target.width <= bricks[i].x + 5) {
				target.speedX = -Math.abs(target.speedX);
				console.log('left');
			}
			if ((target.y + target.height) >= bricks[i].y && target.y < bricks[i].y && target.y + target.height <= bricks[i].y + 5) {
				target.speedY = -Math.abs(target.speedY);
				console.log('up');
			}
			if (target.y <= bricks[i].y + bricks[i].height && target.y >= bricks[i].y + bricks[i].height - 5) {
				target.speedY = Math.abs(target.speedY);
				console.log('down');
			}
			score+=10;
			document.querySelector('p').innerHTML = "Score: " + score;
			console.log('i: '+i)
			console.log('object'+bricks[i]);
			stage.removeChild(bricks[i]);
			bricks.splice(i, 1);
			
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
		document.querySelector('h1').innerHTML = "You scored:  " + score + "! Click to play again.";
		balls = [];
		divide = 5;
		bricks = [];
	} else if (game === 'running') {
		for (i = 0; i < balls.length; i++) {
			bouncing(balls[i]);
		}
	}

}
