import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
    res.json({
        success: true,
        data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            uptime: process.uptime(),
        },
    });
});

healthRouter.get('/ready', (_req, res) => {
    // TODO: Check database and redis connections
    res.json({
        success: true,
        data: {
            ready: true,
            services: {
                database: 'connected',
                redis: 'connected',
            },
        },
    });
});
