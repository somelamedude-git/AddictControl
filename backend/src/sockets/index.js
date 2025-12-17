const { Server } = require("socket.io");

function initSockets(server, pingTimeout, pingInterval){
	const socket_ = new Server(server, {
		pingTimeout: pingTimeout,
		pingInterval: pingInterval,
		cors: "*"
	});

	return socket;
};


module.exports = {
	initSockets
}


