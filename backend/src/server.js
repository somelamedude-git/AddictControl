const { app } = require('./app.js');
const { createServer } = require('http');
const { initSockets } = require('./sockets/index.js');

const httpServer = createServer(app);
const io = initSockets(httpServer, 60000, 25000);

io.on('connection', (socket)=>{
	console.log(socket);
});



