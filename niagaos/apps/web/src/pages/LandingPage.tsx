import { useState, useEffect } from 'react';
import { NiagaBotWidget } from '../components/NiagaBotWidget';

export function LandingPage() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        setIsLoaded(true);
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        { icon: '🛒', title: 'Retail Core', desc: 'Unified signals from orders, inventory, and kiosk.', size: 'col-span-2' },
        { icon: '💰', title: 'Finance AI', desc: 'Automated treasury and reconciliation.', size: 'col-span-1' },
        { icon: '📣', title: 'Marketing Engine', desc: 'GenAI-powered content orchestration.', size: 'col-span-1' },
        { icon: '⚙️', title: 'Operations Hub', desc: 'Synchronized supplier workflows.', size: 'col-span-2' },
    ];

    return (
        <div className="min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30 overflow-x-hidden font-sans">

            {/* Ambient Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px]" />
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: `url('/assets/brand/brand-pattern.jpg')`, backgroundSize: '400px' }}
                />
            </div>

            {/* Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-6 py-4 ${scrollY > 20 ? 'backdrop-blur-2xl bg-black/40 border-b border-white/5' : ''}`}>
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 pr-4 rounded-xl backdrop-blur-md">
                        <div className="bg-white rounded-lg p-1 shadow-lg flex items-center justify-center w-8 h-8">
                            <img src="/assets/brand/logo-symbol.jpg" alt="" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-display font-bold tracking-tighter text-lg">NIAGAHUB</span>
                    </div>

                    <div className="flex items-center gap-8">
                        <a href="#how" className="text-sm font-medium text-gray-400 hover:text-white transition-all">Inside the Hub</a>
                        <button
                            onClick={() => window.location.href = '/auth'}
                            className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-cyan-50 transition-all shadow-xl shadow-white/5 active:scale-95"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-44 pb-32 px-6">
                <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
                    <div className={`group relative mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                        <div className="absolute inset-0 bg-cyan-500/20 rounded-3xl blur-3xl group-hover:bg-cyan-400/30 transition-all" />
                        <div className="relative bg-white p-4 rounded-[2.5rem] shadow-2xl shadow-cyan-500/20 border border-white/10 ring-1 ring-white/20 transform transition-transform group-hover:scale-105 duration-500">
                            <img src="/assets/brand/logo-symbol.jpg" alt="Logo" className="w-24 h-24 object-contain rounded-2xl" />
                        </div>
                    </div>

                    <h1 className={`font-display text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        The Autonomous <br />
                        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Business Era.</span>
                    </h1>

                    <p className={`text-gray-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        NIAGAHUB is the cognitive operating system for modern enterprises.
                        Replace fragmented tools with one sentient brain.
                    </p>

                    <div className={`flex flex-col sm:flex-row gap-5 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <button className="bg-white text-black px-10 py-5 rounded-full text-lg font-bold hover:bg-gray-100 transition-all shadow-2xl active:scale-95 transition-transform">
                            Join Early Access
                        </button>
                        <button className="bg-white/5 border border-white/10 backdrop-blur-md text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white/10 transition-all active:scale-95 transition-transform">
                            See how it works
                        </button>
                    </div>
                </div>
            </section>

            {/* Bento Grid Features */}
            <section id="how" className="py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-20">
                        <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest bg-cyan-500/5 px-3 py-1 rounded-full border border-cyan-500/10">Capabilities</span>
                        <h2 className="font-display text-4xl md:text-5xl font-bold mt-6">One interface. <br /><span className="text-gray-500">Infinite orchestration.</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className={`${f.size} bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 rounded-3xl p-10 hover:border-white/10 transition-all group overflow-hidden relative backdrop-blur-sm`}>
                                <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-cyan-500/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-4xl mb-8 block grayscale group-hover:grayscale-0 transition-all duration-500">{f.icon}</span>
                                <h3 className="font-display text-2xl font-bold mb-3">{f.title}</h3>
                                <p className="text-gray-500 leading-relaxed max-w-xs group-hover:text-gray-400 transition-colors">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Zero-Click Timeline */}
            <section className="py-40 px-6 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Zero-Click <span className="text-gray-500">Mornings.</span></h2>
                        <p className="text-gray-400">The first 5 minutes of your day, managed by HUB.</p>
                    </div>

                    <div className="relative">
                        <div className="absolute left-[20px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                        <div className="space-y-20">
                            {[
                                { time: '08:00', title: 'Contextual Ingestion', desc: 'HUB parses overnight signals across all storefronts and bank feeds.' },
                                { time: '08:02', title: 'Cognitive Summary', desc: 'A prioritized report waiting for you. Highlighting what needs eyes.' },
                                { time: '08:05', title: 'Single-Tap Execution', desc: 'Approve payroll, trigger bulk restocks, and confirm strategy shifts.' },
                            ].map((step, i) => (
                                <div key={i} className="flex gap-10 items-start relative group">
                                    <div className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center shrink-0 z-10 group-hover:border-cyan-500/50 transition-colors">
                                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                    </div>
                                    <div>
                                        <span className="font-mono text-cyan-400 text-sm mb-2 block">{step.time}</span>
                                        <h3 className="text-2xl font-bold mb-2 font-display">{step.title}</h3>
                                        <p className="text-gray-500 max-w-lg leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-60 px-6 relative">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]" />
                </div>
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-display text-5xl md:text-7xl font-extrabold mb-10 tracking-tight leading-none">
                        Owned by humans. <br />
                        <span className="text-gray-500">Run by NIAGAHUB.</span>
                    </h2>
                    <button className="bg-white text-black px-12 py-6 rounded-full text-xl font-black hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.15)] active:scale-95 transition-transform">
                        Claim Your Domain
                    </button>
                    <p className="mt-10 text-gray-500 font-mono text-sm tracking-widest uppercase">Limited Availability for Q1 2026</p>
                </div>
            </section>

            <footer className="py-20 border-t border-white/5 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-3 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer">
                        <img src="/assets/brand/logo-symbol.jpg" alt="" className="w-6 h-6 object-contain" />
                        <span className="font-display font-bold tracking-tighter">NIAGAHUB</span>
                    </div>
                    <p className="text-gray-600 text-sm font-mono tracking-tighter">NIAGAHUB © 2026 — AUTONOMOUS OPERATING SYSTEM</p>
                </div>
            </footer>

            <NiagaBotWidget />
        </div>
    );
}
