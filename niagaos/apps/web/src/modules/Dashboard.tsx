
import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AgentActivityCard, AgentStatus } from '../components/ui/AgentActivityCard';
import { MOCK_KPIS } from '../constants';
import * as Icons from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { realtime } from '../services/realtimeService';
import { agentOrchestrator, AgentTask, AGENT_EVENTS } from '../services/agentOrchestrator';
import { useToast } from '../context/ToastContext';
import { Header } from '../components/layout/Header';
import { motion, AnimatePresence } from 'framer-motion';

const revenueData = [
  { name: 'Jan', mr: 4000, amt: 2400 },
  { name: 'Feb', mr: 3000, amt: 2210 },
  { name: 'Mar', mr: 2000, amt: 2290 },
  { name: 'Apr', mr: 2780, amt: 2000 },
  { name: 'May', mr: 1890, amt: 2181 },
  { name: 'Jun', mr: 2390, amt: 2500 },
  { name: 'Jul', mr: 3490, amt: 2100 },
];

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  agentName: string;
  taskDescription: string;
  thinkingSteps: string[];
}

const quickActions: QuickAction[] = [
  {
    id: 'validate',
    label: 'Validate Idea',
    icon: <Icons.Lightbulb size={18} />,
    agentName: 'Ideation Agent',
    taskDescription: 'Validating startup idea viability',
    thinkingSteps: ['Analyzing market trends...', 'Checking competition...', 'Calculating TAM/SAM/SOM...'],
  },
  {
    id: 'research',
    label: 'Research Market',
    icon: <Icons.Search size={18} />,
    agentName: 'Research Agent',
    taskDescription: 'Conducting market research',
    thinkingSteps: ['Scanning industry reports...', 'Identifying key players...', 'Mapping opportunities...'],
  },
  {
    id: 'report',
    label: 'Generate Report',
    icon: <Icons.FileText size={18} />,
    agentName: 'Analytics Agent',
    taskDescription: 'Generating business intelligence report',
    thinkingSteps: ['Aggregating KPIs...', 'Synthesizing insights...', 'Formatting report...'],
  },
  {
    id: 'pitch',
    label: 'Draft Pitch Deck',
    icon: <Icons.Presentation size={18} />,
    agentName: 'Pitch Agent',
    taskDescription: 'Creating investor pitch deck slides',
    thinkingSteps: ['Structuring narrative...', 'Designing visuals...', 'Polishing copy...'],
  },
];

