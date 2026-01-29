import { Router } from 'express';

export const authRouter = Router();

// POST /api/v1/auth/login
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // TODO: Implement Supabase auth
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: { code: 'INVALID_INPUT', message: 'Email and password required' },
        });
    }

    res.json({
        success: true,
        data: {
            user: {
                id: 'user_123',
                email,
                name: 'Demo User',
                role: 'admin',
            },
            token: 'mock_jwt_token',
        },
    });
});

// POST /api/v1/auth/signup
authRouter.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({
            success: false,
            error: { code: 'INVALID_INPUT', message: 'Email, password, and name required' },
        });
    }

    res.status(201).json({
        success: true,
        data: {
            user: {
                id: 'user_new',
                email,
                name,
                role: 'customer',
            },
        },
    });
});

// POST /api/v1/auth/logout
authRouter.post('/logout', (_req, res) => {
    res.json({ success: true, data: { message: 'Logged out successfully' } });
});
