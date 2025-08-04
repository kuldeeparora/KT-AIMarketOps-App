const { createServer } = require('http');
const { Server } = require('socket.io');
const Redis = require('ioredis');
const { createAdapter } = require('@socket.io/redis-adapter');
const jwt = require('jsonwebtoken');
const winston = require('winston');

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'websocket-server' },
  transports: [
    new winston.transports.File({ filename: 'logs/websocket-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/websocket-combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
  })
  ]
});

// Redis configuration for scalability
const pubClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3
  });

const subClient = pubClient.duplicate();

// Create HTTP server
const httpServer = createServer();

// Create Socket.IO server with production settings
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  maxHttpBufferSize: 1e6,
  upgradeTimeout: 10000
  });

// Use Redis adapter for horizontal scaling
io.adapter(createAdapter(pubClient, subClient));

// Authentication middleware
const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    socket.userId = decoded.userId;
    socket.userRole = decoded.role;
    next();
  } catch (error) {
    logger.error('Socket authentication failed:', error);
    next(new Error('Authentication error'));
  }
};

// Apply authentication middleware
io.use(authenticateSocket);

// Connection handling
io.on('connection', (socket) => {
  logger.info(`User ${socket.userId} connected with role ${socket.userRole}`);

  // Join user to their role-based room
  socket.join(`role:${socket.userRole}`);
  socket.join(`user:${socket.userId}`);

  // Handle inventory updates
  socket.on('inventory-update', (data) => {
    logger.info('Inventory update received:', data);
    
    // Broadcast to all connected clients
    io.emit('inventory-updated', {
      type: 'inventory',
      data: data,
      timestamp: new Date().toISOString()
  });
  });

  // Handle order updates
  socket.on('order-update', (data) => {
    logger.info('Order update received:', data);
    
    // Broadcast to all connected clients
    io.emit('order-updated', {
      type: 'order',
      data: data,
      timestamp: new Date().toISOString()
  });
  });

  // Handle real-time notifications
  socket.on('notification', (data) => {
    logger.info('Notification received:', data);
    
    // Send to specific user or role
    if (data.targetUserId) {
      io.to(`user:${data.targetUserId}`).emit('notification', {
        type: 'notification',
        data: data,
        timestamp: new Date().toISOString()
  });
    } else if (data.targetRole) {
      io.to(`role:${data.targetRole}`).emit('notification', {
        type: 'notification',
        data: data,
        timestamp: new Date().toISOString()
  });
    } else {
      // Broadcast to all
      io.emit('notification', {
        type: 'notification',
        data: data,
        timestamp: new Date().toISOString()
  });
    }
  });

  // Handle system alerts
  socket.on('system-alert', (data) => {
    logger.info('System alert received:', data);
    
    // Broadcast to all connected clients
    io.emit('system-alert', {
      type: 'system-alert',
      data: data,
      timestamp: new Date().toISOString()
  });
  });

  // Handle user activity tracking
  socket.on('user-activity', (data) => {
    logger.info('User activity received:', data);
    
    // Store activity in Redis for analytics
    const activityKey = `user-activity:${socket.userId}:${Date.now()}`;
    pubClient.setex(activityKey, 86400, JSON.stringify({
      userId: socket.userId,
      activity: data,
      timestamp: new Date().toISOString()
  }));
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    logger.info(`User ${socket.userId} disconnected: ${reason}`);
    
    // Clean up user-specific data
    socket.leaveAll();
  });

  // Handle errors
  socket.on('error', (error) => {
    logger.error('Socket error:', error);
  });
});

// Health check endpoint
httpServer.on('request', (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      connections: io.engine.clientsCount,
      timestamp: new Date().toISOString()
  }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  io.close(() => {
    logger.info('Socket.IO server closed');
    
    pubClient.quit();
    subClient.quit();
    
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  
  io.close(() => {
    logger.info('Socket.IO server closed');
    
    pubClient.quit();
    subClient.quit();
    
    process.exit(0);
  });
});

// Start the server
const PORT = process.env.WEBSOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  logger.info(`WebSocket server running on port ${PORT}`);
});

module.exports = { io, httpServer }; 