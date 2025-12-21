const { Server } = require("socket.io");

function initSockets(server, pingTimeout, pingInterval){
	const socket_ = new Server(server, {
		pingTimeout: pingTimeout,
		pingInterval: pingInterval,
		cors: "*"
	});

	return socket_;
};


module.exports = {
	initSockets
}


