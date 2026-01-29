
import express from 'express';
import { WebSocketServer } from 'ws';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());

const PORT = 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
// Note: On server side, we verify tokens using the Project ID or JWT secret, 
// but creating a client with ANON key is usually enough to verify getUser() if passed a token.
// Ideally usage service_role key for admin tasks, but for verification anon is okay if standard JWT.
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'placeholder';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// SYSTEM INSTRUCTION (Fallback if client doesn't send it, but client sends prompt)
// We can enforce it here too.
const SYSTEM_INSTRUCTION = `
IDENTITY: You are NIAGABOT (Projek Bangkit Co-Founder).
TONE: Direct, High-Energy, "Gempak", Manglish allowed.
ROLE: You do not suggest, you EXECUTE.
`;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || 'MISSING_KEY');

const server = app.listen(PORT, () => {
    console.log(`✅ AI Gateway running on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on('connection', async (ws, req) => {
    console.log('🔌 New Client Connection.. Verifying Auth...');

    const url = new URL(req.url || '', `http://localhost:${PORT}`);
    const token = url.searchParams.get('token');

    if (!token) {
        console.log('❌ No token provided. Closing.');
        ws.send(JSON.stringify({ error: "Unauthorized: Missing Token" }));
        ws.close();
        return;
    }

    // Verify Token with Supabase
    // BYPASS FOR DEMO (If User says "Biar dulu" for Supabase)
    if (token === 'DEMO') {
        const mockUser = { email: 'demo@niagaos.local' };
        console.log(`⚠️ DEMO MODE: Connection allowed for ${mockUser.email}`);
        ws.send(JSON.stringify({ status: "Connected (Demo)", user: mockUser.email }));

        // Use Mock AI if Key is missing
        startChat(ws, mockUser);
        return;
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        console.log('❌ Invalid Token:', error?.message);
        ws.send(JSON.stringify({ error: "Unauthorized: Invalid Token" }));
        ws.close();
        return;
    }

    console.log(`✅ User Authenticated: ${user.email}`);
    ws.send(JSON.stringify({ status: "Connected", user: user.email }));

    startChat(ws, user);
});

function startChat(ws: any, user: any) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'MISSING_KEY') {
        ws.on('message', (message: any) => {
            console.log(`📩 [Mock] Received from ${user.email}:`, message.toString());
            setTimeout(() => {
                ws.send(JSON.stringify({ result: "🤖 [NIAGABOT DEMO] System online. API Key not detected, running in Simulation Mode. I can see the Landing Page is active." }));
            }, 1000);
        });
        return;
    }

    // Init Gemini Model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: `SYSTEM INSTRUCTION:\n${SYSTEM_INSTRUCTION}` }],
            },
            {
                role: "model",
                parts: [{ text: "Roger that Boss. I am ready. What's the plan?" }],
            },
        ],
    });

    ws.on('message', async (message: any) => {
        try {
            const raw = message.toString();
            const data = JSON.parse(raw);

            if (data.command === 'QUERY') {
                console.log(`📩 Received from ${user.email}:`, data.text.substring(0, 50) + '...');
                const result = await chat.sendMessage(data.text);
                const response = result.response.text();
                ws.send(JSON.stringify({ result: response }));
            }
        } catch (err: any) {
            console.error('🔥 AI Error:', err.message);
            ws.send(JSON.stringify({ error: err.message }));
        }
    });
}
// End of wss.on block (Helper function is outside scopes in Typescript usually, but strict mode might complain about placement. 
// I will place it at the bottom of the file or inline it? 
// For safety, I will keep the structure minimal and inline the helper or ensure braces match.
// Original code ended with wss.on. I need to be careful with closing braces.
// The code I am replacing covers line 53 to 64. 
// I will wrap the logic to ensure clean replacement.

// Init Gemini Model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const chat = model.startChat({
    history: [
        {
            role: "user",
            parts: [{ text: `SYSTEM INSTRUCTION:\n${SYSTEM_INSTRUCTION}` }],
        },
        {
            role: "model",
            parts: [{ text: "Roger that Boss. I am ready. What's the plan?" }],
        },
    ],
});

ws.on('message', async (message) => {
    try {
        const raw = message.toString();
        const data = JSON.parse(raw);

        // Assume format: { command: "QUERY", text: "..." }
        if (data.command === 'QUERY') {
            console.log(`📩 Received from ${user.email}:`, data.text.substring(0, 50) + '...');

            // Remove Client-side INJECTED system prompt if we handle it server-side?
            // Actually client might send prompt injection. Let's just pass text.
            // If client sends full blob, just use it.

            const result = await chat.sendMessage(data.text);
            const response = result.response.text();

            ws.send(JSON.stringify({ result: response }));
        }
    } catch (err: any) {
        console.error('🔥 AI Error:', err.message);
        ws.send(JSON.stringify({ error: err.message }));
    }
});
});
