import { Router } from 'express';

export const tenantRouter = Router();

// GET /api/v1/tenant/:slug/resolve
tenantRouter.get('/:slug/resolve', async (req, res) => {
    const { slug } = req.params;

    // TODO: Fetch from database with caching
    const mockTenant = {
        id: 'tenant_123',
        slug,
        name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
        vertical: 'fnb',
        tier: 'pro',
        config: {
            theme: {
                primaryColor: '#3b82f6',
                accentColor: '#8b5cf6',
                mode: 'dark',
            },
            features: ['ai-assistant', 'whatsapp-ordering', 'kiosk-mode'],
            limits: {
                aiQueriesPerDay: 1000,
                storageGB: 10,
                teamMembers: 25,
            },
        },
    };

    res.json({
        success: true,
        data: mockTenant,
    });
});

// GET /api/v1/tenant/:slug/config
tenantRouter.get('/:slug/config', async (req, res) => {
    const { slug } = req.params;

    res.json({
        success: true,
        data: {
            slug,
            features: ['ai-assistant', 'whatsapp-ordering'],
            theme: {
                primaryColor: '#3b82f6',
                mode: 'dark',
            },
        },
    });
});
