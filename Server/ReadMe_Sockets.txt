This is the readme for the socket

In this prototype of the game, we create the server side using the node.js with the express application. Previously we had only used node.js to test simple webpage interactions using socket.io. Seeing as node.js is a lower lever interface by itself, we decided to implement express for a better experience.

The server now is created using an express application. We create the application using var app = express();

Another new thing that we included is the use of jade, which we use to load the game. Whenever the server is started, the application will load our game file whenever the user types localhost:3000/game. The port number and the path are important, since our server listens to that specific port and the path is how our server locates and loads the game.js. 

We saved our javascripts and images in a directory called views. We also created a directory called routes, which will route, or tell the server which file to open. In this case the only file available will be /game. 

To run this program, node.js must be installed. The way to start this program is by simply going to the directory of the files using the command console, and once in the directory just type: node Server.js.

One will know that the server has been started since on the console it will display a message that the server is listening on a port, as well as the sockets being started. 

The second thing to do is to open a web browser, and type localhost:3000/game. This must be typed when the server has been started. Once typed, the server will receive a message, and after a handshake or connection from the sockets has been established the game will appear in the browser. 

What you will notice is that the coordinates are being sent through the socket, and one can see that on the command console. We have yet to touch the taking of this coordinates to move the cannon from one client to another. We are not doublfull on how to do this; we already have the concept of sending data.However, since we were able to send data throught the clients, we believe that it at least satisfies the client/server necessities at this point.