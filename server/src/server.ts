import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
    console.log(`Client ${socket.id} joined room ${roomId}`);
    
    // Notify others in the room
    socket.to(roomId).emit('user-joined', {
      userId: socket.handshake.auth?.userId,
      socketId: socket.id
    });
  });

  socket.on('leave-room', (roomId: string) => {
    socket.leave(roomId);
    console.log(`Client ${socket.id} left room ${roomId}`);
    
    socket.to(roomId).emit('user-left', {
      userId: socket.handshake.auth?.userId,
      socketId: socket.id
    });
  });

  socket.on('block-updated', (data: { pageId: string; blockId: string; content: any }) => {
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

export type App = typeof app;
export type Socket = typeof io;
