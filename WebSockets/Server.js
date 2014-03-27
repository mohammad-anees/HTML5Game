
var http = require('http');
var url = require('url');
var fs = require('fs');
var io = require('socket.io');
var serverUrl = "localhost";

var server = http.createServer(function(request,response){

	console.log('Connection');
	
	console.log("Request: " + request.url);
	
	//Parse the url where the game will be hosted
	var path = url.parse(request.url).pathname;
	
	switch(path){
	
		case '/':
			response.writeHead(200, {'Content-Type' : 'text/html'});
			response.write('hello world');
			response.end();
			break;
			
		case '/Client.html':
			fs.readFile(__dirname + path, function(error,data){
			
				if (error){
					response.writeHead(404);
					response.write("file does not exist");
					response.end();
				}
				else{
					response.writeHead(200, {'Content-Type' : 'text/html'});
					response.write(data,'utf8');
					response.end();
				}
			});
			break;
		default:
			response.writeHead(404);
			response.write("What is this?");
			response.end();
			break;
	}
	
});

server.listen(10011);
//Omit debug statements
//io.set('log level',1);

console.log("Listening at " + serverUrl + ":" + "10011");

var serv_io = io.listen(server);
var clients = 0;
serv_io.sockets.on('connection',function(socket){

	clients = clients + 1;

	socket.emit('message', { 'message' : 'hello world'} );
	
	//while(clients < 2){
	
		socket.emit('message', { 'message' : 'Waiting on Second Player'} );
	//}
	
	//if(clients >=2){
	
		socket.on('p1_pressed',function(data){

			console.log(data.letter);
			serv_io.sockets.emit('getp1_box', { 'letter' : data.letter });
	
		});
		
		socket.on('p2_pressed',function(data){

			console.log(data.letter);
			serv_io.sockets.emit('getp2_box', { 'letter' : data.letter });
	
		});
		
		socket.on('p1_pushed_A',function(data){

			serv_io.sockets.emit('p1_button_A', { 'letter' : data.letter });
	
		});
		
		socket.on('p1_pushed_B',function(data){

			serv_io.sockets.emit('p1_button_B', { 'letter' : data.letter });
	
		});
		
		socket.on('p2_pushed_A',function(data){

			serv_io.sockets.emit('p2_button_A', { 'letter' : data.letter });
	
		});
		
		socket.on('p2_pushed_B',function(data){

			serv_io.sockets.emit('p2_button_B', { 'letter' : data.letter });
	
		});
		
	//}
	
	socket.on('disconnect',function(){
	
		client = client - 1;
	});
});


