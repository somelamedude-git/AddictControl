const { app } = require('./app.js');
const { createServer } = require('http');
const { initSockets } = require('./sockets/index.js');
const {getUserFromToken} = require('./utils/tokens.util.js'); // correct the routing later

const httpServer = createServer(app);
const io = initSockets(httpServer, 60000, 25000);

io.on('connection', (socket)=>{
	const token = socket.handshake.auth.token;
	const { id, role } = getUserFromToken(token);
	socket.userId = id;
	socket.join(`user:${id}`);
});

module.exports = {
	io
}



