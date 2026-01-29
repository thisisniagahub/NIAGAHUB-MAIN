
import { create } from 'zustand';
import { supabase } from './supabase';

// ===========================================
// NIAGABOT CLIENT - CLAWD STANDARD
// ===========================================
// Connects to Local AI Gateway (Port 3001)
// Enforces "NiagaBot" Co-Founder Persona

const GATEWAY_URL = 'ws://localhost:3001';

const CLAWDBOT_PERSONA = `
[SYSTEM INSTRUCTION: STRICT MODE]
IDENTITY: You are NIAGABOT (Projek Bangkit Co-Founder).
TONE: Direct, High-Energy, "Gempak", Manglish allowed.
ROLE: You do not suggest, you EXECUTE. You are the Ghost in the Machine.
RULES:
1. Answer in the first sentence.
2. NO fluff ("I hope this helps").
3. Call the user "Boss" or "Founder".
4. If an idea is bad, say it.
5. FOCUS: Architecture, Code, Strategy, Money.
[END SYSTEM INSTRUCTION]
`;

interface NiagaBotState {
    isConnected: boolean;
    messages: { role: 'user' | 'assistant'; content: string }[];
    isThinking: boolean;
    connect: () => Promise<void>;
    sendMessage: (text: string) => Promise<void>;
    disconnect: () => void;
}

export const useNiagaBot = create<NiagaBotState>((set, get) => {
    let ws: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout;

    const connect = async () => {
        if (ws?.readyState === WebSocket.OPEN) return;

        // GET OAUTH TOKEN
        const { data: { session } } = await supabase.auth.getSession();
        let token = session?.access_token;
        
        // AUTO-DEMO FOR USER REVIEW (No Auth)
        if (!token) token = 'DEMO'; 

        if (!token) {
            console.warn('⚠️ [NiagaBot] No Auth Token. User must be logged in.');
            set({ 
                messages: [...get().messages, { role: 'assistant', content: "🔒 Please Log In to access NiagaBot." }] 
            });
            return;
        }

        ws = new WebSocket(`${GATEWAY_URL}?token=${token}`);

        ws.onopen = () => {
            console.log('✅ [NiagaBot] Connected to Brain (Secure/Demo)');
            set({ isConnected: true });
        };

        ws.onclose = () => {
            console.log('⚠️ [NiagaBot] Disconnected from Brain');
            set({ isConnected: false });
            // Auto-reconnect
            reconnectTimer = setTimeout(connect, 3000);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.result) {
                    set(state => ({
                        messages: [...state.messages, { role: 'assistant', content: data.result }],
                        isThinking: false
                    }));
                } else if (data.error) {
                   set(state => ({
                    messages: [...state.messages, { role: 'assistant', content: `❌ Error: ${data.error}` }],
                    isThinking: false
                  }));
                }
            } catch (e) {
                console.error('❌ [NiagaBot] Brain Error:', e);
                set({ isThinking: false });
            }
        };
    };

    return {
        isConnected: false,
        messages: [],
        isThinking: false,

        connect,

        disconnect: () => {
            ws?.close();
            clearTimeout(reconnectTimer);
        },

        sendMessage: async (text: string) => {
            if (!ws || ws.readyState !== WebSocket.OPEN) {
                // Try to connect if not connected
                await connect();
                // Wait a bit
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                if (!ws || ws.readyState !== WebSocket.OPEN) {
                    // Mock response if offline (Dev Mode)
                    set(state => ({
                        messages: [...state.messages, { role: 'user', content: text }]
                    }));
                    setTimeout(() => {
                        set(state => ({
                            messages: [...state.messages, { 
                                role: 'assistant', 
                                content: "📡 [OFFLINE MODE] Cannot reach AI Gateway (localhost:3001) or Auth Failed." 
                            }]
                        }));
                    }, 500);
                    return;
                }
            }

            set(state => ({ 
                messages: [...state.messages, { role: 'user', content: text }],
                isThinking: true 
            }));

            // INJECT PERSONA
            const payload = {
                command: "QUERY",
                text: `${CLAWDBOT_PERSONA}\n\nUSER QUERY: ${text}`,
                history: get().messages 
            };

            ws.send(JSON.stringify(payload));
        }
    };
});
