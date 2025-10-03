const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendMail } = require('../utils/mailer');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const JWT_RESET_EXPIRES = process.env.JWT_RESET_EXPIRES || '1h';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// helper: create jwt
function createToken(payload, expiresIn = JWT_EXPIRES_IN) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

// POST /auth/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Input validation and sanitization
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    
    // Sanitize inputs
    const sanitizedName = name.trim().replace(/<[^>]*>/g, '');
    const sanitizedEmail = email.trim().toLowerCase();
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const existing = await User.findOne({ email: sanitizedEmail });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ 
      name: sanitizedName, 
      email: sanitizedEmail, 
      password: hashed, 
      role: 'user' // Always assign user role, admin must be set manually
    });

    const token = createToken({ id: user._id, role: user.role });

    res.status(201).json({
      message: 'User created',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    if (err.code === 11000) { // duplicate key
      return res.status(400).json({ message: 'Email already in use' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    
    // Sanitize email input
    const sanitizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: sanitizedEmail });
    if (!user || !user.password) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = createToken({ id: user._id, role: user.role });
    res.json({ message: 'Logged in', token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // create reset token (short lived)
    const resetToken = createToken({ id: user._id, action: 'reset' }, JWT_RESET_EXPIRES);

    // construct reset URL for frontend which will call /auth/reset-password with token + new password
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

    // send email
    const html = `<p>Hi ${user.name || 'user'},</p>
      <p>Click the link below to reset your password. This link will expire in ${JWT_RESET_EXPIRES}.</p>
      <a href="${resetUrl}">Reset password</a>`;
    await sendMail({ to: user.email, subject: 'Password reset', html });

    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: 'Token and newPassword required' });

    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || payload.action !== 'reset') return res.status(400).json({ message: 'Invalid token' });

    const user = await User.findById(payload.id);
    if (!user) return res.status(400).json({ message: 'User not found' });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    // Optionally issue a new login token
    const authToken = createToken({ id: user._id, role: user.role });

    res.json({ message: 'Password reset successful', token: authToken });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid or expired token', error: err.message });
  }
};

// GET /auth/me - Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('favorites comparisons');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Get me error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /auth/google/callback (after passport)
exports.googleCallback = async (req, res) => {
  try {
    // passport has attached req.user
    const user = req.user;
    if (!user) return res.status(400).json({ message: 'No user from google' });

    const token = createToken({ id: user._id, role: user.role });

    // You can redirect to frontend with token in query (or return JSON if API client)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/auth-success?token=${encodeURIComponent(token)}`;
    return res.redirect(redirectUrl);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
