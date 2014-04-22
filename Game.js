window.addEventListener("load",function() {

	//initializing the quintus engine that will show up on the page
	var Q = Quintus().include("Sprites, Input, Scenes, Anim, 2D, UI, Audio")
    Q.enableSound();
	Q.setup({maximize: true});

	//--------------------------------------------------------------
	//--------------------------------------------------------------
	//initalizing global variables used throughout

	var _interval_PC =  randomInterval(); //the interval between movements of the PC
	var _interval_PU = 10; // the interval between powerups showing up

	var _mouse_x= 0; //global var used to get the mouse position x
	var _mouse_y = 0; //global var used to get the mouse positoin y
	
	var _window_height = window.innerHeight;
	var _window_width = window.innerWidth; 

	var _velocity_x = 0;
	var _velocity_y = 0;

	var _angle_player1 = 45; //inital angle of the player 1 cannon, also global
	var _angle_player2 = 225; //inital angle of the player 2 cannon

	var _scale_player1 = 1; //initial scales of player 1 and 2, used for powerups
	var _scale_player2 = 1; 

	var _score_player1 = 1; //score multipleiears for player 1 and 2, used for powerups
	var _score_player2 = 1;

	var _fire_rate_player1 = 30; //multi shot boolean check for players 1 and 2, used for powerups
	var _fire_rate_player2 = 30;

	var _score = _window_width/2; //score of the game

	//----------------------------------------------------------------
	//----------------------------------------------------------------
	//some helper functions used throughout

	function randomPosX() //returns a random position inside the window
	{
	 	return Math.floor((Math.random() * (_window_width - 300)) + 300);
	}

	function randomInterval() //determines the interval between reedtards movements
	{
		return Math.floor((Math.random() * 10) + 100); //random interval between 100-150
	}

	function randomGoodFood() //determines the good food to load next
	{
		var rand = Math.floor((Math.random() * 5 ) + 1);

		if(rand == 1)
			return "milk.png";
		else if(rand == 2)
			return "lemon.png";
		else if(rand == 3)
			return "carrot.png";
		else if(rand == 4)
			return "corn.png";
		else if(rand == 5)
			return "eggplant.png";
		else
			return "error";
	}

	function randomBadFood() //determines a random bad food to shoot
	{
		var rand = Math.floor((Math.random() * 5) + 1);

		if(rand == 1)
			return "lolipop.png";
		else if(rand == 2)
			return "soda.png";
		else if(rand == 3)
		 	return "burger.png";
		else if(rand == 4)
			return "beer.png";
		else if(rand == 5)
			return "hotdog.png";
		else 
			return "error";
	}

	function randomPowerUP() //determines a random powerup to put on screen
	{
		var rand = Math.floor((Math.random() * 3) + 1);

		if(rand == 1)
			return "buckshot";
		else if(rand == 2)
			return "2xscore";
		else if(rand == 3)
			return "2xscale";

	}

	function resetAttributes() //reset all powerups for all players back to normal
	{	
		//reset scales
		_scale_player1 = 1;
		_scale_player2 = 1;

		//reset score multiplier
		_score_player1 = 1;
		_score_player2 = 1;

		//reset fire rate
		_fire_rate_player1 = 30;
		_fire_rate_player2 = 30;
	}

	function calcCanonAngle(player_id) //calculates the angle for player1/2 canons
	{
		if(player_id == 1) //if player 1
		{
			//do calculations
			_angle_player1 = Math.atan(_mouse_y/_mouse_x);
			_angle_player1 *= (180/Math.PI);
		}

		if(player_id == 2) //if player 2
		{
			//do calculations
			//also have to adjust for being on the top right corner of the screen
			var adjusted_x = _window_width - _mouse_x
			_angle_player2 = Math.atan(adjusted_x/_mouse_y);
			_angle_player2 *= (180/Math.PI);
			_angle_player2 += 90;
		}
	}

	function getMousePosition(mp) //gets the current mouse position at the time called
	{
		_mouse_x = mp.pageX;
		_mouse_y = mp.pageY;

		calcCanonAngle(1);
		calcCanonAngle(2);

	}

	function shootFood(player_id) //function that handles the shooting based on player selection
	{
		if(player_id == 1) //if player 1
			shootGoodFood;
		else if(player_id == 2) //if player 2
			shootBadFood;
	}

	function shootGoodFood() //function used for player one shooting
	{

		//limiting the strength for the shot 
		if(_mouse_x > (_window_width/1.25))
			_mouse_x = _window_width/1.25;
		if(_mouse_y > (_window_height/1.25))
			_mouse_y = _window_height/1.25;

		_velocity_x = (_mouse_x);
		_velocity_y = (_mouse_y);

		Q.stage(2).insert(new Q.GoodFood()); //inserting the new food at point (0,0)

		var obj = Q.stage(2).locate(0,0); //creating a local variable to manipulate that object

		//moving the newly created sprite object to the start point which
		//is at the mouth of the canon
		var angle_rad = (_angle_player1 * Math.PI)/180;
		obj.p.x = Math.cos(angle_rad) * 125;
		obj.p.y = Math.sin(angle_rad) * 125;

		//setting the initial x and y velocities of the sprite
		obj.p.velocity_x = _velocity_x;
		obj.p.velocity_y = _velocity_y;


	}

	function shootBadFood() //function used for player two shooting
	{

		//limiting the strength of the shot
		if(_mouse_x < (_window_width/4))
		 	_mouse_x = _window_width/4;
		if(_mouse_y > (_window_height/1.25))
			_mouse_y = _window_height/1.25;

		_velocity_x = ((_window_width) - _mouse_x); //some adjustments for being on top right
		_velocity_y = (_mouse_y);

		Q.stage(2).insert(new Q.BadFood()); //inserting a new food at point (0,0)

		var food = Q.stage(2).locate(0,0);

		//moving the new sprite obect to the start point at the mouth of the canon
		var angle_rad = (_angle_player2 * Math.PI)/180; //converting player 2 angle to radian
		food.p.x = (Math.cos(angle_rad) * 125) + _window_width;
		food.p.y = Math.sin(angle_rad) * 125;

		food.p.velocity_x = -_velocity_x; //velocity is set to negative since its moving left
		food.p.velocity_y = _velocity_y;
	}
	//-------------------------------------------------------------------
	//-------------------------------------------------------------------
	// Quintus sprite decleration/definitions

	Q.Sprite.extend("Fatty", {
	init: function(p) {
		var pos_fatty = randomPosX(); //the position fatty starts at
	  	this._super({
	    	asset: "fatty.png",
	    	x: pos_fatty,
	    	y: 300,
	    	velocity_x: 0,
	    	g: 9800
	  });

	    this.add("tween, 2d");

	},

		step: function(dt) {

		  _interval_PC--;

		  if(_interval_PC == 0)
		  {
		      _interval_PC = randomInterval();
		      var newPos = randomPosX();
		      //moving fatty to the new position once the interval is finished, takes 2 seconds and accelerates and decelearates
		      this.animate({ x : newPos}, 2, Q.Easing.Quadratic.InOut);  
		  }
		}
	});

	Q.Sprite.extend("GoodFood", {
		init: function(p) {
			var food = randomGoodFood();
			this._super({
				asset: food,
				velocity_x: 0,
				velocity_y: 0,
				g: 1000
			});

		this.add("tween");


		this.on("hit.sprite", function(collision) {

			if(collision.obj.isA("Fatty")) {
				this.destroy();
				_score += (5 * _score_player1);
			}

			else if(collision.obj.isA("Scalex2")) {
				_scale_player1 = 1.5;
				this.destroy();
			}

			else if(collision.obj.isA("Scorex2")) {
				_score_player1 = 2;
				this.destroy();
			}

			else if(collision.obj.isA("Buckshot")) {
				_fire_rate_player1 = 10;
				this.destroy();
			}

			else if(collision.obj.isA("BadFood")) {
				this.p.vx = -1;
			}
		})

		},

		step: function(dt){

			//applying physics to the food
			this.p.velocity_y += this.p.g * dt;
			this.p.y += this.p.velocity_y * dt;
			this.p.x += this.p.velocity_x * dt;

			this.p.angle -= 1;

			this.p.scale = _scale_player1;

			if(this.p.y >= _window_height + 100)
				this.destroy();

		}

	})

	Q.Sprite.extend("BadFood", {
		init: function(p) {
			var food = randomBadFood();
			this._super({
				asset: food,
				velocity_x: 0,
				velocity_y: 0,
				g: 1000
			});

		this.add("tween");


		this.on("hit.sprite", function(collision) {

			if(collision.obj.isA("Fatty")) {
				this.destroy();
				_score -= (5 * _score_player2);
			}

			else if(collision.obj.isA("Scalex2")) {
				_scale_player2 = 1.5;
				this.destroy();
			}

			else if(collision.obj.isA("Scorex2")) {
				_score_player2 = 2;
				this.destroy();
			}

			else if(collision.obj.isA("Buckshot")) {
				_fire_rate_player2 = 10;
				this.destroy();
			}

			else if(collision.obj.isA("GoodFood")) {
				this.p.vx = -1;
			}
		})

		},

		step: function(dt){

			this.p.velocity_y += this.p.g * dt;
			this.p.y += this.p.velocity_y * dt;
			this.p.x += this.p.velocity_x * dt;

			this.p.angle += 1;

			this.p.scale = _scale_player2;

			if(this.p.y >= _window_height + 100)
				this.destroy();


		}

	})

	Q.Sprite.extend("Scalex2", {
		init: function(p) {
			var posX = randomPosX();
			this._super({
				asset: "2xscale.png",
				x: posX,
				y: -20,
				vx: 0
			});

			this.add("2d");

			this.on("hit.sprite", function(collision) {

			if(collision.obj.isA("Fatty")) {
				//this.destroy();
			}

			else if(collision.obj.isA("Floor")) {
				//this.destroy();
				this.p.vx = -500;
			}

			else if(collision.obj.isA("BadFood")) {
				this.destroy();

			}

			else if(collision.obj.isA("GoodFood")) {
				this.destroy();
			}
		})

		},

		step: function(dt) {

			this.p.x += this.p.vx * dt;
			this.p.angle -= 5;
		}
	})

	Q.Sprite.extend("Scorex2", {
		init: function(p) {
			var posX = randomPosX();
			this._super({
				asset: "2xscore.png",
				x: posX,
				y: -20,
				vx: 0
			});

			this.add("2d");

			this.on("hit.sprite", function(collision) {

			if(collision.obj.isA("Fatty")) {
				//this.destroy();
			}

			else if(collision.obj.isA("Floor")) {
				//this.destroy();
				this.p.vx = -500;
			}

			else if(collision.obj.isA("BadFood")) {
				this.destroy();

			}

			else if(collision.obj.isA("GoodFood")) {
				this.destroy();
			}
		})

		},

		step: function(dt) {

			this.p.x += this.p.vx * dt;
			this.p.angle -= 5;

		}
	})

	Q.Sprite.extend("Buckshot", {
		init: function(p) {
			var posX = randomPosX();
			this._super({
				asset: "buckshot.png",
				x: posX,
				y: -20,
				vx: 0
			});

			this.add("2d");

			this.on("hit.sprite", function(collision) {

			if(collision.obj.isA("Fatty")) {
				//this.destroy();
			}

			else if(collision.obj.isA("Floor")) {
				//this.destroy();
				this.p.vx = -500;
			}

			else if(collision.obj.isA("BadFood")) {
				this.destroy();

			}

			else if(collision.obj.isA("GoodFood")) {
				this.destroy();
			}
		})

		},

		step: function(dt) {

			this.p.x += this.p.vx * dt;
			this.p.angle -= 5;

		}
	})

	Q.Sprite.extend("PowerUpHandler", {
		init: function(p) {
			this._super({
				x:0,
				y:0
			});

		},

		step: function(dt) {

			--_interval_PU;

			if(_interval_PU == 0)
			{
				var powerup_type = randomPowerUP();


				if(powerup_type == "2xscale")
					Q.stage(2).insert(new Q.Scalex2());
				else if(powerup_type == "2xscore")
					Q.stage(2).insert(new Q.Scorex2());
				else if(powerup_type == "buckshot")
					Q.stage(2).insert(new Q.Buckshot());
				else
					Q.stage(2).insert(new Q.Scalex2());


				resetAttributes(); //function that resets all the attributes of all players back to normal

				_interval_PU = 1000;
			}

		}
	})

	Q.Sprite.extend("Player1", {
		init: function(p) {
			this._super({
				asset: "cannon.png",
				x: 0,
				y: 0,
				angle: 45,
				fire_rate: 30
			})
		},

		step: function(dt) {
			//document.onmousemove = getMousePosition;
			//document.onmousedown = shootGoodFood;
			//shootGoodFood();

			--this.p.fire_rate;
			if(this.p.fire_rate == 0)
			{
				shootGoodFood();
				this.p.fire_rate = 30;
			}
			this.p.angle = _angle_player1;
		}
	})

	Q.Sprite.extend("Player2", {
		init: function(p) {
			this._super({
				asset: "cannon.png",
				x: _window_width,
				y: 0,
				angle: 225,
				fire_rate: 30
			})
		},

		step: function(dt) {
			document.onmousemove = getMousePosition;
			document.onmousedown = shootBadFood;

			// --this.p.fire_rate;
			// if(this.p.fire_rate == 0)
			// {
			// 	shootBadFood();
			// 	this.p.fire_rate = 30;
			// }
			this.p.angle = _angle_player2;
		}
	})

	Q.Sprite.extend("Floor", {
		init: function(p) {
			this._super({
				asset: "floor_transparent.png",
				x: 500,
				y: _window_height
			})
		}
	})

	Q.Sprite.extend("ScoreMarker", {
		init: function(p) {
			this._super({
				asset: "stick.png",
				x: _window_width/2,
				y: 40
			})
		},

		step: function(dt){
			this.p.x = _score;

			if(_score >= (_window_width/2 + 500))
				Q.stageScene("endGame",1, { label: "Player 1 Won!" });

			if(_score <= (_window_width/2 - 500))
				Q.stageScene("endGame",1, { label: "Player 2 Won!"});


		}
	})


	Q.Sprite.extend("View", {
		init:function(p) {
			this._super({
				asset: "view.png",
				x: _window_width/2,
				y: _window_height/2
			})
		},

		step: function(dt){
			this.p.x += .5;
		}
	})

	Q.Sprite.extend("ProgBar", {
		init:function(p) {
			this._super({
				asset: "progbar.png",
				x: _window_width/2,
				y: 40
			})
		}
	})

	//--------------------------------------------------------------------------
	//--------------------------------------------------------------------------
	//Quintus scene definitions

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
		Q.stageScene("cannnon",2);
		Q.stageScene("level1", 1);
		Q.stageScene("level2", 0);
	  });
	  box.fit(20);
	});

	Q.scene('powerups', function(stage) {

		var pup_handler = stage.insert(new Q.PowerUpHandler());
	})

	Q.scene('progressbar', function(stage) {

		var prog_bar = stage.insert(new Q.ProgBar());
		var score = stage.insert(new Q.ScoreMarker());
	})


	Q.scene("level1",function(stage) {

		var reedtard = stage.insert(new Q.Fatty());

		var floor = stage.insert(new Q.Floor());

	});

	Q.scene("level2", function(stage) {
	stage.insert(new Q.Repeater({ asset: "sky.png",
										repeatX: true,
										repeatY: false,
										speedX: .25,
										type: 0
									}));

	var clouds = stage.insert(new Q.Repeater({ asset: "clouds.png",
													repeatX: true,
													repeatY: false,
													speedX: 1,
													type: 0
												}));

	var city = stage.insert(new Q.Repeater({ asset: "city.png",
													repeatX: true,
													repeatY: false,
													speedX: 5,
													type: 0
												}));



	var floor = stage.insert(new Q.Repeater({ asset: "floor.png",
													repeatX: true,
													repeatY: false,
													speedX: 20,
													type: 0
												}));

	city.p.y = _window_height - 760;
	floor.p.y = _window_height - 740;

	var view = stage.insert(new Q.View());
	stage.add("viewport").follow(view);

});

	Q.scene("P1", function(stage) {

		//var player_1 = stage.insert(new Q.Player1());
		//var player_2 = stage.insert(new Q.Player2());
		var player_1 = stage.insert(new Q.Player1());
	})

	Q.scene("P2", function(stage){

		var player_2 = stage.insert(new Q.Player2());
	})

	//-----------------------------------------------------------------
	//-----------------------------------------------------------------
	//Quintus loading all assets and executing the game code

	Q.load(["fatty.png", "lime.png", "lemon.png", "carrot.png", "corn.png", "eggplant.png", "milk.png", "lolipop.png", "soda.png", "burger.png", "hotdog.png", "beer.png", "floor.png", "floor_transparent.png", "city.png", "sky.png", "clouds.png", "stick.png", "view.png", "progbar.png", "cannon.png", "2xscale.png", "2xscore.png", "buckshot.png"],function() {
		Q.stageScene("powerups", 5);
		Q.stageScene("P2", 4);
		Q.stageScene("P1",  3);
		Q.stageScene("level1", 2);
		Q.stageScene("progressbar", 1);
		Q.stageScene("level2", 0);

	});
});


// STATIC POWER-UPS APPEAR FEQUENTLY