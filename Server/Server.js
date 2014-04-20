

var express = require('express');
var routes = require('./routes');
var http = require('http');
var io = require('socket.io');
var path = require('path');

var app = express();

//Configuring the app
app.configure(function(){

	app.set('port', process.env.PORT || 3000);
	//app.set('ssoHostname', 'compute.cse.tamu.edu');
	app.set('views', __dirname + '/views');
	//app.set('public', __dirname + '/public');
	app.set('view engine', 'jade');
	app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static((__dirname, 'public')));

});

app.get('/',routes.index);
app.get('/game',routes.game);

var server = http.createServer(app);

server.listen(app.get('port'),function(){

	console.log("Server listening on port " + app.get('port'));
});

function randomPos() //returns a random position inside the window
{
	return Math.floor((Math.random() * (innerWidth - 300)) + 300);
}
	
function randomInterval() //determines the interval between reedtards movements
{
	return Math.floor((Math.random() * 10) + 100); //random interval between 100-150
}	

//---------------------------------



//---------------------------------


var serv_io = io.listen(server);
var SclientID = 1;
var innerWidth = 0;
var initialPosition = randomPos();
var initialInterval = randomInterval();
var fattyPosition = 0;
var fattyInterval = 0;
var client1 = 0;
var client2 = 0;
var clock = 2;

serv_io.sockets.on('connection',function(socket){

	console.log('Connection established!');
	
	socket.emit('message',{ clientID : SclientID});
	
	SclientID = SclientID + 1;

//Controls the synchronization of the fatty
	socket.on('Clients Connected', function(data){
	
		innerWidth = data.WindowWidth;
		initialPosition = randomPos();
		
		//Send initialPosition and initial Interval to clients
		serv_io.sockets.emit('Game Start',
		{		
			InitialPosition : initialPosition,
			InitialInterval : initialInterval
		});
	
	});
	
	//If client doesn't receive initialPosition and Interval, resend
	socket.on('Resend Interval-Position', function(data){

		socket.emit('Game Start',
		{
			InitialPosition : initialPosition,
			InitialInterval : initialInterval
		});
	
	});

	//Send Intervals to clients
	socket.on('Request Interval-Position', function(data){
		
		//clock has to reach 0 in order for us to send information
		if( clock == 2 ){
		
			clock = clock - 1;
		}	
		
		else if( clock == 1 ){
		
			fattyPosition = randomPos();
			fattyInterval = randomInterval();
			
			serv_io.sockets.emit('New Interval-Position',
			{
				FattyPosition : fattyPosition,
				FattyInterval : fattyInterval
			});
		
			clock = 2;
		}
	});

	
	
//Whenever we receive the Food Signal, send mouse info needed

	socket.on('mouseInfo2',function(data){
	
		//mouseUpdate3 will be taken by all, but only processed by client 1
		serv_io.sockets.emit('mouseUpdate3',
		{	
			mousePositionX: data.mousePositionX,
			mousePositionY: data.mousePositionY
			//CannonAngle: data.CannonAngle,
			
		});
	
	});
	
	socket.on('mouseDown1', function(){
	
		serv_io.sockets.emit('mouseDownUpdate2', 
		{
			//mouseDown : data.mouseDown 
		});
		
	});
	
	socket.on('mouseDown2', function(){
	
		serv_io.sockets.emit('mouseDownUpdate1', 
		{
			//mouseDown : data.mouseDown 
		});
		
	});
//Deals with controlling moving the cannon	
	socket.on('Angle1', function(data){
	
		serv_io.sockets.emit('AngleUpdate1', 
		{
			Angle : data.Angle
		});
		
	});
	
	socket.on('Angle2', function(data){
	
		serv_io.sockets.emit('AngleUpdate2', 
		{
			Angle :  data.Angle
		});
		
	});
	
//----Deals with drawing food on the clients
	socket.on('goodFood',function(data){
	
		serv_io.sockets.emit('drawGoodFood',
		{	
			GoodGuyPositionX: data.GoodGuyPositionX,
			GoodGuyPositionY: data.GoodGuyPositionY
			//CannonAngle: data.CannonAngle,
			
		});
	
	});
	
	socket.on('badFood',function(data){
	
		serv_io.sockets.emit('drawBadFood',
		{	
			BadGuyPositionX: data.BadGuyPositionX,
			BadGuyPositionY: data.BadGuyPositionY
			//CannonAngle: data.CannonAngle,
			
		});
	
	});
	
//----Deals with the score of the game

	socket.on('goodFoodHit',function(data){
	
		serv_io.sockets.emit('updatedScore', 
		{
			Score: data.Score
		});
	});
	
	socket.on('badFoodHit',function(data){
	
		serv_io.sockets.emit('updatedScore', 
		{
			Score: data.Score
		});
	});
	
//Fatty Position

	socket.on('fattyStart',function(data){
	
		serv_io.sockets.emit('fattyUpdateStart',
		{
			Start : data.Start
		});
	
	});

	socket.on('fattyPosition1',function(data){
	
		serv_io.sockets.emit('updatedPosition1',
		{
			fattyPosition : data.fattyPosition
		});
	
	});
	
	socket.on('fattyPosition2',function(data){
	
		serv_io.sockets.emit('updatedPosition2',
		{
			fattyPosition : data.fattyPosition
		});
	
	});
	
	
//Whenever a client disconnects, decrease the client count by one;
	socket.on('disconnect', function(){
	
		SclientID = SclientID - 1;
	});

});

