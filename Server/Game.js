window.addEventListener("load",function() {

	var Q = Quintus().include("Sprites, Input, Scenes, Anim, 2D, Touch, UI")
	Q.setup({maximize: true}).touch(Q.SPRITE_ALL);
	var interval =  randomInterval(); //the interval between movements

	var _x = 0;
	var _y = 0;

	var _vx = 0;
	var _vy = 0;

	var _angle = 45;

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

		//Calc Cannon angle here

		_angle = Math.atan(_y / _x);
		_angle *= (180/Math.PI)

		//

		return true;
	}

	function DrawSomething(mp)
	{

		if(_x <= 400 && _y <= 400)
		{
			Q.stage(1).insert(new Q.Food());

			var obj = Q.stage(1).locate(0,0);

			obj.animate({ x : _x * 100, y: _y * 100, angle: 360 * 10}, 60, Q.Easing.Quadratic.Out);
		}

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
				//this.destroy();
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

	Q.Sprite.extend("Cannon", {
		init: function(p) {
			this._super({
				asset: "cannon.png",
				x: 0,
				y: 0,
				angle: 45
			})
		},

		step: function(dt) {
			//document.onmousemove = getMousePosition;
			this.p.angle = _angle;
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
				y: window.innerHeight - 50
			})
		},

		step: function(dt){
			this.p.x = _score;

			if(_score >= (window.innerWidth/2 + 500))
				Q.stageScene("endGame",1, { label: "You Won!" });


		}


	})

	Q.scene('endGame',function(stage) {
	  var box = stage.insert(new Q.UI.Container({
	    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
	  }));
	  
	  var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
	                                           label: "GGWP" }))         
	  var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
	                                        label: stage.options.label }));
	  button.on("click",function() {
	    Q.clearStages();
	    Q.stageScene('level1');
	  });
	  box.fit(20);
	});


	Q.Sprite.extend("View", {
		init:function(p) {
			this._super({
				asset: "view.png",
				x: window.innerWidth/2,
				y: window.innerHeight/2
			})
		},

		step: function(dt){
			this.p.x += .5;
		}
	})

	Q.Sprite.extend("ProgBar", {
		init:function(p) {
			this._super({
				asset: "meter_bar.png",
				x: window.innerWidth/2,
				y: window.innerHeight - 50

			})
		}
	})



	Q.scene("level1",function(stage) {

		var reedtard = stage.insert(new Q.Fatty());
		var orange2 = stage.insert(new Q.Food());
	
		var floor = stage.insert(new Q.Floor());
		var prog_bar = stage.insert(new Q.ProgBar());
		var score = stage.insert(new Q.ScoreBoard());


		//orange.p.y = _y;
		//orange.p.x = _x;
	});

	Q.scene("level2", function(stage) {


	
	stage.insert(new Q.Repeater({ asset: "sky.png",
										repeatX: true,
										repeatY: true,
										speedX: 4,
										type: 0
										}));
								
	// stage.insert(new Q.Repeater({ asset: "bush.png",
	// 									repeatX: true,
	// 									repeatY: false,
	// 									speedX:   13,
	// 									y: 400
	// 									}));


	var view = stage.insert(new Q.View());
	stage.add("viewport").follow(view);

});

	Q.scene("cannnon", function(stage) {

		var el_canon = stage.insert(new Q.Cannon());
	})


	// Make sure fatty.png is loaded
	Q.load("fatty.png, food_1.png, food_2.png, food_3.png, floor.png, sky.png, stick.png, bush.png, view.png, meter_bar.png, cannon.png",function() {
		Q.stageScene("cannnon",2);
		Q.stageScene("level1", 1);
		Q.stageScene("level2", 0);

	});
});