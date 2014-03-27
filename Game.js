window.addEventListener("load",function() {

	var Q = Quintus().include("Sprites, Input, Scenes, Anim, 2D, Touch, UI")
	Q.setup({maximize: true}).touch(Q.SPRITE_ALL);
	var interval =  randomInterval(); //the interval between movements

	var _x = 0;
	var _y = 0;

	var _vx = 0;
	var _vy = 0;

	var _score = window.innerWidth/2;

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
		var rand = Math.floor((Math.random() * 3 ) + 1);

		if(rand == 1)
			return "food_1.png";
		else if(rand == 2)
			return "food_2.png";
		else if(rand == 3)
			return "food_3.png";
		else
			return "error";
	}

	function getMousePosition(mp)
	{
		_x = mp.pageX;
		_y = mp.pageY;

		_vx = (_x/60);
		_vy = (_y/60);

		return true;
	}

	function DrawSomething(mp)
	{
		Q.stage(0).insert(new Q.Food());

		var obj = Q.stage().locate(0,0);

		if(_x <= 300 && _y <= 300)
			obj.animate({ x : _x * 100, y: _y * 100, angle: 360 * 10}, 40, Q.Easing.Quadratic.Out);

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
				x: 0,
				y: 0,
				vx: 0,
				vy: 0,
				g: 10000
			});

		this.add("tween");

		this.on("hit.sprite", function(collision) {

			if(collision.obj.isA("Floor")) {
				this.p.vy = -(1/2);
			}

			else if(collision.obj.isA("Fatty")) {
				this.destroy();
				_score += 5;
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

	Q.Sprite.extend("ScoreBoard", {
		init: function(p) {
			this._super({
				asset: "stick.png",
				x: window.innerWidth/2,
				y: window.innerHeight - 10
			})
		},

		step: function(dt){
			this.p.x = _score;

			if(_score >= (window.innerWidth/2 + 150))
				Q.clearStages();


		}


	})


	Q.scene("level1",function(stage) {

		var fatass = stage.insert(new Q.Fatty());
		var orange = stage.insert(new Q.Food());
		var orange2 = stage.insert(new Q.Food());
		var floor = stage.insert(new Q.Floor());
		var score = stage.insert(new Q.ScoreBoard());

		orange.p.y = _y;
		orange.p.x = _x;
	});


	// Make sure fatty.png is loaded
	Q.load("fatty.png, food_1.png, food_2.png, food_3.png, floor.png, sky.jpg, stick.png",function() {
		Q.stageScene("level1", 0);

	});
});