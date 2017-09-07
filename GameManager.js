//Box2D 
// Declare all the commonly used objects as variables for convenience
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

var world;
var scale = 30; //30 pixels on our canvas correspond to 1 meter in the box2d world

var canvas = null,
ctx = null;
var lvlManager = new LevelsManager();

//Ball
var ball;
//J1
var player1;
var points1 = 0;

//J2
var player2;
var points2 = 0;

//MAPA
var currentLevel = new Array();
var tiles = new Array();
var index = 0;
var events;
var lengthX;
var lengthY;
var ntxlvl;
var numLvl = 0;

//GENERAL
var stopGame = false;
var textScreen = "";
var fixText = 0;
var date;
var time = 0;
var keysMap = new Array();
var audio = new Audio('lavanda.mp3');
	audio.loop = true;
	
window.requestAnimationFrame = (function (){
											return window.requestAnimationFrame ||
											window.mozRequestAnimationFrame ||
											window.webkitRequestAnimationFrame ||
											function (callback) {
												window.setTimeout(callback, 17);
											};
											}());
function paint(ctx){
	date = new Date();
	time++;
	if(time >= 1000000)
	{
		time = 0;
	}
	ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
	for (i = 0; i < index; i++)
	{
		tiles[i].PaintTile(ctx, time);
	}
	player1.Paint(ctx, time);
	player2.Paint(ctx, time);
	ball.Paint(ctx);
}

function run(){
	window.requestAnimationFrame(run);
	keysMap = events.GetKeysMap();
	paint(ctx);
	if(!stopGame)
	{
		ActorsManager();
	}
	else
	{
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText(textScreen, (ctx.canvas.width / 2) + fixText, ctx.canvas.height / 2);
	}
	CheckBall();
	//Step the box2d engine ahead
	world.Step(1/20 , 8 , 3);	
	//important to clear forces, otherwise forces will keep applying
	world.ClearForces();
}
function ActorsManager(){
		//P1
		//MOVE
		if(keysMap[87])
		{
			player1.SetMovement(1);
		}
		else if(keysMap[83])
		{
			player1.SetMovement(-1);
		}
		//ROTATION
		if(keysMap[68])
		{
			player1.SetRotation(1);
		}
		else if(keysMap[65])
		{
			player1.SetRotation(-1);
		}
		if(keysMap[32])
		{
			player1.SetTurbo();
		}
		//P2
		//MOVE
		if(keysMap[101])
		{
			player2.SetMovement(-1);
		}
		else if(keysMap[104])
		{
			player2.SetMovement(1);
		}
		//ROTATION	
		if(keysMap[100])
		{
			player2.SetRotation(-1);
		}
		else if(keysMap[102])
		{
			player2.SetRotation(1);
		}
		if(keysMap[13])
		{
			player2.SetTurbo();
		}
}
function CheckBall(){
	if(!stopGame)
	{
		if(ball.GetX() > 1100)
		{
			Score(true);
		}
		else if(ball.GetX() < 100)
		{
			Score(false);
		}
	}
}
function Score(isP1){
	stopGame = true;
	fixText = -45;
	ctx.font = "35px Arial";
	if(isP1)
	{
		textScreen ="Player 1 has scored a goal!";
		points1++;
	}
	else
	{
		textScreen ="Player 2 has scored a goal!";
		points2++;
	}
	document.getElementById("score").innerHTML = points1 + " : " + points2;			
	setTimeout(function(){ ResetPos(); }, 3000);
}
function ResetPos()
{
	player1.ResetPos();
	player2.ResetPos();
	ball.ResetPos();
	fixText = -20;
	ctx.font = "50px Arial";
	textScreen ="GO!";
	setTimeout(function(){ StartGame(); }, 3000);
}
function StartGame()
{
	stopGame = false;
}
function InitializeLvl(lvl){

	stopGame = true;
	numLvl++;
	points1 = 0;
	points2 = 0;
	newRecord = false;
	currentLevel = lvl;
	var posX = 32;
	var posY = 0;
	var posStartP1InMatrix;
	var posStartP2InMatrix;
	lengthX = currentLevel.length;
	lengthY = currentLevel[0].length;
	index = 0;
	for(var i = 0; i < lengthX; i++)
	{
		for(var j = 0; j < lengthY; j++)
		{
			if(currentLevel[i][j] == 6)
			{
				posStartP1InMatrix = [i, j];
			}	
			else if(currentLevel[i][j] == 9)
			{
				posStartP2InMatrix = [i, j];
			}				
			tiles[index] = new Tile(posX, posY, currentLevel[i][j], lengthX -1, lengthY -1);
			tiles[index].SetSprite(i, j);
			posX = posX + 64;
			index++;
		}
		posX = 32;
		posY = posY + 64;
	}
	 var posStartP1 = [((posStartP1InMatrix[1]) * 64), ((posStartP1InMatrix[0]) * 64) + 32];
	player1 = new Actor(posStartP1, 0, world);
	
	var posStartP2 = [((posStartP2InMatrix[1]) * 64), ((posStartP2InMatrix[0]) * 64) + 32];
	player2 = new Actor(posStartP2,160.22, world);
	
	ball = new Ball(610, 352, world);
	
	fixText = -20;
	ctx.font = "50px Arial";
	textScreen ="GO!";
	setTimeout(function(){ StartGame(); }, 2000);
	//audio.play();
}
function createLimit(x, y, width, height){	
	//A body definition holds all the data needed to construct a rigid body. 
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_staticBody;
	bodyDef.position.x = x/scale;
	bodyDef.position.y = y/scale;
	// A fixture is used to attach a shape to a body for collision detection.
	// A fixture definition is used to create a fixture
	var fixtureDef = new b2FixtureDef;
	fixtureDef.density = 1.0;
	fixtureDef.friction = 0.1;
	fixtureDef.restitution = 1;
	
	fixtureDef.shape = new b2PolygonShape;
	fixtureDef.shape.SetAsBox(width/2/scale,height/2/scale); //640 pixels wide and 20 pixels tall

	var body = world.CreateBody(bodyDef);
	var fixture = body.CreateFixture(fixtureDef);
}
/*
function setupDebugDraw(){
	context = document.getElementById('canvasBox2D').getContext('2d');
	context.canvas.width  = 1230;
	context.canvas.height = 720;
	var debugDraw = new b2DebugDraw();

	// Use this canvas context for drawing the debugging screen
	debugDraw.SetSprite(context);
	// Set the scale 
	debugDraw.SetDrawScale(scale);
	// Fill boxes with an alpha transparency of 0.3
	debugDraw.SetFillAlpha(1);
	// Draw lines with a thickness of 1
	debugDraw.SetLineThickness(0.8);
	// Display all shapes and joints
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);	

	// Start using debug draw in our world
	world.SetDebugDraw(debugDraw);
}*/

