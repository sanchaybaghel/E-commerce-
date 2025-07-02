// Simple authentication system that bypasses Firebase completely
// Uses basic username/password with bcrypt and simple JWT tokens

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Simple JWT secret (in production, use a proper secret)
const JWT_SECRET = process.env.JWT_SECRET || 'your-simple-jwt-secret-key-for-ecommerce';

// Simple user storage (in production, this would be in your database)
const users = new Map();

// Initialize with a default admin user
const initializeAuth = async () => {
  try {
    const adminPassword = await bcrypt.hash('admin123', 10);
    users.set('admin@example.com', {
      uid: 'admin-user-id',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      name: 'Admin User'
    });
    
    console.log('✅ Simple authentication system initialized');
    console.log('Default admin user: admin@example.com / admin123');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize auth system:', error);
    return false;
  }
};

// Register a new user
const registerUser = async (email, password, name = '') => {
  try {
    if (users.has(email)) {
      throw new Error('User already exists');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    users.set(email, {
      uid: userId,
      email,
      password: hashedPassword,
      role: 'customer',
      name: name || email.split('@')[0]
    });
    
    return { uid: userId, email, role: 'customer', name: name || email.split('@')[0] };
  } catch (error) {
    throw error;
  }
};

// Login user
const loginUser = async (email, password) => {
  try {
    const user = users.get(email);
    if (!user) {
      throw new Error('User not found');
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        uid: user.uid, 
        email: user.email, 
        role: user.role,
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return {
      token,
      user: {
        uid: user.uid,
        email: user.email,
        role: user.role,
        name: user.name
      }
    };
  } catch (error) {
    throw error;
  }
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Get user by ID
const getUserById = (uid) => {
  for (const [email, user] of users.entries()) {
    if (user.uid === uid) {
      return {
        uid: user.uid,
        email: user.email,
        role: user.role,
        name: user.name
      };
    }
  }
  return null;
};

// Initialize on module load
initializeAuth();

module.exports = {
  registerUser,
  loginUser,
  verifyToken,
  getUserById,
  isInitialized: () => true
};
