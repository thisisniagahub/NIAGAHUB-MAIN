import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { healthRouter } from './routes/health';
import { tenantRouter } from './routes/tenant';
import { authRouter } from './routes/auth';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tenant', tenantRouter);

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 NIAGAOS API running on http://localhost:${PORT}`);
});

export default app;
