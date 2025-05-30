const socketIO = require('socket.io');
const Interview = require('../models/Interview');

class WebRTCService {
  constructor() {
    this.io = null;
    this.rooms = new Map();
  }

  initialize(server) {
    if (this.io) {
      console.log('WebSocket server already initialized');
      return;
    }

    this.io = socketIO(server, {
      cors: {
        origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Join interview room
      socket.on('join-room', ({ roomId, userId }) => {
        try {
          socket.join(roomId);
          
          if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, new Set());
          }
          this.rooms.get(roomId).add(socket.id);

          socket.to(roomId).emit('user-joined', { userId, socketId: socket.id });

          if (this.rooms.get(roomId).size === 1) {
            socket.emit('created', roomId);
          } else {
            socket.emit('joined', roomId);
          }

          if (this.rooms.get(roomId).size > 2) {
            socket.emit('full', roomId);
          }
        } catch (error) {
          console.error('Error in join-room:', error);
          socket.emit('error', { message: 'Failed to join room' });
        }
      });

      // WebRTC signaling
      socket.on('offer', ({ roomId, offer }) => {
        socket.to(roomId).emit('offer', offer);
      });

      socket.on('answer', ({ roomId, answer }) => {
        socket.to(roomId).emit('answer', answer);
      });

      socket.on('ice-candidate', ({ roomId, candidate }) => {
        socket.to(roomId).emit('ice-candidate', candidate);
      });

      // Code editor sync
      socket.on('code-change', ({ roomId, code, language }) => {
        socket.to(roomId).emit('code-change', { code, language });
      });

      // Chat messages
      socket.on('chat-message', ({ roomId, message }) => {
        this.io.to(roomId).emit('chat-message', message);
      });

      // Disconnection
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        this.handleDisconnect(socket);
      });
    });
  }

  handleDisconnect(socket) {
    this.rooms.forEach((participants, roomId) => {
      if (participants.has(socket.id)) {
        participants.delete(socket.id);
        this.io.to(roomId).emit('user-left', socket.id);
        
        if (participants.size === 0) {
          this.rooms.delete(roomId);
        }
      }
    });
  }

  getRoomParticipants(roomId) {
    return Array.from(this.rooms.get(roomId) || []);
  }

  isRoomAvailable(roomId) {
    const room = this.rooms.get(roomId);
    return !room || room.size < 2;
  }
}

module.exports = new WebRTCService();