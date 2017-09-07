class Ball{
	constructor(x = 570, y = 352, world = null)
	{
		//POSITION	TO DRAW
		this.x = x;
		this.y = y;		
		
		//IMAGE
		var imgBall = new Image;
		imgBall.src = "pelota.png";
		
		//BOX2D
		var bodyAngle;
		var velocity;
		var bodyAngleVel;
		
		var scale = 30;
		var startPos = [x/scale,y/scale];
		var bodyDef = new b2BodyDef;
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.x = startPos[0];
		bodyDef.position.y = startPos[1];
		
		var fixtureDef = new b2FixtureDef;
		fixtureDef.density = 1.0;
		fixtureDef.friction = 50;
		fixtureDef.restitution = 1.0;
		
		fixtureDef.shape = new b2CircleShape(30/scale);
			
		var body = world.CreateBody(bodyDef);
		var fixture = body.CreateFixture(fixtureDef);
		
		function SetFriction()
		{
				velocity = body.GetLinearVelocity();
				velocity.x -= velocity.x / 100;
				velocity.y -= velocity.y / 100;
				body.SetLinearVelocity(velocity);
				
				bodyAngleVel = body.GetAngularVelocity();
				bodyAngleVel -= bodyAngleVel/100;
				body.SetAngularVelocity(bodyAngleVel);
		}
		
		this.Paint = function (ctx)
		{
			if(body != null)
			{
				SetFriction();
				x = body.GetPosition().x * scale;
				y = body.GetPosition().y * scale;
				bodyAngle = body.GetAngle();
				ctx.save();
				ctx.translate(x, y);
				ctx.rotate(bodyAngle); 
				ctx.drawImage(imgBall, -64 / 2, -64 / 2, 64, 64);
				ctx.translate(-x, -y);
				ctx.restore();
				
			}
		};
		this.GetX = function ()
		{
			return x;
		};
		this.ResetPos = function ()
		{
			body.SetPosition(new b2Vec2(startPos[0], startPos[1]));
			body.SetLinearVelocity(new b2Vec2(0, 0));
			body.SetAngle(0);
			body.SetAngularVelocity(0);
		};
	}
}
