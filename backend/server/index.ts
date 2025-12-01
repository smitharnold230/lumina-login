import express from 'express';
import cors from 'cors';
#import dotenv from 'dotenv';
import { MongoClient, Db } from 'mongodb';
import authRoutes from './routes/auth';

#dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
let db: Db;
const mongoClient = new MongoClient(process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/lumina?authSource=admin');

async function connectDB() {
  try {
    await mongoClient.connect();
    db = mongoClient.db('lumina');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Make db available to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoClient.close();
  process.exit(0);
});
