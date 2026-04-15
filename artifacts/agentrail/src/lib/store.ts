export interface Agent {
  id: string;
  name: string;
  status: "active" | "paused" | "disabled";
  spendLimit: number;
  totalSpent: number;
  requestCount: number;
  lastActive: string;
  dailySpend: number[];
}

export interface Transaction {
  id: string;
  agentId: string;
  agentName: string;
  amount: number;
  endpoint: string;
  status: "success" | "failed" | "pending";
  timestamp: string;
  paymentHeader: string;
}

export interface WalletState {
  balance: number;
  walletAddress: string;
  monthlyCap: number;
  monthlySpent: number;
}

export interface AppState {
  isAuthenticated: boolean;
  user: { email: string; name: string } | null;
  wallet: WalletState;
  agents: Agent[];
  transactions: Transaction[];
}

const now = new Date();
const formatDate = (daysAgo: number, hoursAgo = 0): string => {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
};

const initialAgents: Agent[] = [
  {
    id: "agent-1",
    name: "ResearchSwarm",
    status: "active",
    spendLimit: 200,
    totalSpent: 147.32,
    requestCount: 1243,
    lastActive: formatDate(0, 1),
    dailySpend: [12.5, 18.3, 22.1, 15.7, 28.4, 19.8, 30.52],
  },
  {
    id: "agent-2",
    name: "DataFetcher",
    status: "active",
    spendLimit: 100,
    totalSpent: 63.18,
    requestCount: 892,
    lastActive: formatDate(0, 3),
    dailySpend: [8.2, 11.4, 9.8, 7.3, 10.1, 8.9, 7.48],
  },
  {
    id: "agent-3",
    name: "CodeAnalyzer",
    status: "paused",
    spendLimit: 150,
    totalSpent: 89.45,
    requestCount: 567,
    lastActive: formatDate(1, 5),
    dailySpend: [15.3, 12.8, 18.2, 14.1, 11.9, 16.7, 0],
  },
];

const initialTransactions: Transaction[] = [
  {
    id: "tx-1",
    agentId: "agent-1",
    agentName: "ResearchSwarm",
    amount: 0.05,
    endpoint: "api.openai.com/v1/chat/completions",
    status: "success",
    timestamp: formatDate(0, 0),
    paymentHeader: "x402-payment: sat_v1_abc123...",
  },
  {
    id: "tx-2",
    agentId: "agent-2",
    agentName: "DataFetcher",
    amount: 0.02,
    endpoint: "api.serper.dev/search",
    status: "success",
    timestamp: formatDate(0, 1),
    paymentHeader: "x402-payment: sat_v1_def456...",
  },
  {
    id: "tx-3",
    agentId: "agent-1",
    agentName: "ResearchSwarm",
    amount: 0.10,
    endpoint: "api.anthropic.com/v1/messages",
    status: "success",
    timestamp: formatDate(0, 2),
    paymentHeader: "x402-payment: sat_v1_ghi789...",
  },
  {
    id: "tx-4",
    agentId: "agent-3",
    agentName: "CodeAnalyzer",
    amount: 0.03,
    endpoint: "api.github.com/repos/analyze",
    status: "failed",
    timestamp: formatDate(0, 4),
    paymentHeader: "x402-payment: REJECTED_POLICY",
  },
  {
    id: "tx-5",
    agentId: "agent-1",
    agentName: "ResearchSwarm",
    amount: 0.08,
    endpoint: "api.pinecone.io/query",
    status: "success",
    timestamp: formatDate(0, 5),
    paymentHeader: "x402-payment: sat_v1_jkl012...",
  },
  {
    id: "tx-6",
    agentId: "agent-2",
    agentName: "DataFetcher",
    amount: 0.01,
    endpoint: "api.weatherapi.com/v1/current",
    status: "success",
    timestamp: formatDate(0, 8),
    paymentHeader: "x402-payment: sat_v1_mno345...",
  },
  {
    id: "tx-7",
    agentId: "agent-1",
    agentName: "ResearchSwarm",
    amount: 0.15,
    endpoint: "api.openai.com/v1/embeddings",
    status: "success",
    timestamp: formatDate(1, 2),
    paymentHeader: "x402-payment: sat_v1_pqr678...",
  },
  {
    id: "tx-8",
    agentId: "agent-3",
    agentName: "CodeAnalyzer",
    amount: 0.04,
    endpoint: "api.snyk.io/v1/test",
    status: "success",
    timestamp: formatDate(1, 6),
    paymentHeader: "x402-payment: sat_v1_stu901...",
  },
];

