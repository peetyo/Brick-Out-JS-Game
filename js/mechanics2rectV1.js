window.addEventListener('load', setUp);
let stage;
let paddle;
//let stateX;
//let stateY = 'down';
//let speed = 3;
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
function createBrick(){
	let brick = new createjs.Shape();
	brick.width = 100;
	brick.height = 300;
	brick.graphics.beginFill('#d6437c');
	brick.graphics.drawRect(0, 0, brick.width, brick.height);
	brick.x = 600;
	brick.y = 150;
	stage.addChild(brick);
	bricks.push(brick);
}
function createBall() {
	let ball = new createjs.Shape()
	
	ball.width = ball.height = 30;
	ball.graphics.beginFill('#da86ef');
	ball.graphics.drawRect(0, 0, ball.width , ball.width );
	ball.x = 200;
	ball.y = 500;
	stage.addChild(ball);
	balls.push(ball);

	ball.speedY = -4;
	ball.speedX = 0;
	// Peter
	ball.stateX = ''
	ball.stateY = 'down';
}

function bouncing(target) {
// every frame we check for collisions first and them move the ball 
	if (target.x +target.width>= stage.canvas.width ) {
		target.speedX =-Math.abs(target.speedX);
	}else if(target.x <= 0){
		target.speedX = Math.abs(target.speedY);
	}
	if (target.y +target.height -10 > stage.canvas.height) {
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
		difference = balls[0].x + balls[0].width/2 - paddle.x;
		target.speedY = -Math.abs(target.speedY);
		console.log(difference);
		target.speedX = difference * 4 / 100;

		bouncedOff++;
		document.querySelector('p').innerHTML = "Score: " + bouncedOff;
	}
	// brick collision
	if (bricks[0].x < target.x + target.width &&
		bricks[0].x + bricks[0].width > target.x &&
		bricks[0].y < target.y + target.height &&
		bricks[0].height + bricks[0].y > target.y) {
		console.log("doin it")
//		let one = target.x ;
//		let two = brick.x + brick.width;
//		let three = target.x + target.width
//		if (((target.x - target.radius) >= (brick.x + brick.width))|| ((target.x - target.radius + target.width) <= brick.x)) {
//			console.log('left and right');
//			target.speedX *= -1;
//		}
//		else if ((target.y - target.radius + target.height) <= brick.y || (target.y - target.radius) <= (brick.y + brick.height)) {
//			target.speedY *= -1;
//			console.log('up and down');
//		}
		let a = target.x+target.width;
//		console.log("x is:"+target.x)
//		console.log("width is: "+target.width);
//		console.log("a is: "+a);
		if((target.x)<=(bricks[0].x + bricks[0].width) && target.y>bricks[0].y && target.y<bricks[0].y + bricks[0].height && bricks[0].x + bricks[0].width/2<target.x && target.x>=bricks[0].x + bricks[0].width -4.5){
			// -4.5 this is how further in the brick the ball can go its not 4 because when you hit with the side of the paddle values go over 100 and speed goes a bit above 4. each frame they move with 4px so they might align with the border or go up to ~4px in the brick.
					console.log('right');
					target.speedX =Math.abs(target.speedX);
				}
		if((target.x + target.width>=bricks[0].x) && target.y>bricks[0].y && target.y<bricks[0].y + bricks[0].height && bricks[0].x + bricks[0].width/2>target.x && target.x + target.width<=bricks[0].x+4.5){
					target.speedX =-Math.abs(target.speedX);
					console.log('left');
				}
		if((target.y + target.height)>=bricks[0].y && target.y < bricks[0].y && target.y + target.height<=bricks[0].y +4.5){
					target.speedY= -Math.abs(target.speedY);
					console.log('up');
				}
		if(target.y<=bricks[0].y+bricks[0].height && target.y>=bricks[0].y+bricks[0].height-4.5 ){
					target.speedY= Math.abs(target.speedY);
					console.log('down');
				}
// not too bad physics
//		if((target.x)>=(bricks[0].x + bricks[0].width  )){
//					console.log('right');
//					target.speedX =Math.abs(target.speedX);
//				}else if(a>=bricks[0].x &&target.y<(bricks[0].y + bricks[0].height)){
//					target.speedX =-Math.abs(target.speedX);
//					console.log('left');
//				}else if((target.y)<=bricks[0].y ){
//					target.speedY= -Math.abs(target.speedY);
//					console.log('up');
//				}
//					else if(target.y<=bricks[0].y+bricks[0].height ){
//					target.speedY= Math.abs(target.speedY);
//					console.log('down');
//				}
	//||target.y<brick.y+brick.height){
		//else if(target.y-target.radius<brick.y||target.y-target.radius<brick.y+brick.height)
		//		difference = balls[0].x - paddle.x;
		//		target.speedY = -Math.abs(target.speedY);
		//		console.log(difference);
		//		target.speedX = difference*5/100;
		//
		//		bouncedOff++;
		//		document.querySelector('p').innerHTML = "Score: " + bouncedOff;
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
