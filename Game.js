window.addEventListener("load",function() {

	var Q = Quintus().include("Sprites, Input, Scenes, Anim, 2D").setup({maximize: true}).controls();
	var interval =  randomInterval(); //the interval between movements

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
			return "food.png";
		else if(rand == 2)
			return "beer.png";
		else
			return "error";
	}


	Q.Sprite.extend("Fatty", {
	init: function(p) {
		var pos_fatty = randomPos(); //the position fatty starts at
	  	this._super({
	    	asset: "fatty.png",
	    	x: pos_fatty,
	    	y: window.innerHeight - 200,
	    	vx: 50,
	    	g: 9800
	  });

	    this.add("tween");

	    this.on("hit.sprite", function(collision) {

	    	if(collision.obj.isA("Orange")) {
	    		//this.destroy();
	    	}
	    })
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

	Q.Sprite.extend("Orange", {
		init: function(p) {
			var pos_orange = randomPos();
			var food = randomGoodFood();
			this._super({
				asset: food,
				x: pos_orange,
				y: 20,
				vx: 0,
				g: 9800
			});

		this.add("2d");

		this.on("hit.sprite", function(collision) {

			if(collision.obj.isA("Floor")) {
				this.p.vy /= -2;
			}
		})

		},

		step: function(dt){
			if(this.p.y >= window.outerHeight)
				this.destroy();
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
		var orange = stage.insert(new Q.Orange());
		var orange2 = stage.insert(new Q.Orange());
		var floor = stage.insert(new Q.Floor());
	});

	// Make sure fatty.png is loaded
	Q.load("fatty.png, food.png, beer.png, floor.png",function() {
	 Q.stageScene("level1");
	});
});