const STORAGE_KEY = "agentrail_state";

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return {
    isAuthenticated: false,
    user: null,
    wallet: {
      balance: 250.0,
      walletAddress: "0x7a3b...f9e2",
      monthlyCap: 500,
      monthlySpent: 299.95,
    },
    agents: initialAgents,
    transactions: initialTransactions,
  };
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

let state = loadState();
const listeners = new Set<() => void>();

export function getState(): AppState {
  return state;
}

function setState(newState: AppState) {
  state = newState;
  saveState(state);
  listeners.forEach((fn) => fn());
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function login(email: string, name: string) {
  setState({
    ...state,
    isAuthenticated: true,
    user: { email, name },
  });
}

export function logout() {
  setState({
    ...state,
    isAuthenticated: false,
    user: null,
  });
}

export function topUp(amount: number) {
  setState({
    ...state,
    wallet: {
      ...state.wallet,
      balance: Math.round((state.wallet.balance + amount) * 100) / 100,
    },
  });
}

export function setMonthlyCap(cap: number) {
  setState({
    ...state,
    wallet: { ...state.wallet, monthlyCap: cap },
  });
}

export function setAgentSpendLimit(agentId: string, limit: number) {
  setState({
    ...state,
    agents: state.agents.map((a) =>
      a.id === agentId ? { ...a, spendLimit: limit } : a
    ),
  });
}

export function toggleAgentStatus(agentId: string) {
  setState({
    ...state,
    agents: state.agents.map((a) =>
      a.id === agentId
        ? { ...a, status: a.status === "active" ? "paused" : "active" }
        : a
    ),
  });
}

export function simulatePayment(agentId: string, amount: number, endpoint: string): Transaction {
  const agent = state.agents.find((a) => a.id === agentId);
  if (!agent) throw new Error("Agent not found");

  const withinAgentLimit = agent.totalSpent + amount <= agent.spendLimit;
  const withinMonthlyCap = state.wallet.monthlySpent + amount <= state.wallet.monthlyCap;
  const hasBalance = state.wallet.balance >= amount;
  const isSuccess = withinAgentLimit && withinMonthlyCap && hasBalance && agent.status === "active";

  const tx: Transaction = {
    id: `tx-${Date.now()}`,
    agentId,
    agentName: agent.name,
    amount,
    endpoint,
    status: isSuccess ? "success" : "failed",
    timestamp: new Date().toISOString(),
    paymentHeader: isSuccess
      ? `x402-payment: sat_v1_${Math.random().toString(36).slice(2, 14)}`
      : "x402-payment: REJECTED_POLICY",
  };

  const newBalance = isSuccess ? Math.round((state.wallet.balance - amount) * 100) / 100 : state.wallet.balance;
  const newMonthlySpent = isSuccess ? Math.round((state.wallet.monthlySpent + amount) * 100) / 100 : state.wallet.monthlySpent;

  setState({
    ...state,
    wallet: { ...state.wallet, balance: newBalance, monthlySpent: newMonthlySpent },
    agents: state.agents.map((a) =>
      a.id === agentId && isSuccess
        ? { ...a, totalSpent: Math.round((a.totalSpent + amount) * 100) / 100, requestCount: a.requestCount + 1 }
        : a
    ),
    transactions: [tx, ...state.transactions],
  });

  return tx;
}
