class Tile
{
	//constructor(posicionX, posicionY, tipoDeTile, EstaAnimado, LimiteDelArrayBiEnX, LimiteDelArrayBiEnY, TamañoDeSpritesEnLaTira
	constructor(x = 0, y = 0, type = 0, limitX = 10, limitY	= 10, size = 64)
	{
		//POSITION
		this.x = x;
		this.y = y;
		this.type = type;
		this.limitX = limitX;
		this.limitY = limitY;
		this.size = size;
		
		//FRAMES
		var isAnimated = false;
		var CurrentFrame = 0;
		var refreshFrames = 9;
		var lastRefresh = 0;
		
		//SPRITES SHEETS IMAGES
		var spritesSheet = "suelo.png";
		var imgTile = new Image();
		imgTile.src = spritesSheet;
		var posFloor = 0;
		
		var spritesSheetWall = "exterior.png";
		var imgTileWall = new Image();
		imgTileWall.src = spritesSheetWall;
		var posWall = 0;
				
		var randImg = 0;
		var isWall = false;

		
		this.SetSprite = function (i, j) {
			if(type == 1)
			{
				if(i == 0 || j == 0 || i == limitX || j == limitY)
				{
					randImg = Math.floor(Math.random() * 4);
					isWall = true;
				}
				else
				{
					CurrentFrame = Math.floor(Math.random() * 3);
					isAnimated = true;
				}
			}
			else if(type == 0)
			{
				var ran = Math.floor(Math.random() * 100);
				if(ran <= 25)
				{
					randImg = 0;
				}
				else if(ran <= 50)
				{
					randImg = 1;
				}
				else if(ran <= 75)
				{
					randImg = 2;
				}
				else if(ran <= 100)
				{
					randImg = 3;
				}
			}
		};
			this.PaintTile = function (ctx, time) {
				ctx.beginPath();
				if(isAnimated)
				{
					ctx.drawImage(imgTileWall, CurrentFrame * 64, 0, 64, 64, x, y, 64, 64);
					if (time % refreshFrames == 0 && time != lastRefresh)
					{
						lastRefresh = time;
						if(CurrentFrame < 3)
						{
							CurrentFrame++;
						}
						else
						{
							CurrentFrame=0;
						}
					}
				}
				else
				{
					if(isWall)
					{
						ctx.drawImage(imgTileWall,randImg * 64, posWall, 64, 64, x, y, 64, 64);
					}
					else
					{
						ctx.drawImage(imgTile,randImg * 64, posFloor, 64, 64, x, y, 64, 64);
					}
				}
				ctx.fill();
			}
	}
}
