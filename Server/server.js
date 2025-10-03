const dotenv = require('dotenv');
dotenv.config();

const { validateEnv } = require('./utils/validateEnv');
validateEnv();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session');
const http = require("http");               // <-- Needed for socket server
const { Server } = require("socket.io");    // <-- Socket.IO
const authenticateSocket = require("./utils/socketAuth"); // <-- your file
// routes
const propertyRoutes = require('./routes/propertyRoutes');
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require('./routes/authRouter');
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require('./routes/contactRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

require('./config/passport'); // passport strategy

const app = express();

// Security middleware first
const { apiLimiter, sanitizeInput } = require('./middlewares/security');
const { securityHeaders } = require('./middlewares/helmet');

// Apply security middleware globally
app.use(securityHeaders);
app.use(sanitizeInput);
app.use(apiLimiter);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS - allow frontend dev server
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));



// cookie-session for OAuth
app.use(cookieSession({
  name: 'session',
  keys: [process.env.COOKIE_KEY || 'fallback-key-change-in-production'],
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax'
}));

app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/auth", authRoutes);
app.use("/properties", propertyRoutes);
app.use("/admin", adminRoutes); 
app.use("/users", userRoutes);
app.use('/contact', contactRoutes);
app.use('/uploads', uploadRoutes);
app.use('/chat', chatRoutes);
app.use('/messages', messageRoutes);

// example protected admin route
const { isAuthenticated, isAdmin } = require('./middlewares/authMiddleware');

app.get('/admin/dashboard', isAuthenticated, isAdmin, (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard', user: req.user });
});

// connect to mongo and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Server connected to DB")
  // Step 1: create raw HTTP server
  const server = http.createServer(app);

  // Step 2: setup socket.io on that server
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  // Step 3: use authentication middleware
  app.set('io', io);
  io.use(authenticateSocket);

  // Step 4: socket connection handler
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.user._id})`);

    // example event: join personal room
    socket.join(socket.user._id.toString());

    // example event: send message
    socket.on("sendMessage", ({ toUserId, text }) => {
      const message = {
        from: socket.user._id,
        to: toUserId,
        text,
        createdAt: new Date()
      };

      // emit only to the receiver’s room
      io.to(toUserId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.username}`);
    });
  });

  // Start both HTTP + Socket server with error handling
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please use a different port or kill the process using this port.`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}).catch(err => {
  console.error('Mongo connection error:', err.message);
  process.exit(1);
});