function animate(){
	var timeStep = 1/60;
	//As per the Box2d manual, the suggested iteration count for Box2D is 8 for velocity and 3 for position. 
	var velocityIterations = 8;
	var positionIterations = 3;
	
	world.Step(timeStep,velocityIterations,positionIterations);
	world.ClearForces();

	world.DrawDebugData();

	setTimeout(animate, timeStep);
}
function init(){
	//box2d
	// Setup the box2d World that will do most of they physics calculation
	var gravity = new b2Vec2(0,0); //declare gravity as 9.8 m/s^2 downwards
	var allowSleep = false; //Allow objects that are at rest to fall asleep and be excluded from calculations
	world = new b2World(gravity,allowSleep);	

	//bottom
	createLimit(608, 688, 1152, 64);
	// top
	createLimit(608, 32, 1152, 64);
	// left wall top
	createLimit(64, 160, 64, 192);
	// left wall bottom
	createLimit(64, 560, 64, 192);
	// right wall top
	createLimit(1152, 160, 64, 192);
	// right wall bottom
	createLimit(1152, 560, 64, 192);
	// goal wall left
	createLimit(16, 360, 32, 210);
	// goal wall right
	createLimit(1200, 360, 32, 210);
	
	//setupDebugDraw();
	animate();
	
	//canvas
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	ctx.canvas.width  = 1200;
	ctx.canvas.height = 720;
	var ntxlvl = lvlManager.GetLvl();
	InitializeLvl(ntxlvl);
	events  = new EventsManager();
	run();
}

window.addEventListener('load', init, false);
