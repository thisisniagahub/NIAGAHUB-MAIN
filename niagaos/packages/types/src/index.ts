// ============================================
// NIAGAOS Shared Types
// ============================================

// --- Tenant Types ---
export type Vertical = 'fnb' | 'startup' | 'agent';
export type Tier = 'free' | 'pro' | 'enterprise';

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  vertical: Vertical;
  tier: Tier;
  config: TenantConfig;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantConfig {
  theme: ThemeConfig;
  features: string[];
  limits: TenantLimits;
}

export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  mode: 'light' | 'dark';
  logo?: string;
}

export interface TenantLimits {
  aiQueriesPerDay: number;
  storageGB: number;
  teamMembers: number;
}

// --- User Types ---
export type UserRole = 'admin' | 'owner' | 'staff' | 'customer';

export interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: Date;
}

// --- F&B Types ---
export interface Merchant {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  theme: ThemeConfig;
  settings: MerchantSettings;
}

export interface MerchantSettings {
  currency: string;
  taxRate: number;
  orderPrefix: string;
  kioskEnabled: boolean;
  whatsappEnabled: boolean;
}

export interface MenuItem {
  id: string;
  merchantId: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
}

export interface Order {
  id: string;
  merchantId: string;
  customerId?: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  createdAt: Date;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  modifiers?: string[];
}

// --- Startup Types ---
export interface Startup {
  id: string;
  tenantId: string;
  name: string;
  stage: StartupStage;
  mrr: number;
  runway: number;
  teamSize: number;
}

export type StartupStage = 'idea' | 'mvp' | 'seed' | 'series-a' | 'growth';

export interface Idea {
  id: string;
  startupId: string;
  title: string;
  description: string;
  analysis?: IdeaAnalysis;
  status: 'draft' | 'validated' | 'rejected';
}

export interface IdeaAnalysis {
  swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] };
  score: number;
  aiSummary: string;
}

// --- Agent Types ---
export interface Agent {
  id: string;
  name: string;
  soul: AgentSoul;
  identity: AgentIdentity;
  skills: string[];
}

export interface AgentSoul {
  tone: string;
  style: string;
  boundaries: string[];
}

export interface AgentIdentity {
  creature: string;
  vibe: string;
  emoji: string;
  avatar?: string;
}

export interface AgentMemory {
  id: string;
  agentId: string;
  type: 'daily' | 'longterm';
  content: string;
  date: string;
}

// --- AI Types ---
export interface AIRequest {
  model: 'gemini-pro' | 'gemini-flash' | 'veo';
  prompt: string;
  context?: string;
  tools?: string[];
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  toolCalls?: ToolCall[];
  usage: { inputTokens: number; outputTokens: number };
  cached: boolean;
}

export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
  result?: unknown;
}

// --- MCP Types ---
export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (args: Record<string, unknown>) => Promise<unknown>;
}

// --- API Types ---
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIError;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
