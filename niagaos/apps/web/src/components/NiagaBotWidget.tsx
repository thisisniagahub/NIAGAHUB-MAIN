
import { useState, useEffect, useRef } from 'react';
import { useNiagaBot } from '../lib/niagabot-client';

export function NiagaBotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const { messages, sendMessage, isThinking, isConnected, connect } = useNiagaBot();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-connect on mount
    useEffect(() => {
        connect();
    }, []);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">

            {/* CHAT WINDOW */}
            {isOpen && (
                <div className="mb-4 w-[400px] h-[600px] bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">

                    {/* Header */}
                    <div className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-900/40 to-purple-900/40 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                🤖
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">NiagaBot</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                    <span className="text-xs text-white/50">{isConnected ? 'Online' : 'Offline'}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                        {messages.length === 0 && (
                            <div className="text-center mt-20 opacity-50">
                                <div className="text-4xl mb-4">👋</div>
                                <p className="text-sm">I am NiagaBot. Co-Founder Mode.<br /> What are we building today?</p>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-sm'
                                            : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {isThinking && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-75" />
                                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-150" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-white/10 bg-black/20">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask NiagaBot..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isThinking}
                                className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-lg shadow-blue-900/20"
                            >
                                📤
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FLOATING TOGGLE BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl shadow-blue-600/30 flex items-center justify-center transition-all hover:scale-110 hover:shadow-blue-600/50 active:scale-95"
            >
                <span className="text-2xl group-hover:rotate-12 transition-transform">
                    {isOpen ? '✕' : '🤖'}
                </span>

                {/* Unread Indicator (Optional) */}
                {!isOpen && isConnected && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
                )}
            </button>
        </div>
    );
}
