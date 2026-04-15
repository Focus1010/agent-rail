import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useStore } from "@/hooks/useStore";
import { topUp } from "@/lib/store";
import {
  Wallet,
  Plus,
  TrendingUp,
  Bot,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Download,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function TopUpModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const presets = [25, 50, 100, 250, 500];

  const handleTopUp = () => {
    const val = parseFloat(amount);
    if (val > 0) {
      topUp(val);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111] border border-[#222] rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">Top up wallet</h3>
          <button onClick={onClose} className="text-[#666] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <label className="text-sm text-[#888] mb-2 block">Amount (USDC)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-4 py-3 text-lg font-mono text-white placeholder:text-[#555] focus:outline-none focus:border-[#444]"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setAmount(p.toString())}
              className="px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded-lg text-sm hover:bg-[#222] transition-colors font-mono"
            >
              ${p}
            </button>
          ))}
        </div>

        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4 mb-6">
          <div className="text-xs text-[#666] mb-1">Simulated on-ramp</div>
          <div className="text-sm text-[#888]">
            In production, this connects to Circle or MoonPay for real USDC
            deposits. For this demo, funds are added instantly.
          </div>
        </div>

        <button
          onClick={handleTopUp}
          disabled={!amount || parseFloat(amount) <= 0}
          className="w-full bg-white text-black font-medium py-3 rounded-lg text-sm hover:bg-[#e0e0e0] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Add Funds
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { wallet, agents, transactions } = useStore();
  const [showTopUp, setShowTopUp] = useState(false);

  const chartData = dayLabels.map((day, i) => ({
    day,
    ...Object.fromEntries(agents.map((a) => [a.name, a.dailySpend[i] || 0])),
  }));

  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => a.status === "active").length;
  const totalRequests = agents.reduce((sum, a) => sum + a.requestCount, 0);
  const recentTx = transactions.slice(0, 8);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const exportCsv = () => {
    const header = "ID,Agent,Amount,Endpoint,Status,Timestamp\n";
    const rows = transactions
      .map(
        (t) =>
          `${t.id},${t.agentName},${t.amount},${t.endpoint},${t.status},${t.timestamp}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "agentrail-receipts.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      {showTopUp && <TopUpModal onClose={() => setShowTopUp(false)} />}

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-[#888] text-sm">Overview of your agent payment activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#888]">USDC Balance</span>
            <Wallet className="w-4 h-4 text-[#555]" />
          </div>
          <div className="text-2xl font-bold font-mono mb-3">
            ${wallet.balance.toFixed(2)}
          </div>
          <button
            onClick={() => setShowTopUp(true)}
            className="w-full bg-white text-black text-xs font-medium py-2 rounded-lg hover:bg-[#e0e0e0] transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3 h-3" /> Top Up
          </button>
        </div>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#888]">Monthly Spent</span>
            <TrendingUp className="w-4 h-4 text-[#555]" />
          </div>
          <div className="text-2xl font-bold font-mono">
            ${wallet.monthlySpent.toFixed(2)}
          </div>
          <div className="text-xs text-[#666] mt-1">
            of ${wallet.monthlyCap} cap
          </div>
          <div className="w-full h-1.5 bg-[#222] rounded-full mt-2">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{
                width: `${Math.min(100, (wallet.monthlySpent / wallet.monthlyCap) * 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#888]">Active Agents</span>
            <Bot className="w-4 h-4 text-[#555]" />
          </div>
          <div className="text-2xl font-bold font-mono">{activeAgents}</div>
          <div className="text-xs text-[#666] mt-1">of {totalAgents} total</div>
        </div>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#888]">Total Requests</span>
            <Activity className="w-4 h-4 text-[#555]" />
          </div>
          <div className="text-2xl font-bold font-mono">
            {totalRequests.toLocaleString()}
          </div>
          <div className="text-xs text-[#666] mt-1">all time</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-3 bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">Spend by Agent (7 days)</h2>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="day" tick={{ fill: "#666", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#666", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{
                  background: "#111",
                  border: "1px solid #222",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#888" }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, undefined]}
              />
              <Bar dataKey="ResearchSwarm" fill="#ffffff" radius={[2, 2, 0, 0]} />
              <Bar dataKey="DataFetcher" fill="#666666" radius={[2, 2, 0, 0]} />
              <Bar dataKey="CodeAnalyzer" fill="#333333" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
          <h2 className="font-semibold text-sm mb-4">Agents</h2>
          <div className="space-y-3">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg border border-[#1a1a1a]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      agent.status === "active" ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  />
                  <div>
                    <div className="text-sm font-medium">{agent.name}</div>
                    <div className="text-xs text-[#666]">
                      {agent.requestCount} requests
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono">
                    ${agent.totalSpent.toFixed(2)}
                  </div>
                  <div className="text-xs text-[#666]">
                    / ${agent.spendLimit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm">Recent Transactions</h2>
          <button
            onClick={exportCsv}
            className="text-xs text-[#888] hover:text-white transition-colors flex items-center gap-1.5 border border-[#222] px-3 py-1.5 rounded-lg hover:bg-[#1a1a1a]"
          >
            <Download className="w-3 h-3" /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="text-left py-2 px-3 text-xs text-[#666] font-medium">Agent</th>
                <th className="text-left py-2 px-3 text-xs text-[#666] font-medium">Endpoint</th>
                <th className="text-right py-2 px-3 text-xs text-[#666] font-medium">Amount</th>
                <th className="text-left py-2 px-3 text-xs text-[#666] font-medium">Status</th>
                <th className="text-right py-2 px-3 text-xs text-[#666] font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentTx.map((tx) => (
                <tr key={tx.id} className="border-b border-[#0a0a0a] hover:bg-[#0a0a0a] transition-colors">
                  <td className="py-3 px-3 font-medium">{tx.agentName}</td>
                  <td className="py-3 px-3 text-[#888] font-mono text-xs truncate max-w-[200px]">
                    {tx.endpoint}
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    <span className="flex items-center justify-end gap-1">
                      {tx.status === "success" ? (
                        <ArrowUpRight className="w-3 h-3 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-red-500" />
                      )}
                      ${tx.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        tx.status === "success"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-xs text-[#666]">
                    {formatTime(tx.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
