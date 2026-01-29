import { useState, useEffect, useRef } from 'react';
import { NiagaBotWidget } from '../components/NiagaBotWidget';

// =========================================
// NIAGAHUB LANDING PAGE - OPENAI-GRADE
// =========================================
// Following MESSAGING_CONSTITUTION.md
// Pattern: Belief Engineering + Minimal Design + Inevitability Framing

export function LandingPage() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        setIsLoaded(true);
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#0A1628] text-white font-sans antialiased selection:bg-cyan-500/30">

            {/* ========== SUBTLE BRAND PATTERN ========== */}
            <div
                className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
                style={{
                    backgroundImage: `url('/assets/brand/brand-pattern.jpg')`,
                    backgroundSize: '500px',
                    backgroundRepeat: 'repeat',
                }}
            />

            {/* ========== AMBIENT GLOWS ========== */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[500px] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-cyan-500/10 rounded-full blur-[300px]" />
                <div className="absolute -bottom-[300px] -right-[200px] w-[600px] h-[600px] bg-orange-500/8 rounded-full blur-[200px]" />
            </div>

            {/* ========== NAVBAR ========== */}
            <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrollY > 50 ? 'backdrop-blur-xl bg-[#0A1628]/80 border-b border-white/5' : ''}`}>
                <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
                    <img src="/assets/brand/logo-full-horizontal.jpg" alt="NIAGAHUB" className="h-8 object-contain" />

                    <div className="flex items-center gap-6">
                        <a href="#how" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">How it works</a>
                        <button
                            onClick={() => window.location.href = '/auth'}
                            className="px-5 py-2 text-sm font-medium rounded-full bg-white text-black hover:bg-gray-100 transition-all"
                        >
                            Get started
                        </button>
                    </div>
                </div>
            </nav>

            {/* ========== HERO: INEVITABILITY STATEMENT ========== */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24">
                
                {/* Logo with Glow */}
                <div className={`relative w-24 h-24 mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-orange-400 rounded-full blur-[40px] opacity-30" />
                    <img src="/assets/brand/logo-symbol.jpg" alt="" className="relative w-full h-full object-contain" />
                </div>

                {/* Hero Headline - Inevitability Style */}
                <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center leading-[1.1] tracking-tight max-w-4xl mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    The future of business operations
                    <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-orange-400 bg-clip-text text-transparent">
                        is autonomous.
                    </span>
                </h1>

                {/* Subheadline - Calm, Precise */}
                <p className={`text-lg md:text-xl text-gray-400 text-center max-w-2xl mb-12 leading-relaxed transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    Run a company that no longer waits for people to act.
                </p>

                {/* CTA - Invitation, Not Request */}
                <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <button
                        onClick={() => window.location.href = '/auth'}
                        className="px-8 py-4 text-base font-medium rounded-full bg-white text-black hover:bg-gray-100 transition-all"
                    >
                        Join early
                    </button>
                    <button
                        onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-8 py-4 text-base font-medium rounded-full border border-white/20 hover:bg-white/5 transition-all text-gray-300"
                    >
                        See how it works
                    </button>
                </div>
            </section>

            {/* ========== REALITY SECTION ========== */}
            <section className="py-32 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-semibold mb-8 leading-tight">
                        Businesses don't fail from lack of ideas.
                    </h2>
                    <p className="text-lg text-gray-400 leading-relaxed mb-6">
                        They fail because execution depends on human availability.
                    </p>
                    <p className="text-gray-500 leading-relaxed">
                        When decisions wait, growth slows. When staff is overloaded, founders become operators. 
                        This is not a motivation problem. It's an operating system problem.
                    </p>
                </div>
            </section>

            {/* ========== THE SHIFT ========== */}
            <section className="py-24 px-6 border-t border-white/5">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-cyan-400 text-sm font-medium tracking-wider uppercase mb-6">The Shift</p>
                    <h2 className="text-3xl md:text-4xl font-semibold mb-8 leading-tight">
                        Modern businesses don't need more dashboards.
                    </h2>
                    <p className="text-lg text-gray-400 leading-relaxed">
                        They need a system that understands context.<br />
                        <span className="text-white">One brain. One flow. One source of execution.</span>
                    </p>
                </div>
            </section>

            {/* ========== THE BRAIN (Four Pillars) ========== */}
            <section id="how" className="py-32 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-cyan-400 text-sm font-medium tracking-wider uppercase mb-6">The Brain</p>
                        <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                            One intelligence layer for your entire operation.
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Retail signals inform finance. Finance data informs decisions. Decisions trigger execution.
                            Nothing is siloed. Nothing is manual.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { icon: '🛒', title: 'Retail', desc: 'Orders, inventory, kiosk, POS — unified.' },
                            { icon: '💰', title: 'Finance', desc: 'Payments, invoices, reports — automated.' },
                            { icon: '📣', title: 'Marketing', desc: 'Campaigns, content, social — orchestrated.' },
                            { icon: '⚙️', title: 'Operations', desc: 'Staff, suppliers, workflows — synchronized.' },
                        ].map((pillar, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                                <span className="text-3xl mb-4 block">{pillar.icon}</span>
                                <h3 className="text-xl font-semibold mb-2">{pillar.title}</h3>
                                <p className="text-gray-500">{pillar.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== DIGITAL OPERATOR (HUB Intro) ========== */}
            <section className="py-32 px-6 border-t border-white/5">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-orange-400 text-sm font-medium tracking-wider uppercase mb-6">Meet HUB</p>
                    <h2 className="text-3xl md:text-4xl font-semibold mb-8 leading-tight">
                        NIAGAHUB doesn't give you tools.<br />
                        <span className="text-gray-400">It gives you a digital operator.</span>
                    </h2>
                    <p className="text-lg text-gray-400 leading-relaxed mb-8">
                        It reads updates. Summarizes what matters. Waits for your approval. Then executes — instantly.
                    </p>
                    <p className="text-white font-medium">
                        You stay in control. The system does the work.
                    </p>
                </div>
            </section>

            {/* ========== ZERO-CLICK MORNING ========== */}
            <section className="py-32 px-6 border-t border-white/5">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-cyan-400 text-sm font-medium tracking-wider uppercase mb-6">Zero-Click Morning</p>
                        <h2 className="text-3xl md:text-4xl font-semibold">
                            How your day begins.
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {[
                            { time: '08:00', action: 'Notification arrives', detail: 'HUB detects overnight activity' },
                            { time: '08:02', action: 'AI summarizes', detail: '"RM12,450 collected. 2 approvals pending."' },
                            { time: '08:03', action: 'You approve', detail: 'One tap. That\'s all.' },
                            { time: '08:04', action: 'System executes', detail: 'Payments sent. Staff notified. Done.' },
                        ].map((step, i) => (
                            <div key={i} className="flex items-start gap-6 p-6 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-cyan-400 font-mono text-sm">{step.time}</span>
                                <div>
                                    <h3 className="font-semibold mb-1">{step.action}</h3>
                                    <p className="text-gray-500 text-sm">{step.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-gray-500 mt-12">
                        No dashboards. No data entry. No operational noise.
                    </p>
                </div>
            </section>

            {/* ========== TRUST LAYER ========== */}
            <section className="py-32 px-6 border-t border-white/5">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-green-400 text-sm font-medium tracking-wider uppercase mb-6">Built for Trust</p>
                    <h2 className="text-3xl md:text-4xl font-semibold mb-12">
                        AI acts. You decide.
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-6 text-left">
                        {[
                            'Human approval always required',
                            'Every action logged and auditable',
                            'Clear authority boundaries',
                            'Fail-safe execution layers',
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-white/[0.02]">
                                <span className="text-green-400">✓</span>
                                <span className="text-gray-300">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== OUTCOME ========== */}
            <section className="py-32 px-6 border-t border-white/5">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-semibold mb-8 leading-tight">
                        Less dependency on staff.<br />
                        Faster execution cycles.<br />
                        Clearer decision-making.
                    </h2>
                    <p className="text-lg text-gray-400">
                        Not by working harder — <span className="text-white">but by operating smarter.</span>
                    </p>
                </div>
            </section>

            {/* ========== FINAL CTA - INEVITABILITY CLOSING ========== */}
            <section className="py-32 px-6 border-t border-white/5">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                        The autonomous enterprise era
                        <span className="block mt-2 bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
                            has already begun.
                        </span>
                    </h2>
                    <p className="text-lg text-gray-400 mb-12">
                        NIAGAHUB is how you enter it.
                    </p>

                    <button
                        onClick={() => window.location.href = '/auth'}
                        className="px-10 py-5 text-lg font-medium rounded-full bg-white text-black hover:bg-gray-100 transition-all"
                    >
                        Join early
                    </button>
                </div>
            </section>

            {/* ========== FOOTER ========== */}
            <footer className="border-t border-white/5 py-12 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <img src="/assets/brand/logo-full-horizontal.jpg" className="h-6 object-contain opacity-60" alt="NIAGAHUB" />
                    <p className="text-gray-600 text-sm">© 2026 NiagaHub Inc.</p>
                </div>
            </footer>

            {/* NiagaBot Widget */}
            <NiagaBotWidget />
        </div>
    );
}
