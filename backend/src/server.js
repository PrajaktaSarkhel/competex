require('dotenv').config();
const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Server } = require('socket.io');

const { connectDB } = require('./config/db');
const { seedDatabase } = require('./utils/seedData');
const Competition = require('./models/Competition');

const competitionRoutes = require('./routes/competitionRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const devRoutes = require('./routes/devRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const server = http.createServer(app);

// WebSocket Setup for Real-time Concurrency Updates
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH'],
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`🔌 Client connected to WebSocket: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static assets (serves images like judge avatar, winners, etc.)
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Feedants Full-Stack Competition API',
  });
});

// API Routes
app.use('/api/competitions', competitionRoutes);
app.use('/api/competitions', registrationRoutes);
app.use('/api/competitions', submissionRoutes);
app.use('/api/dev', devRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is empty
    const count = await Competition.countDocuments();
    if (count === 0) {
      console.log('ℹ️ Database is empty. Running initial seed...');
      await seedDatabase();
    }

    server.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 Feedants Backend API Server running on port ${PORT}`);
      console.log(`🌐 Health: http://localhost:${PORT}/api/health`);
      console.log(`🏆 Competition: http://localhost:${PORT}/api/competitions/feedants-classical-dance`);
      console.log(`===============================================`);
    });
  } catch (err) {
    console.error('Fatal Server Error:', err);
    process.exit(1);
  }
};

startServer();

module.exports = { app, server };
