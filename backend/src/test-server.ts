import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Test server running' });
});

// Try importing routes one by one to find the problematic one
try {
  console.log('Testing auth routes...');
  const authRoutes = require('./routes/auth').default;
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading auth routes:', error.message);
}

try {
  console.log('Testing user routes...');
  const userRoutes = require('./routes/users').default;
  app.use('/api/users', userRoutes);
  console.log('✅ User routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading user routes:', error.message);
}

try {
  console.log('Testing grain routes...');
  const grainRoutes = require('./routes/grains').default;
  app.use('/api/grains', grainRoutes);
  console.log('✅ Grain routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading grain routes:', error.message);
}

try {
  console.log('Testing deal routes...');
  const dealRoutes = require('./routes/deals').default;
  app.use('/api/deals', dealRoutes);
  console.log('✅ Deal routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading deal routes:', error.message);
}

try {
  console.log('Testing contact routes...');
  const contactRoutes = require('./routes/contacts').default;
  app.use('/api/contacts', contactRoutes);
  console.log('✅ Contact routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading contact routes:', error.message);
}

try {
  console.log('Testing payment routes...');
  const paymentRoutes = require('./routes/payments').default;
  app.use('/api/payments', paymentRoutes);
  console.log('✅ Payment routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading payment routes:', error.message);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
