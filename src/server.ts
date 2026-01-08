// src/server.ts
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import formRoutes from './routes/formRoutes';
import { errorHandler } from './middleware/errorHandler';
import submissionService from './services/submissionService';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------- Middleware --------------------

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  })
);

// Parse JSON and URL-encoded bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy for accurate IP addresses behind reverse proxy
app.set('trust proxy', true);

// -------------------- Routes --------------------

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Form routes
app.use('/api/forms', formRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// -------------------- Background Jobs --------------------

// Store interval reference for cleanup
let retryInterval: NodeJS.Timeout | null = null;

// Only run background jobs outside of test environment
if (process.env.NODE_ENV !== 'test') {
  // Retry failed submissions every 5 minutes
  if (typeof (submissionService as any).retryFailedSubmissions === 'function') {
    retryInterval = setInterval(
      () => {
        (submissionService as any).retryFailedSubmissions().catch(console.error);
      },
      5 * 60 * 1000
    );
  }
}

// -------------------- Graceful Shutdown --------------------

export const stopBackgroundJobs = () => {
  if (retryInterval) {
    clearInterval(retryInterval);
    retryInterval = null;
  }
};

const shutdown = (signal: string) => {
  console.log(`${signal} received, shutting down gracefully`);
  stopBackgroundJobs();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// -------------------- Server --------------------

// Start server only if executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   Metasys Forms Backend Server        ║
╚════════════════════════════════════════╝

Server running on port ${PORT}
Environment: ${process.env.NODE_ENV || 'development'}

Available endpoints:
  POST /api/forms/contact
  POST /api/forms/proposal
  POST /api/forms/newsletter
  POST /api/forms/newsletter/unsubscribe
  GET  /api/health

Services:
  ✓ Express server started
  ✓ PostgreSQL connected
  ✓ Redis connected
  ✓ MinIO connected
  ✓ Email service ready
`);
  });
}

// Export app for testing
export default app;
