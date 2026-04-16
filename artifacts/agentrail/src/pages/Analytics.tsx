import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useStore } from "@/hooks/useStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Analytics() {
  const { agents, transactions, wallet } = useStore();

  const spendByAgent = agents.map((a) => ({
    name: a.name,
    spent: a.totalSpent,
    limit: a.spendLimit,
  }));

  const dailyTotals = dayLabels.map((day, i) => ({
    day,
    total: agents.reduce((sum, a) => sum + (a.dailySpend[i] || 0), 0),
  }));

  const successCount = transactions.filter((t) => t.status === "success").length;
  const failCount = transactions.filter((t) => t.status === "failed").length;
  const statusData = [
    { name: "Success", value: successCount },
    { name: "Failed", value: failCount },
  ];
  const statusColors = ["#ffffff", "#444444"];

  const endpointMap: Record<string, number> = {};
  transactions.forEach((t) => {
    const domain = t.endpoint.split("/")[0];
    endpointMap[domain] = (endpointMap[domain] || 0) + t.amount;
  });
  const endpointData = Object.entries(endpointMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, amount]) => ({ name, amount: Math.round(amount * 100) / 100 }));

  return (
    <DashboardLayout>
      <div className="mb-6 lg:mb-8">
        <h1 className="text-xl lg:text-2xl font-bold mb-1">Analytics</h1>
        <p className="text-[#888] text-xs lg:text-sm">
          Detailed insights into your agent spend patterns
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-6 lg:mb-8">
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 lg:p-5">
          <div className="text-[10px] lg:text-xs text-[#888] mb-1">Total Volume</div>
          <div className="text-lg lg:text-2xl font-bold font-mono">
            ${agents.reduce((s, a) => s + a.totalSpent, 0).toFixed(2)}
          </div>
        </div>
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 lg:p-5">
          <div className="text-[10px] lg:text-xs text-[#888] mb-1">Success Rate</div>
          <div className="text-lg lg:text-2xl font-bold font-mono">
            {transactions.length > 0
              ? ((successCount / transactions.length) * 100).toFixed(1)
              : 0}
            %
          </div>
        </div>
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 lg:p-5 col-span-2 lg:col-span-1">
          <div className="text-[10px] lg:text-xs text-[#888] mb-1">Avg per Request</div>
          <div className="text-lg lg:text-2xl font-bold font-mono">
            $
            {transactions.length > 0
              ? (
                  transactions.reduce((s, t) => s + t.amount, 0) /
                  transactions.length
                ).toFixed(3)
              : "0.000"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 lg:p-5">
          <h2 className="font-semibold text-xs lg:text-sm mb-3 lg:mb-4">Daily Spend Trend</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={dailyTotals}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis
                dataKey="day"
                tick={{ fill: "#666", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#666", fontSize: 12 }}
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
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Total"]}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#ffffff"
                strokeWidth={2}
                dot={{ fill: "#fff", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
          <h2 className="font-semibold text-sm mb-4">Spend by Agent</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={spendByAgent} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis
                type="number"
                tick={{ fill: "#666", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "#999", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  background: "#111",
                  border: "1px solid #222",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value: number) => [`$${value.toFixed(2)}`]}
              />
              <Bar dataKey="spent" fill="#ffffff" radius={[0, 4, 4, 0]} />
              <Bar dataKey="limit" fill="#222222" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
          <h2 className="font-semibold text-sm mb-4">Payment Status</h2>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={statusColors[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-white" />
                <span className="text-sm">
                  Success: {successCount} ({((successCount / Math.max(1, transactions.length)) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[#444]" />
                <span className="text-sm">
                  Failed: {failCount} ({((failCount / Math.max(1, transactions.length)) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
          <h2 className="font-semibold text-sm mb-4">Top Endpoints by Spend</h2>
          <div className="space-y-3">
            {endpointData.map((ep, i) => (
              <div key={ep.name} className="flex items-center gap-3">
                <span className="text-xs text-[#555] w-4">{i + 1}.</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-mono truncate max-w-[180px]">
                      {ep.name}
                    </span>
                    <span className="text-sm font-mono">${ep.amount.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-1 bg-[#222] rounded-full">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{
                        width: `${(ep.amount / Math.max(...endpointData.map((e) => e.amount))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
