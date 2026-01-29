import React, { useState } from "react";
import { motion } from "framer-motion";
import { RetroGrid } from "../components/landing/RetroGrid";
import { ShimmerButton } from "../components/landing/ShimmerButton";
import { SpotlightCard } from "../components/landing/SpotlightCard";
import { VideoModal } from "../components/landing/VideoModal";
import { BorderBeam } from "../components/landing/BorderBeam";
import { Marquee } from "../components/landing/Marquee";
import { TrustMarquee } from "../components/landing/TrustMarquee";
// MagicUI Premium Components
import { Particles } from "../components/magicui/Particles";
import { Meteors } from "../components/magicui/Meteors";
import { SparklesText } from "../components/magicui/SparklesText";
import { NumberTicker } from "../components/magicui/NumberTicker";
import { MagicCard } from "../components/magicui/MagicCard";
import { AgentActivityCard, AgentStatus } from "../components/ui/AgentActivityCard";
import { Card } from "../components/ui/Card";
import { cn } from "../components/lib/utils";
import * as Icons from "lucide-react";
import * as Router from "react-router-dom";
const { useNavigate } = Router as any;

export const LandingPage = () => {
  const navigate = useNavigate();
  const [billingToggle, setBillingToggle] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const startSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(1);

    // Sequence of steps
    setTimeout(() => setSimStep(2), 2500); // Validating
    setTimeout(() => setSimStep(3), 5000); // Building
    setTimeout(() => setSimStep(4), 8000); // Completed
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSimStep(0);
  };

  return (
    <div className="min-h-screen bg-navy-900 text-white overflow-hidden relative font-sans selection:bg-accent-400/30">
      {/* 0. NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-full border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <img src="/images/niagahub-wordmark-ivory.jpg" alt="NiagaHub OS" className="h-8 w-auto" />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="hidden md:block px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <ShimmerButton
              onClick={() => navigate("/login")}
              className="hidden md:block py-2.5 px-5 text-xs"
            >
              Get Started
            </ShimmerButton>
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-neutral-400 hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <Icons.X size={24} /> : <Icons.Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-6 right-6 mt-2 p-4 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl animate-fade-in">
            <div className="flex flex-col gap-4">
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-300 hover:text-white transition-colors py-2">Features</a>
              <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-300 hover:text-white transition-colors py-2">Testimonials</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-300 hover:text-white transition-colors py-2">Pricing</a>
              <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-300 hover:text-white transition-colors py-2">FAQ</a>
              <hr className="border-white/10" />
              <button
                onClick={() => { navigate("/login"); setIsMobileMenuOpen(false); }}
                className="w-full py-3 rounded-lg border border-neutral-700 text-white hover:bg-neutral-800 transition-colors font-medium"
              >
                Sign In
              </button>
              <ShimmerButton
                onClick={() => { navigate("/login"); setIsMobileMenuOpen(false); }}
                className="w-full py-3 text-sm"
              >
                Get Started
              </ShimmerButton>
            </div>
          </div>
        )}
      </nav>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center min-h-screen max-w-7xl mx-auto px-6 pt-20 pb-40 text-center overflow-hidden">
        {/* Retro Grid Background */}
        <RetroGrid />

        {/* MagicUI Particles - Interactive floating particles - AMPLIFIED */}
        <Particles
          className="absolute inset-0 z-10"
          quantity={300}
          color="#22d3ee"
          size={1.5}
          staticity={20}
          ease={60}
        />

        {/* Second layer of particles - Orange/warm */}
        <Particles
          className="absolute inset-0 z-10"
          quantity={100}
          color="#f97316"
          size={1.2}
          staticity={40}
          ease={80}
        />

        {/* MagicUI Meteors - Shooting stars effect - MORE! */}
        <Meteors number={30} className="z-10" />

        {/* Hero Glow Orbs - Enhanced for premium look */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-br from-primary-500/40 to-primary-600/20 rounded-full blur-[150px] pointer-events-none z-0 animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-accent-400/35 to-accent-500/15 rounded-full blur-[130px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-accent-500/25 to-primary-500/15 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Pattern Background Overlay */}
        <div
          className="absolute inset-0 opacity-[0.05] bg-repeat pointer-events-none z-0 mix-blend-overlay"
          style={{ backgroundImage: 'url(/images/niagahub-pattern-fade.jpg)', backgroundSize: '600px' }}
        />


        {/* Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
          </span>
          <span className="text-xs font-medium text-neutral-300">
            NiagaHub OS v2.0 Live
          </span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="z-10 text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-6 max-w-4xl cursor-default"
        >
          Transform Your Startup Idea into a <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 via-primary-400 to-accent-400 animate-gradient-x drop-shadow-[0_0_30px_rgba(249,115,22,0.4)]">Market Leader.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="z-10 text-neutral-400 text-lg md:text-xl max-w-2xl text-center mb-10 leading-relaxed"
        >
          NiagaHub OS is the world's first AI-native platform that ideates, validates, and builds your company while you sleep. Stop managing, start winning.
        </motion.p>

        {/* CTAs */}
        <div className="z-10 flex flex-col sm:flex-row items-center gap-4 mb-12">
          <ShimmerButton className="px-8 py-4 text-lg" onClick={() => navigate("/login")}>
            Launch Your Startup Now
          </ShimmerButton>
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="flex items-center gap-2 px-8 py-4 rounded-full border border-white/10 text-white hover:bg-white/5 transition-all text-lg"
          >
            <Icons.Play size={20} className="text-primary-500" />
            Watch AI in Action
          </button>
        </div>

        {/* Compliance Badges */}
        <div className="flex items-center gap-6 justify-center z-10 opacity-50">
          <div className="flex items-center gap-2 text-neutral-500 text-xs">
            <Icons.ShieldCheck size={14} className="text-green-500" />
            SOC2 Compliant
          </div>
          <div className="flex items-center gap-2 text-neutral-500 text-xs">
            <Icons.Lock size={14} className="text-blue-500" />
            GDPR Ready
          </div>
          <div className="flex items-center gap-2 text-neutral-500 text-xs text-nowrap">
            <Icons.Code size={14} className="text-neutral-500" />
            Open Source
          </div>
        </div>
      </section>

      {/* 2. TRUST MARQUEE */}
      <TrustMarquee />

      {/* 3. PROBLEM / AGITATE SECTION */}
      <section className="py-24 px-6 relative bg-gradient-to-b from-transparent via-red-950/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-widest mb-8"
          >
            The Problem
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-8 drop-shadow-[0_0_40px_rgba(34,211,238,0.2)]">
            Founding is a <span className="text-primary-400 italic drop-shadow-[0_0_30px_rgba(249,115,22,0.4)]">struggle.</span>
          </h2>
          <p className="text-neutral-500 text-lg mb-12 max-w-2xl mx-auto">90% of startups fail because founders spend 80% of their time on tasks that don't matter. Spreadsheet hell is real.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <MagicCard
              className="rounded-3xl"
              gradientFrom="#ef4444"
              gradientTo="#f97316"
              gradientColor="#1a1a1a"
            >
              <div className="p-8">
                <Icons.XCircle className="text-red-500 mb-4 w-8 h-8" />
                <h4 className="text-white font-bold mb-2">Fragmented Tools</h4>
                <p className="text-neutral-500 text-sm italic">Subscription fatigue and data silos.</p>
              </div>
            </MagicCard>
            <MagicCard
              className="rounded-3xl"
              gradientFrom="#ef4444"
              gradientTo="#22d3ee"
              gradientColor="#1a1a1a"
            >
              <div className="p-8">
                <Icons.XCircle className="text-red-500 mb-4 w-8 h-8" />
                <h4 className="text-white font-bold mb-2">Zero Validation</h4>
                <p className="text-neutral-500 text-sm italic">Building for a market that doesn't exist.</p>
              </div>
            </MagicCard>
            <MagicCard
              className="rounded-3xl"
              gradientFrom="#ef4444"
              gradientTo="#f97316"
              gradientColor="#1a1a1a"
            >
              <div className="p-8">
                <Icons.XCircle className="text-red-500 mb-4 w-8 h-8" />
                <h4 className="text-white font-bold mb-2">Capital Waste</h4>
                <p className="text-neutral-500 text-sm italic">High burn rate on manual operations.</p>
              </div>
            </MagicCard>
          </div>
        </div>
      </section>

      {/* 4. SOLUTION (LIVE DASHBOARD SIMULATION) */}
      <section id="simulation" className="py-24 px-6 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
              Experience the <span className="text-accent-400">Power of Autonomy</span>
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
              Don't just take our word for it. See our AI agents in action as they build a multi-million dollar startup from a single prompt.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Simulation Sidebar - Active Agents */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Icons.Bot size={16} className="text-primary-500" />
                  NiagaHub Fleet
                </h3>
                {isSimulating && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-500/20 text-accent-400 border border-accent-500/30 animate-pulse">
                    Live Processing
                  </span>
                )}
              </div>

              {!isSimulating ? (
                <div className="p-8 border border-dashed border-neutral-800 rounded-2xl bg-black/40 text-center group cursor-pointer hover:border-accent-500/50 transition-all" onClick={startSimulation}>
                  <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icons.Play size={24} className="text-accent-400 fill-accent-400" />
                  </div>
                  <h4 className="text-white font-medium mb-1">Start Live Simulation</h4>
                  <p className="text-xs text-neutral-500 line-clamp-2">Watch the agents tokenize, validate, and build a startup roadmap.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AgentActivityCard
                    agentName="Ideation Agent"
                    status={simStep === 1 ? "THINKING" : "COMPLETED"}
                    currentTask="Generating USP & Value Prop"
                    thinkingMessage="Scanning market voids in Southeast Asia..."
                  />
                  <AgentActivityCard
                    agentName="Market Agent"
                    status={simStep < 2 ? "IDLE" : simStep === 2 ? "EXECUTING" : "COMPLETED"}
                    currentTask="Validating TAM/SAM/SOM"
                    progress={simStep === 2 ? 65 : 100}
                  />
                  <AgentActivityCard
                    agentName="Chief Architect"
                    status={simStep < 3 ? "IDLE" : simStep === 3 ? "THINKING" : "COMPLETED"}
                    currentTask="Project Roadmap Construction"
                    thinkingMessage="Scaling architecture for high-load SaaS..."
                  />
                </div>
              )}
            </div>

            {/* Main Visual - Dashboard Mockup with Dynamic Overlays */}
            <div className="lg:col-span-8 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-1 bg-gradient-to-tr from-accent-400/20 to-primary-500/20 rounded-3xl relative overflow-hidden"
              >
                <BorderBeam colorFrom="#22d3ee" colorTo="#f97316" />
                <div className="bg-black/90 rounded-[22px] overflow-hidden border border-white/10 relative">
                  <img
                    src="/images/dashboard-preview.png"
                    alt="NiagaHub OS Dashboard Preview"
                    className={cn(
                      "w-full h-auto transition-all duration-1000",
                      isSimulating ? "opacity-40 scale-105 blur-sm" : "opacity-90 grayscale-[0.5] hover:grayscale-0"
                    )}
                  />

                  {/* Simulation Overlays */}
                  <AnimatePresence>
                    {isSimulating && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 bg-black/20 backdrop-blur-[2px]"
                      >
                        {/* Dynamic KPI Feed */}
                        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                          <Card className="!bg-black/80 border-accent-500/30 !p-4">
                            <span className="text-[10px] text-neutral-500 uppercase tracking-tighter">Market Viability</span>
                            <div className="text-2xl font-bold text-accent-400">
                              <NumberTicker value={simStep >= 2 ? 87 : 12} />%
                            </div>
                          </Card>
                          <Card className="!bg-black/80 border-primary-500/30 !p-4">
                            <span className="text-[10px] text-neutral-500 uppercase tracking-tighter">Tasks Automated</span>
                            <div className="text-2xl font-bold text-primary-400">
                              <NumberTicker value={simStep * 14} />
                            </div>
                          </Card>
                        </div>

                        {/* Console Log Simulation */}
                        <div className="mt-8 w-full font-mono text-[10px] text-accent-300/80 p-4 rounded-xl bg-black/60 border border-white/5 max-h-[150px] overflow-hidden">
                          <div className="animate-pulse">
                            {simStep >= 1 && <p>&gt; [Agent.Ideate] Initializing startup core...</p>}
                            {simStep >= 2 && <p>&gt; [Agent.Market] Crawling competitor data pools...</p>}
                            {simStep >= 3 && <p>&gt; [Agent.Architect] Synthesizing full-stack requirements...</p>}
                            {simStep >= 4 && <p className="text-green-400 font-bold">&gt; MISSION COMPLETE: Roadmap created in 8.2s</p>}
                          </div>
                        </div>

                        {simStep === 4 && (
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="mt-6"
                          >
                            <ShimmerButton onClick={() => navigate("/login")} className="px-6 py-2.5">
                              Claim This Project
                            </ShimmerButton>
                            <button onClick={resetSimulation} className="ml-4 text-xs text-neutral-500 hover:text-white underline py-2 transition-colors">
                              Run New Idea
                            </button>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Floating "AI Processing" Badge */}
              {isSimulating && (
                <div className="absolute -top-4 -right-4 z-[30] rotate-12">
                  <div className="bg-primary-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-2xl border border-primary-400">
                    FOUNDER MODE ON
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6 drop-shadow-[0_0_35px_rgba(34,211,238,0.15)]">
            Loved by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 drop-shadow-[0_0_25px_rgba(249,115,22,0.3)]">
              10,000+
            </span>{" "}
            founders
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            See what startup leaders say about NiagaHub OS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Testimonial 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-xl"
          >
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Icons.Star
                  key={i}
                  size={16}
                  className="text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>
            <p className="text-neutral-300 mb-6 leading-relaxed">
              "NiagaHub OS replaced 7 different tools for us. The AI ideation
              module alone saved us 2 months of research. Game changer."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                SC
              </div>
              <div>
                <div className="text-white font-medium">Sarah Chen</div>
                <div className="text-neutral-500 text-sm">
                  CEO, TechStart Inc
                </div>
              </div>
            </div>
          </motion.div>

          {/* Testimonial 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-xl"
          >
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Icons.Star
                  key={i}
                  size={16}
                  className="text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>
            <p className="text-neutral-300 mb-6 leading-relaxed">
              "Raised $2.5M using investor matching feature. The AI-generated
              pitch decks were incredibly polished. VCs were impressed."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                MR
              </div>
              <div>
                <div className="text-white font-medium">Marcus Rodriguez</div>
                <div className="text-neutral-500 text-sm">Founder, FinFlow</div>
              </div>
            </div>
          </motion.div>

          {/* Testimonial 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-xl"
          >
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Icons.Star
                  key={i}
                  size={16}
                  className="text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>
            <p className="text-neutral-300 mb-6 leading-relaxed">
              "The automated finance module caught a $50K discrepancy in our
              runway calculation. It literally saved our company."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                AJ
              </div>
              <div>
                <div className="text-white font-medium">Amanda Johnson</div>
                <div className="text-neutral-500 text-sm">CFO, DataVerse</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Founders", value: "10,000+", icon: Icons.Users },
            { label: "AI Generations", value: "5M+", icon: Icons.Zap },
            { label: "Capital Raised", value: "$50M+", icon: Icons.DollarSign },
            { label: "Countries", value: "120+", icon: Icons.Globe },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <stat.icon size={24} className="text-primary-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-neutral-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="py-32 px-6 max-w-7xl mx-auto bg-neutral-900/30">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6 drop-shadow-[0_0_35px_rgba(34,211,238,0.15)]">
            From idea to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 drop-shadow-[0_0_25px_rgba(249,115,22,0.3)]">
              Series A
            </span>{" "}
            in 3 steps
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            NiagaHub OS guides you through every stage of your startup journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="relative">
            <div className="absolute -left-4 top-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              1
            </div>
            <div className="ml-8">
              <h3 className="text-2xl font-bold text-white mb-3">
                Ideate & Validate
              </h3>
              <p className="text-neutral-400 mb-4">
                Describe your vision. Our AI agents generate business models,
                validate hypotheses, and analyze market fit.
              </p>
              <ul className="space-y-2 text-neutral-500 text-sm">
                <li className="flex items-center gap-2">
                  <Icons.Check size={14} className="text-primary-400" />{" "}
                  AI-powered ideation
                </li>
                <li className="flex items-center gap-2">
                  <Icons.Check size={14} className="text-primary-400" /> Market
                  research automation
                </li>
                <li className="flex items-center gap-2">
                  <Icons.Check size={14} className="text-primary-400" />{" "}
                  Hypothesis testing
                </li>
              </ul>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary-600 to-transparent"></div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="absolute -left-4 top-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              2
            </div>
            <div className="ml-8">
              <h3 className="text-2xl font-bold text-white mb-3">
                Build & Launch
              </h3>
              <p className="text-neutral-400 mb-4">
                Track product roadmap, manage sales pipeline, and automate
                marketing. All in one unified platform.
              </p>
              <ul className="space-y-2 text-neutral-500 text-sm">
                <li className="flex items-center gap-2">
                  <Icons.Check size={14} className="text-primary-400" /> 17
                  integrated modules
                </li>
                <li className="flex items-center gap-2">
                  <Icons.Check size={14} className="text-primary-400" />{" "}
                  Real-time analytics
                </li>
                <li className="flex items-center gap-2">
                  <Icons.Check size={14} className="text-primary-400" />{" "}
                  Cross-module linking
                </li>
              </ul>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary-600 to-transparent"></div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="absolute -left-4 top-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              3
            </div>
            <div className="ml-8">
              <h3 className="text-2xl font-bold text-white mb-3">
                Fundraise & Scale
              </h3>
              <p className="text-neutral-400 mb-4">
                Match with investors, generate pitch decks, and manage your
                fundraising round with AI assistance.
              </p>
              <ul className="space-y-2 text-neutral-500 text-sm">
                <li className="flex items-center gap-2">
                  <Icons.Check size={14} className="text-primary-400" />{" "}
                  Investor database matching
                </li>
                <li className="flex items-center gap-2">
                  <Icons.Check size={14} className="text-primary-400" /> AI
                  pitch deck generator
                </li>
                <li className="flex items-center gap-2">
                  <Icons.Check size={14} className="text-primary-400" /> Cap
                  table management
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BENTO GRID FEATURES */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
            Everything you need. <span className="text-neutral-500">Nothing you don't.</span>
          </h2>
          <p className="text-neutral-400 max-w-xl text-lg">
            Replace your fragmented stack with a unified OS. Agents for every
            department, working 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Ideation (Large) */}
          <SpotlightCard className="md:col-span-2 h-[300px] group border-primary-500/20">
            <BorderBeam size={250} duration={12} colorFrom="#22d3ee" colorTo="#f97316" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="p-2 w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <Icons.Lightbulb size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  AI Ideation Lab
                </h3>
                <p className="text-neutral-400 text-sm max-w-sm">
                  Generate business models, validate hypotheses, and pivot
                  strategies with deep market intelligence agents.
                </p>
              </div>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-500/10 to-transparent" />
          </SpotlightCard>

          {/* Card 2: Market Research */}
          <SpotlightCard className="h-[300px] group">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="p-2 w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 mb-4 group-hover:rotate-12 transition-transform">
                <Icons.BarChart2 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Market Data
                </h3>
                <p className="text-neutral-400 text-sm">
                  Real-time competitor tracking and trend analysis.
                </p>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 3: Finance */}
          <SpotlightCard className="h-[300px] group">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="p-2 w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 mb-4">
                <Icons.DollarSign size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Auto-Finance
                </h3>
                <p className="text-neutral-400 text-sm">
                  Automated bookkeeping, burn rate calculation, and runway
                  forecasting.
                </p>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 4: Investor (Large) */}
          <SpotlightCard className="md:col-span-2 h-[300px] group">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="p-2 w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400 mb-4 group-hover:scale-110 transition-transform">
                <Icons.Users size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Investor Matching
                </h3>
                <p className="text-neutral-400 text-sm max-w-sm">
                  Find right VCs. Generate pitch decks. Manage your cap table.
                  All in one place.
                </p>
              </div>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-orange-500/10 to-transparent" />
          </SpotlightCard>

          {/* Card 5: Product Roadmap */}
          <SpotlightCard className="h-[250px] group">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="p-2 w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400">
                <Icons.Box size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Product Roadmap
                </h3>
                <p className="text-neutral-400 text-sm">
                  Kanban-style roadmap with AI suggestions and priority scoring.
                </p>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 6: Sales Pipeline */}
          <SpotlightCard className="h-[250px] group">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="p-2 w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center text-pink-400">
                <Icons.Target size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Sales Pipeline
                </h3>
                <p className="text-neutral-400 text-sm">
                  Track deals, automate follow-ups, and close more with AI.
                </p>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 7: HR & Talent */}
          <SpotlightCard className="h-[250px] group">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="p-2 w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400">
                <Icons.Users size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  ATS & Hiring
                </h3>
                <p className="text-neutral-400 text-sm">
                  Applicant tracking, candidate pipeline, and AI screening.
                </p>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 8: Legal Documents */}
          <SpotlightCard className="h-[250px] group">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="p-2 w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-400">
                <Icons.Scale size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Legal Vault
                </h3>
                <p className="text-neutral-400 text-sm">
                  Document management, compliance tracking, and AI contract
                  review.
                </p>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 9: Marketing Suite */}
          <SpotlightCard className="h-[250px] group">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="p-2 w-12 h-12 bg-rose-500/20 rounded-lg flex items-center justify-center text-rose-400">
                <Icons.Megaphone size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Marketing AI
                </h3>
                <p className="text-neutral-400 text-sm">
                  Generate campaigns, copy, images, and videos with AI.
                </p>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 10: Analytics Hub */}
          <SpotlightCard className="h-[250px] group">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="p-2 w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center text-teal-400">
                <Icons.BarChart3 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Analytics Hub
                </h3>
                <p className="text-neutral-400 text-sm">
                  Cross-module insights, AI reports, and custom dashboards.
                </p>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 11: Supply Chain */}
          <SpotlightCard className="h-[250px] group">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="p-2 w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-400">
                <Icons.Truck size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Supply Chain
                </h3>
                <p className="text-neutral-400 text-sm">
                  Inventory tracking, order management, and logistics
                  automation.
                </p>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 12: Security & Compliance */}
          <SpotlightCard className="h-[250px] group">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="p-2 w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center text-violet-400">
                <Icons.Shield size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Security Center
                </h3>
                <p className="text-neutral-400 text-sm">
                  Compliance monitoring, audit logs, and risk management.
                </p>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section id="pricing" className="py-32 px-6 max-w-7xl mx-auto bg-neutral-900/30">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-[0_0_30px_rgba(249,115,22,0.2)]">
            Fair Pricing for Every Founder
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Start free, scale as you grow. No hidden fees, cancel anytime.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span
              className={`text-sm font-medium ${!billingToggle ? "text-neutral-400" : "text-white"}`}
            >
              Monthly
            </span>
            <button
              aria-label="Toggle billing period"
              onClick={() => setBillingToggle(!billingToggle)}
              className={`relative w-14 h-7 rounded-full transition-colors ${billingToggle ? "bg-primary-600" : "bg-neutral-700"}`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${billingToggle ? "translate-x-7" : "translate-x-0"}`}
              />
            </button>
            <span
              className={`text-sm font-medium ${billingToggle ? "text-white" : "text-neutral-400"}`}
            >
              Yearly <span className="text-green-400 ml-1">-25%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <SpotlightCard className="p-8 group hover:border-primary-600/50 transition-all">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
              <p className="text-neutral-400 text-sm">
                Perfect for solo founders
              </p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-neutral-400">/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "50 AI generations/day",
                "Basic ideation tools",
                "1 workspace",
                "Email support",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-neutral-300"
                >
                  <Icons.CheckCircle
                    size={16}
                    className="text-green-400 flex-shrink-0"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-lg border border-neutral-700 text-white hover:bg-neutral-800 transition-colors font-medium">
              Get Started Free
            </button>
          </SpotlightCard>

          {/* Growth Plan (Popular) */}
          <SpotlightCard className="p-8 border-primary-600/50 relative group">
            <BorderBeam duration={8} size={300} />
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 rounded-full text-white text-xs font-bold uppercase tracking-wider z-20 shadow-[0_0_20px_rgba(220,38,38,0.5)]">
              Most Popular
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Growth</h3>
              <p className="text-neutral-400 text-sm">For growing startups</p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-bold text-white">
                ${billingToggle ? "36" : "49"}
              </span>
              <span className="text-neutral-400">/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "Unlimited AI generations",
                "All 17 modules",
                "Veo video generation",
                "Priority support",
                "Advanced analytics",
                "Team collaboration",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-neutral-300"
                >
                  <Icons.CheckCircle
                    size={16}
                    className="text-green-400 flex-shrink-0"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-500 transition-colors font-medium">
              Start Free Trial
            </button>
          </SpotlightCard>

          {/* Scale Plan */}
          <SpotlightCard className="p-8 group hover:border-primary-600/50 transition-all">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Scale</h3>
              <p className="text-neutral-400 text-sm">Enterprise features</p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-bold text-white">
                ${billingToggle ? "149" : "199"}
              </span>
              <span className="text-neutral-400">/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "Everything in Growth",
                "Unlimited team members",
                "Custom AI models",
                "SSO & advanced security",
                "Dedicated account manager",
                "API access",
                "On-premises deployment",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-neutral-300"
                >
                  <Icons.CheckCircle
                    size={16}
                    className="text-green-400 flex-shrink-0"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-lg border border-neutral-700 text-white hover:bg-neutral-800 transition-colors font-medium">
              Contact Sales
            </button>
          </SpotlightCard>
        </div>
      </section>

      {/* 6. INTEGRATIONS SECTION */}
      <section className="py-20 overflow-hidden">
        <div className="text-center mb-12 px-6">
          <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            Works with your favorite tools
          </h3>
          <p className="text-neutral-500">Seamless integration with the modern stack.</p>
        </div>

        <div className="relative flex flex-col gap-8">
          <Marquee pauseOnHover className="[--duration:20s] py-4">
            {[
              { name: "PostgreSQL", icon: Icons.Database },
              { name: "Stripe", icon: Icons.CreditCard },
              { name: "AWS S3", icon: Icons.Cloud },
              { name: "DeepMind", icon: Icons.Cpu },
              { name: "OpenAI", icon: Icons.Brain },
              { name: "Auth0", icon: Icons.Lock },
              { name: "Slack", icon: Icons.MessageSquare },
              { name: "Linear", icon: Icons.Trello },
            ].map((tool, i) => (
              <div key={i} className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                <tool.icon className="w-5 h-5 text-primary-500" />
                <span className="text-white font-medium whitespace-nowrap">{tool.name}</span>
              </div>
            ))}
          </Marquee>

          <Marquee reverse pauseOnHover className="[--duration:25s] py-4">
            {[
              { name: "Vercel", icon: Icons.ExternalLink },
              { name: "Supabase", icon: Icons.Database },
              { name: "Resend", icon: Icons.Mail },
              { name: "Cloudflare", icon: Icons.Shield },
              { name: "GitHub", icon: Icons.Github },
              { name: "Discord", icon: Icons.MessageCircle },
              { name: "Notion", icon: Icons.FileText },
              { name: "Framer", icon: Icons.Layout },
            ].map((tool, i) => (
              <div key={i} className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                <tool.icon className="w-5 h-5 text-blue-500" />
                <span className="text-white font-medium whitespace-nowrap">{tool.name}</span>
              </div>
            ))}
          </Marquee>

          {/* Fading Gradients */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10" />
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section id="faq" className="py-32 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6 drop-shadow-[0_0_40px_rgba(249,115,22,0.2)]">
            Frequently asked <span className="text-neutral-500">questions</span>
          </h2>
          <p className="text-neutral-400 text-lg">
            Everything you need to know about NiagaHub OS.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "How does AI ideation work?",
              a: "Our AI agents analyze your idea against millions of data points including market trends, competitor analysis, and successful startup patterns. We generate business models, SWOT analyses, and validate assumptions in seconds.",
            },
            {
              q: "Is my data secure?",
              a: "Absolutely. We use bank-level encryption (AES-256) for all data at rest and TLS 1.3 for data in transit. We're SOC2 compliant and GDPR ready. Your data is never shared or sold to third parties.",
            },
            {
              q: "Can I export my data?",
              a: "Yes! You own your data. Export to CSV, JSON, or connect directly via API. We also offer one-click migration to competitors.",
            },
            {
              q: "What integrations do you support?",
              a: "We integrate with Google Gemini AI, Stripe for payments, S3 for storage, PostgreSQL for databases, and 50+ tools via our marketplace. More integrations added monthly.",
            },
            {
              q: "Do you offer a free trial?",
              a: "Yes! Start free forever with 50 AI generations/day. Upgrade when you're ready. No credit card required for free tier.",
            },
            {
              q: "How do investor features work?",
              a: "Our AI analyzes your startup's metrics and matches you with VCs who have invested in similar companies. We generate tailored pitch decks and provide warm introductions through our partner network.",
            },
          ].map((faq, i) => (
            <details
              key={i}
              className="group border border-neutral-800 rounded-lg bg-neutral-900/50"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer">
                <span className="text-white font-medium text-lg">{faq.q}</span>
                <Icons.ChevronDown
                  size={20}
                  className="text-neutral-400 group-open:rotate-180 transition-transform"
                />
              </summary>
              <div className="px-6 pb-6">
                <p className="text-neutral-400 leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-20 border-t border-white/10 bg-navy-950">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <img src="/images/niagahub-logo-full.jpg" alt="NiagaHub" className="h-12 w-auto rounded-lg shadow-2xl border border-white/5" />
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed mb-6">
              The operating system for modern founders. Automating the journey from idea to IPO.
            </p>
            <div className="flex items-center gap-4">
              <button aria-label="X (Twitter)" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white hover:border-white transition-all">
                <Icons.Twitter size={14} />
              </button>
              <button aria-label="GitHub" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white hover:border-white transition-all">
                <Icons.Github size={14} />
              </button>
              <button aria-label="LinkedIn" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white hover:border-white transition-all">
                <Icons.Linkedin size={14} />
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Product</h4>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li><a href="#" className="hover:text-white transition-colors">Ideation Agent</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Market Research</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Investor CRM</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sales Pipeline</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Resources</h4>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 text-xs">
            &copy; 2026 NiagaHub OS Inc. All rights reserved. Built with Geist.
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
