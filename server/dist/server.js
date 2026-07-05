"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true
    }
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`Client ${socket.id} joined room ${roomId}`);
        // Notify others in the room
        socket.to(roomId).emit('user-joined', {
            userId: socket.handshake.auth?.userId,
            socketId: socket.id
        });
    });
    socket.on('leave-room', (roomId) => {
        socket.leave(roomId);
        console.log(`Client ${socket.id} left room ${roomId}`);
        socket.to(roomId).emit('user-left', {
            userId: socket.handshake.auth?.userId,
            socketId: socket.id
        });
    });
    socket.on('block-updated', (data) => {
        const room = data.pageId;
        socket.to(room).emit('block-updated', {
            blockId: data.blockId,
            content: data.content,
            userId: socket.handshake.auth?.userId,
            timestamp: new Date().toISOString()
        });
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});
// Routes
app.use('/api/auth', require('./controllers/userController'));
app.use('/api/workspaces', require('./controllers/workspaceController'));
app.use('/api/pages', require('./controllers/pageController'));
app.use('/api/blocks', require('./controllers/blockController'));
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebSocket available at ws://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map