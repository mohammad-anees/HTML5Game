window.addEventListener("load",function() {

	var Q = Quintus().include("Sprites, Input, Scenes, Anim, 2D, Touch")
	Q.setup({maximize: true}).touch(Q.SPRITE_ALL);
	var interval =  randomInterval(); //the interval between movements

	var _x = 0;
	var _y = 0;

	function randomPos() //returns a random position inside the window
	{
	 	return Math.floor((Math.random() * (window.innerWidth - 300)) + 300);
	}

	function randomInterval() //determines the interval between fattasses movements
	{
		return Math.floor((Math.random() * 150) + 100); //random interval between 100-150
	}

	function randomGoodFood() //determines the good food to load next
	{
		var rand = Math.floor((Math.random() * 2 ) + 1);

		if(rand == 1)
			return "food_1.png";
		else if(rand == 2)
			return "food_2.png";
		else
			return "error";
	}

	function getMousePosition(mp)
	{
		_x = mp.pageX;
		_y = mp.pageY;

		return true;
	}

	function DrawSomething(mp)
	{
		Q.stage(0).insert(new Q.Food());
	}

	Q.Sprite.extend("Fatty", {
	init: function(p) {
		var pos_fatty = randomPos(); //the position fatty starts at
	  	this._super({
	    	asset: "fatty.png",
	    	x: pos_fatty,
	    	y: 300,
	    	vx: 0,
	    	g: 9800
	  });

	    this.add("tween, 2d");

	},

	step: function(dt) {

	  interval--;

	  if(interval == 0)
	  {
	      interval = randomInterval();
	      var newPos = randomPos();
	      //moving fatty to the new position once the interval is finished, takes 2 seconds and accelerates and decelearates
	      this.animate({ x : newPos}, 3, Q.Easing.Quadratic.InOut);  
	  }
	}
	});

	Q.Sprite.extend("Food", {
		init: function(p) {
			var pos_orange = randomPos();
			var food = randomGoodFood();
			this._super({
				asset: food,
				x: _x,
				y: _y,
				vx: 0,
				vy: 0,
				g: 10000
			});

		this.add("2d");

		this.on("hit.sprite", function(collision) {

			if(collision.obj.isA("Floor")) {
				this.p.vy = -(1/2);
			}

			else if(collision.obj.isA("Fatty")) {
				this.destroy();
			}
		})

		},

		step: function(dt){
				document.onmousemove = getMousePosition;


				document.onmousedown = DrawSomething;

		}

	})

	Q.Sprite.extend("Floor", {
		init: function(p) {
			this._super({
				asset: "floor.png",
				x: 500,
				y: window.innerHeight
			})
		}

	})

	Q.scene("level1",function(stage) {

		var fatass = stage.insert(new Q.Fatty());
		var orange = stage.insert(new Q.Food());
		var orange2 = stage.insert(new Q.Food());
		var floor = stage.insert(new Q.Floor());

		orange.p.y = _y;
		orange.p.x = _x;
	});


	// Make sure fatty.png is loaded
	Q.load("fatty.png, food_1.png, food_2.png, floor.png, sky.jpg",function() {
		Q.stageScene("level1", 0);
	});
});