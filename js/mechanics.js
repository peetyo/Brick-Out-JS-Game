window.addEventListener('load', setUp);
let stage;
let block;
let runnner;
let stateX;
let stateY = 'down';
let randomX;
let speed = 3;

function setUp() {
	stage = new createjs.Stage('stage');
	createjs.Ticker.framerate = 60;
	createjs.Ticker.addEventListener('tick', running);

	block = new createjs.Shape();
	block.width = 200;
	block.height = 30;
	block.graphics.beginFill('#a4d2e2');
	block.graphics.drawRect(0, 0, block.width, block.height);
	block.regX = 100;
	block.x = 300;
	block.y = stage.canvas.height - block.graphics.command.h;
	stage.addChild(block);

	ball = new createjs.Shape()
	ball.radius = ball.height = 20;
	ball.width = ball.radius * 2;
	ball.graphics.beginFill('#da86ef');
	ball.graphics.drawCircle(0, 0, ball.radius);
	ball.x = 300;
	ball.y = 20;
	stage.addChild(ball);



	stage.mouseMoveOutside = true;
	stage.on("stagemousemove", function (evt) {
		let margin = stage.canvas.width - block.graphics.command.w;
		let position = evt.stageX - block.regX;
		if (position <= margin && position >= 0) {
			block.x = evt.stageX;
		} else if (position > margin) {
			block.x = stage.canvas.width - block.regX;
		} else if (position < 0) {
			block.x = 0 + block.regX;
		}
	});
}

function running() {
	stage.update();
	if(stateY === 'down'){
		ball.y +=speed;
	}else{
		ball.y -=speed;
	}
	if(stateX === 'right'){
		ball.x +=Math.abs(randomX);
	}else if(stateX === 'left'){
		ball.x -=Math.abs(randomX);
	}
	if(ball.x >=stage.canvas.width){
		stateX = 'left';
	}else if(ball.x <= 0){
		stateX = 'right';
	}
	if(ball.y>stage.canvas.height){
		
	}
	let blockX = block.x - block.regX;
	if (blockX < ball.x-20 + ball.width &&
		blockX + block.width > ball.x-20 &&
		block.y < ball.y + ball.height &&
		block.height + block.y > ball.y) {
		stateY = 'up';
		speed += 0.2;
		console.log(speed);
		randomX = Math.random()*4;
		randomX *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
		console.log(randomX);
		if(randomX >= 0){
			stateX = 'right';
		}else{
			stateX = 'left';
		}
	}
	if(ball.y<=0){
		stateY = 'down';
	}
}