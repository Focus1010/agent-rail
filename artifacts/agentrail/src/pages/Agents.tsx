import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useStore } from "@/hooks/useStore";
import { toggleAgentStatus, setAgentSpendLimit } from "@/lib/store";
import { Bot, Pause, Play, Settings } from "lucide-react";
import { useState } from "react";
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

export default function Agents() {
  const { agents } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLimit, setEditLimit] = useState("");

  const saveLimit = (agentId: string) => {
    const val = parseFloat(editLimit);
    if (val > 0) {
      setAgentSpendLimit(agentId, val);
    }
    setEditingId(null);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Agents</h1>
        <p className="text-[#888] text-sm">Manage your AI agents and their spend limits</p>
      </div>

      <div className="space-y-6">
        {agents.map((agent) => {
          const chartData = dayLabels.map((day, i) => ({
            day,
            spend: agent.dailySpend[i] || 0,
          }));
          const spendPercent = (agent.totalSpent / agent.spendLimit) * 100;

          return (
            <div
              key={agent.id}
              className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{agent.name}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            agent.status === "active"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-yellow-500/10 text-yellow-400"
                          }`}
                        >
                          {agent.status}
                        </span>
                      </div>
                      <div className="text-xs text-[#666] mt-0.5">
                        Last active: {new Date(agent.lastActive).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAgentStatus(agent.id)}
                      className="flex items-center gap-2 px-3 py-2 text-xs border border-[#222] rounded-lg hover:bg-[#1a1a1a] transition-colors"
                    >
                      {agent.status === "active" ? (
                        <>
                          <Pause className="w-3 h-3" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" /> Resume
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(agent.id);
                        setEditLimit(agent.spendLimit.toString());
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-xs border border-[#222] rounded-lg hover:bg-[#1a1a1a] transition-colors"
                    >
                      <Settings className="w-3 h-3" /> Edit Limit
                    </button>
                  </div>
                </div>

                {editingId === agent.id && (
                  <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4 mb-4">
                    <label className="text-xs text-[#888] mb-2 block">
                      Spend Limit (USDC)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={editLimit}
                        onChange={(e) => setEditLimit(e.target.value)}
                        className="flex-1 bg-black border border-[#222] rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#444]"
                      />
                      <button
                        onClick={() => saveLimit(agent.id)}
                        className="px-4 py-2 bg-white text-black text-xs font-medium rounded-lg hover:bg-[#e0e0e0]"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 border border-[#222] text-xs rounded-lg hover:bg-[#1a1a1a]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div>
                    <div className="text-xs text-[#666] mb-1">Total Spent</div>
                    <div className="font-mono font-semibold">
                      ${agent.totalSpent.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#666] mb-1">Spend Limit</div>
                    <div className="font-mono font-semibold">
                      ${agent.spendLimit.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#666] mb-1">Requests</div>
                    <div className="font-mono font-semibold">
                      {agent.requestCount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#666] mb-1">Utilization</div>
                    <div className="font-mono font-semibold">
                      {spendPercent.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs text-[#666] mb-1">
                    <span>Budget utilization</span>
                    <span>
                      ${agent.totalSpent.toFixed(2)} / ${agent.spendLimit.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#222] rounded-full">
                    <div
                      className={`h-full rounded-full transition-all ${
                        spendPercent > 80 ? "bg-red-500" : "bg-white"
                      }`}
                      style={{ width: `${Math.min(100, spendPercent)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-[#1a1a1a] p-6">
                <div className="text-xs text-[#666] mb-3">Daily spend (last 7 days)</div>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: "#666", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#666", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#111",
                        border: "1px solid #222",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, "Spend"]}
                    />
                    <Bar dataKey="spend" fill="#ffffff" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
