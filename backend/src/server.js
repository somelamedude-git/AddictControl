require('dotenv').config();
const { app } = require('./app.js');
const { createServer } = require('http');
const { initSockets } = require('./sockets/index.js');
const {getUserFromToken} = require('./utils/tokens.utils.js'); 
const mongoose = require('mongoose');
const { setSocketIO } = require('./utils/socket.util.js');
const testroutes = require('./routes/test.routes');
const authroutes = require('./routes/auth.routes');

const callsroutes = require('./routes/calls.routes');
const userroutes = require('./routes/user.routes.js')

app.use('/test', testroutes);
app.use('/', authroutes);
app.use('/calls', callsroutes);
app.use('/users', userroutes)

const httpServer = createServer(app);
const io = initSockets(httpServer, 60000, 25000);

setSocketIO(io);

io.on('connection', async (socket)=>{
	try {
		const token = socket.handshake.auth.token;
		
		if (!token) {
			console.log('Socket connection rejected: No token provided');
			socket.emit('auth_error', { message: 'Authentication token required' });
			socket.disconnect();
			return;
		}

		const { id, role } = await getUserFromToken(token);
		
		if (!id || !role) {
			console.log('Socket connection rejected: Invalid token');
			socket.emit('auth_error', { message: 'Invalid authentication token' });
			socket.disconnect();
			return;
		}

		socket.userId = id;
		socket.userRole = role;
		socket.join(`user:${id}`);
		
		console.log(`User ${id} (${role}) connected via socket`);
		
		socket.on('disconnect', () => {
			console.log(`User ${id} disconnected`);
		});
		
	} catch (error) {
		console.log('Socket authentication error:', error.message);
		socket.emit('auth_error', { message: 'Authentication failed' });
		socket.disconnect();
	}
});

const DB_URI = process.env.MONGO_URI;

console.log('Loaded MONGO_URI:', DB_URI);

if (!DB_URI) {
    console.error('MONGO_URI is missing');
    process.exit(1);
}

const startServer = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('DB connected');

        const PORT = process.env.PORT || 5000;
        httpServer.listen(PORT,'0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('DB connection failed:', err.message);
        process.exit(1);
    }
};

startServer();
