

var express = require('express');
var routes = require('./routes');
var http = require('http');
var io = require('socket.io');
var path = require('path');

var app = express();

//Configuring the app
app.configure(function(){

	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));

});

app.get('/',routes.index);
app.get('/game',routes.game);

var server = http.createServer(app);

server.listen(app.get('port'),function(){

	console.log("Express server listening on port " + app.get('port'));
});

var players = [];
var maxPlayers = 2;

var serv_io = io.listen(server);
var SclientID = 1;
serv_io.sockets.on('connection',function(socket){

	console.log('Connection established!');
	
	socket.emit('message',{ clientID : SclientID});
	
	SclientID = SclientID + 1;
	
	socket.on('mouseInfo1',function(data){
	
		//console.log(data);
		socket.emit('mouseUpdate4',
		{	
			mousePositionX: data.mousePositionX,
			mousePositiony: data.mousePositionY,
			CannonAngle: data.CannonAngle,
			
		});
	
	});
	
	socket.on('mouseInfo2',function(data){
	
		//console.log(data);
		socket.emit('mouseUpdate3',
		{	
			mousePositionX: data.mousePositionX,
			mousePositiony: data.mousePositionY,
			CannonAngle: data.CannonAngle,
			
		});
	
	});
	
	socket.on('disconnect', function(){
	
		SclientID = SclientID - 1;
	});

});

