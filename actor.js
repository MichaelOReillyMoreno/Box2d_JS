class Actor{
	constructor(posStart = [0, 0], ang = 0, world = null)
	{	
		//MOVEMENT
		var startAngle = ang;
		var angleVel = 0;	
		var speed = 0.15;	
		var rotSpeed = 0.03;
		//TURBO
		var loadTurbo = 0;
		var turboSpeed = 10;
		var timeStopTurbo = 0;
		var isOnTurbo = false;
		var duration = 10;
		var coldDown = 100;
		//IMAGE
		var width = 64;
		var height = 64;
		var spriteSheet = new Image();
		spriteSheet.src = "personaje.png";
		var posBackYSrite = 0;
		//FRAMES
		var numberOfFrames = 3;
		var refreshFrames = 3;
		var CurrentFrame = 0;
		var time=0;
		//BOX2D
		var scale = 30;
		var startPos = [posStart[0]/scale, posStart[1]/scale];
		var bodyDef = new b2BodyDef;
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.x = startPos[0];
		bodyDef.position.y = startPos[1];
		
		var fixtureDef = new b2FixtureDef;
		fixtureDef.density = 1.0;
		fixtureDef.friction = 0.4;
		fixtureDef.restitution = 0.0;		
		fixtureDef.shape = new b2CircleShape(30/scale);
			
		var body = world.CreateBody(bodyDef);
		var fixture = body.CreateFixture(fixtureDef);
		var bodyAngle;
		var bodyAngleVel;
		var max_vel = 1.4;
		var velocity;
		body.SetAngle(startAngle);
		
		this.SetMovement = function (dir)
		{
			if(body != null)
			{
				var velToAdd = dir * speed;
				if(Math.abs(velocity.x) > max_vel && !isOnTurbo)
				{
					velocity.x = max_vel * velocity.x/Math.abs(velocity.x);
				}
				else
				{
					velocity.x += Math.cos(bodyAngle)*velToAdd;
				}
				if(Math.abs(velocity.y) > max_vel && !isOnTurbo)
				{
					velocity.y = max_vel * velocity.y/Math.abs(velocity.y);
				}
				else
				{
					velocity.y += Math.sin(bodyAngle)*velToAdd;
				}
				body.SetLinearVelocity(velocity);
			}
		};
		this.SetRotation = function (rotDir)
		{
			if(body != null)
			{
				bodyAngleVel = body.GetAngularVelocity();
				angleVel = bodyAngleVel + (rotSpeed * rotDir);
				body.SetAngularVelocity(angleVel);
			}

		};
		this.SetTurbo = function ()
		{
			if(loadTurbo >= coldDown)
			{
				isOnTurbo = true;
				loadTurbo = 0;
				velocity.x += Math.cos(bodyAngle)*turboSpeed;
				velocity.y += Math.sin(bodyAngle)*turboSpeed;
				body.SetAngularVelocity(0);
				timeStopTurbo = time + duration;
			}
		};
		function StopTurbo()
		{
			isOnTurbo = false;
				if(Math.abs(velocity.x) > max_vel)
				{
					velocity.x = max_vel * velocity.x/Math.abs(velocity.x);
				}
				if(Math.abs(velocity.y) > max_vel)
				{
					velocity.y = max_vel * velocity.y/Math.abs(velocity.y);
				}
		}
		function SetFriction()
		{
				velocity = body.GetLinearVelocity();
				velocity.x -= velocity.x / 20;
				velocity.y -= velocity.y / 20;
				body.SetLinearVelocity(velocity);
				
				bodyAngleVel = body.GetAngularVelocity();
				bodyAngleVel -= bodyAngleVel/20;
				body.SetAngularVelocity(bodyAngleVel);
		}
		this.Paint = function (ctx, t)
		{
			time = t;
			if(loadTurbo <= coldDown)
			{
				loadTurbo++;
			}
			if(isOnTurbo && time >= timeStopTurbo)
			{
				StopTurbo();
			}
			if(body != null)
			{
				SetFriction();
				bodyAngle = body.GetAngle();
				x = body.GetPosition().x * scale;
				y = body.GetPosition().y * scale;
				ctx.save();
				ctx.translate(x, y);
				ctx.rotate(bodyAngle); 
				//console.log(velocity);
				if(Math.abs(velocity.x) > 0.05 || Math.abs(velocity.y) > 0.05)
				{
					ctx.drawImage(spriteSheet,CurrentFrame * 64 ,posBackYSrite,64, 64, -width / 2, -height / 2, 64, 64);
				}
				else
				{
					ctx.drawImage(spriteSheet,0 ,posBackYSrite,64, 64, -width / 2, -height / 2, 64, 64);
				}
				ctx.translate(-x, -y);
				ctx.restore();
			}
			if (time%refreshFrames==0)
			{
				if(CurrentFrame < numberOfFrames)
				{
					CurrentFrame++;
				}
				else
				{
					CurrentFrame=0;
				}
			}
		};
		this.ResetPos = function ()
		{
			body.SetPosition(new b2Vec2(startPos[0], startPos[1]));
			body.SetLinearVelocity(new b2Vec2(0, 0));
			body.SetAngle(startAngle);
			body.SetAngularVelocity(0);
		};
	}
}
