import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = (process.env.PORT || 3001) as number;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Serve frontend static files from internal folder
const frontendBuildPath = path.join(__dirname, 'frontend');
console.log('🔍 XXX Frontend build path:', frontendBuildPath);
app.use(express.static(frontendBuildPath, {
  maxAge: '1y',
  etag: false,
  index: false // Don't serve index.html for directories
}));

console.log('📁 Serving frontend from:', frontendBuildPath);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running with frontend!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    servedFrom: 'backend/frontend'
  });
});

app.get('/api/users', (req, res) => {
  res.json({
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
      { id: 3, name: 'Hassan Johnson', email: 'hassan@example.com' },
      { id: 3, name: 'Milad Johnson', email: 'milad@example.com' },
      { id: 3, name: 'Milad Johnson', email: 'milad2@example.com' },
    ],
    timestamp: new Date().toISOString()
  });
});

app.post('/api/echo', (req, res) => {
  res.json({
    received: req.body,
    echoedAt: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve frontend for all non-API routes (SPA support)
app.get('*', (req, res, next) => {
  // Don't handle API routes with SPA fallback
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  // Serve the frontend's index.html for all other routes
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// Error handling middleware
app.use((err: unknown, req: express.Request, res: express.Response) => {
  console.error('Error:', err);
  const message = isProduction
    ? 'Something went wrong!'
    : err instanceof Error
      ? err.message
      : String(err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Frontend served from: http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📁 Frontend location: ${frontendBuildPath}`);
});