export const Dashboard: React.FC = () => {
  const { addToast } = useToast();
  const [activeAgents, setActiveAgents] = useState<AgentTask[]>([]);
  const [aiInsight, setAiInsight] = useState<string>("Your burn rate is optimal. Consider accelerating hiring in Q2.");

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Subscribe to agent events
  useEffect(() => {
    const updateAgents = () => {
      setActiveAgents([...agentOrchestrator.getActiveAgentsList()]);
    };

    realtime.on(AGENT_EVENTS.TASK_STARTED, updateAgents);
    realtime.on(AGENT_EVENTS.TASK_PROGRESS, updateAgents);
    realtime.on(AGENT_EVENTS.TASK_THINKING, updateAgents);
    realtime.on(AGENT_EVENTS.TASK_COMPLETED, updateAgents);
    realtime.on(AGENT_EVENTS.TASK_ERROR, updateAgents);
    realtime.on(AGENT_EVENTS.QUEUE_UPDATED, updateAgents);

    return () => {
      realtime.off(AGENT_EVENTS.TASK_STARTED, updateAgents);
      realtime.off(AGENT_EVENTS.TASK_PROGRESS, updateAgents);
      realtime.off(AGENT_EVENTS.TASK_THINKING, updateAgents);
      realtime.off(AGENT_EVENTS.TASK_COMPLETED, updateAgents);
      realtime.off(AGENT_EVENTS.TASK_ERROR, updateAgents);
      realtime.off(AGENT_EVENTS.QUEUE_UPDATED, updateAgents);
    };
  }, []);

  const handleQuickAction = async (action: QuickAction) => {
    addToast('info', `Starting ${action.agentName}...`);
    await agentOrchestrator.runSimulatedAgentTask(
      action.agentName,
      action.taskDescription,
      action.thinkingSteps,
      4000
    );
    addToast('success', `${action.agentName} completed task!`);
  };

  return (
    <div className="space-y-6">
      <Header
        title="AI Command Center"
        subtitle={`Mission Control • ${today}`}
      />

      {/* 3-Column War Room Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT: Active Agents Panel */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Icons.Bot size={16} className="text-primary-500" />
              Active Agents
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
              {activeAgents.length} Running
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {activeAgents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 border border-dashed border-neutral-800 rounded-xl text-center"
              >
                <Icons.Zap size={24} className="mx-auto text-neutral-700 mb-2" />
                <p className="text-xs text-neutral-600">No agents active</p>
                <p className="text-[10px] text-neutral-700 mt-1">Use Quick Actions to start one →</p>
              </motion.div>
            ) : (
              activeAgents.map((agent) => (
                <AgentActivityCard
                  key={agent.id}
                  agentName={agent.agentName}
                  status={agent.status as AgentStatus}
                  currentTask={agent.taskDescription}
                  progress={agent.progress}
                  thinkingMessage={agent.thinkingMessage}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* CENTER: Main View */}
        <div className="lg:col-span-6 space-y-6">
          {/* AI Insight Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-primary-950/50 via-neutral-900 to-accent-950/30 border border-primary-500/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Icons.Sparkles size={16} className="text-primary-400" />
                <span className="text-[10px] uppercase tracking-widest text-primary-400 font-bold">AI Insight of the Day</span>
              </div>
              <p className="text-white text-lg font-medium leading-relaxed">"{aiInsight}"</p>
            </div>
          </motion.div>

          {/* KPI Grid */}
          <div className="grid grid-cols-2 gap-4">
            {MOCK_KPIS.slice(0, 4).map((kpi) => (
              <Card key={kpi.id} className="relative group hover:border-primary-600/50 transition-colors !p-4">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-neutral-500 text-xs font-medium">{kpi.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${kpi.trendDirection === 'up'
                    ? 'bg-green-900/30 text-green-400'
                    : kpi.trendDirection === 'down'
                      ? 'bg-red-900/30 text-red-400'
                      : 'bg-neutral-800 text-neutral-400'
                    }`}>
                    {kpi.trend > 0 ? '+' : ''}{kpi.trend}%
                  </span>
                </div>
                <div className="text-xl font-bold text-white">{kpi.value}</div>
              </Card>
            ))}
          </div>

          {/* Revenue Chart */}
          <Card title="Revenue Growth" className="!p-4">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorMr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#525252" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                  <Area type="monotone" dataKey="mr" stroke="#dc2626" strokeWidth={2} fillOpacity={1} fill="url(#colorMr)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* RIGHT: Quick Actions Panel */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Icons.Zap size={16} className="text-amber-400" />
            Quick Actions
          </h3>

          <div className="space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                className="w-full p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800/50 hover:border-neutral-700 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-primary-400 group-hover:bg-primary-500/10 transition-colors">
                    {action.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{action.label}</div>
                    <div className="text-[10px] text-neutral-600">{action.agentName}</div>
                  </div>
                  <Icons.ChevronRight size={14} className="ml-auto text-neutral-700 group-hover:text-neutral-400 transition-colors" />
                </div>
              </button>
            ))}
          </div>

          {/* System Status */}
          <div className="mt-6 p-4 rounded-xl border border-neutral-800 bg-neutral-900/30">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-neutral-400">All Systems Operational</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="flex items-center gap-1.5 text-neutral-500">
                <Icons.Server size={12} /> API: <span className="text-green-400">OK</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-500">
                <Icons.Database size={12} /> DB: <span className="text-green-400">OK</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-500">
                <Icons.Brain size={12} /> AI: <span className="text-green-400">OK</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-500">
                <Icons.Wifi size={12} /> WS: <span className="text-green-400">OK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};