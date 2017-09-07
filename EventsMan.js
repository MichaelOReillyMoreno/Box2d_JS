class EventsManager{

	constructor()
	{
		var map = {};
		var posMouse = [0, 0];
		var isClick = false;
		EnabledMouse();
		this.GetKeysMap = function ()
		{
			keyBoardManager();
			return map;
		};
		this.GetMousePos = function ()
		{
			if(isClick)
			{
				isClick = false;
			}
			else
			{
				posMouse = [99, 99];
			}
			return posMouse;

		};
		function keyBoardManager(){

			onkeydown = onkeyup = function(e){
				e = e || event;
				map[e.keyCode] = e.type == 'keydown';
			}
		}
		function EnabledMouse(){

			document.addEventListener('click', function(evt)
			{	
			isClick = true;
			posMouse[0] = Math.floor((evt.pageX - 10) / 64);
			posMouse[1] = Math.floor((evt.pageY - 10) / 64);
			},false);
		};
	}

}
