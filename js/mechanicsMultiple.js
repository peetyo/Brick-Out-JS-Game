window.addEventListener('load', setUp);
let stage;
let paddle;
let brick;
//let stateX;
//let stateY = 'down';
//let speed = 3;
let balls = [];
let bouncedOff = 0;
let divide = 5;
let game = 'paused';
let difference;

function setUp() {
	stage = new createjs.Stage('stage');
	createjs.Ticker.framerate = 60;
	createjs.Ticker.addEventListener('tick', running);
	brick = new createjs.Shape();
	brick.width = 100;
	brick.height = 100;
	brick.graphics.beginFill('#d6437c');
	brick.graphics.drawRect(0, 0, brick.width, brick.height);
	brick.x = 300;
	brick.y = 250;
	stage.addChild(brick);
	createPaddle();
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

function createBall() {
	let ball = new createjs.Shape()
	ball.radius = ball.height = 20;
	ball.width = ball.radius * 2;
	ball.graphics.beginFill('#da86ef');
	ball.graphics.drawCircle(0, 0, ball.radius);
	ball.x = 480;
	ball.y = 20;
	stage.addChild(ball);
	balls.push(ball);

	ball.speedY = 4;
	ball.speedX = 0;
	// Peter
	ball.stateX = ''
	ball.stateY = 'down';
}

function bouncing(target) {

	target.y += target.speedY;
	target.x += target.speedX //Math.abs(target.randomX);

	if (target.x + target.radius >= stage.canvas.width || target.x - target.radius <= 0) {
		target.speedX *= -1;
	}
	if (target.y > stage.canvas.height) {
		game = 'over';
	}
	if (target.y - target.radius <= 0) {
		target.speedY = Math.abs(target.speedY);
	}
	let paddleX = paddle.x - paddle.regX;
	if (paddleX < target.x - target.radius + target.width &&
		paddleX + paddle.width > target.x - target.radius &&
		paddle.y < target.y + target.height &&
		paddle.height + paddle.y > target.y) {
		difference = balls[0].x - paddle.x;
		target.speedY = -Math.abs(target.speedY);
		console.log(difference);
		target.speedX = difference*5/100;

		bouncedOff++;
		document.querySelector('p').innerHTML = "Score: " + bouncedOff;
	}
	// brick collision
	if (brick.x < target.x + target.width - target.radius &&
   brick.x + brick.width > target.x - target.radius &&
   brick.y < target.y + target.height &&
   brick.height + brick.y > target.y) {
		console.log("doin it")
		let one = target.x -target.radius;
		let two = brick.x + brick.width;
		let three = target.x -target.radius + target.width
		if((target.x -target.radius)>=(brick.x + brick.width) || (target.x -target.radius + target.width)>=brick.x){
			console.log('left and right');
			target.speedX*=-1;
		} 
			if(target.y-target.radius<brick.y||target.y-target.radius<brick.y+brick.height){
			target.speedY*=-1;
			console.log('up and down');
		}
//		difference = balls[0].x - paddle.x;
//		target.speedY = -Math.abs(target.speedY);
//		console.log(difference);
//		target.speedX = difference*5/100;
//
//		bouncedOff++;
//		document.querySelector('p').innerHTML = "Score: " + bouncedOff;
	}
}
function level1(){
	
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
