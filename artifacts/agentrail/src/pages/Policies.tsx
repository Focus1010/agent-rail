import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useStore } from "@/hooks/useStore";
import { setMonthlyCap, setAgentSpendLimit } from "@/lib/store";
import { Shield, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function Policies() {
  const { wallet, agents } = useStore();
  const [capValue, setCapValue] = useState(wallet.monthlyCap);

  return (
    <DashboardLayout>
      <div className="mb-6 lg:mb-8">
        <h1 className="text-xl lg:text-2xl font-bold mb-1">Policies</h1>
        <p className="text-[#888] text-xs lg:text-sm">Configure spending limits and safety controls</p>
      </div>

      <div className="space-y-4 lg:space-y-6">
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 lg:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold">Global Monthly Cap</h2>
              <p className="text-xs text-[#666]">
                Maximum total spend across all agents per month
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-[#888]">Monthly cap</span>
              <span className="font-mono font-semibold">${capValue}</span>
            </div>
            <input
              type="range"
              min={50}
              max={2000}
              step={50}
              value={capValue}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                setCapValue(v);
                setMonthlyCap(v);
              }}
              className="w-full h-2 bg-[#222] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-xs text-[#555] mt-1">
              <span>$50</span>
              <span>$2,000</span>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#888]">Current monthly usage</span>
              <span className="text-sm font-mono">
                ${wallet.monthlySpent.toFixed(2)} / ${wallet.monthlyCap}
              </span>
            </div>
            <div className="w-full h-2 bg-[#222] rounded-full">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (wallet.monthlySpent / wallet.monthlyCap) * 100)}%`,
                }}
              />
            </div>
            {wallet.monthlySpent / wallet.monthlyCap > 0.8 && (
              <div className="flex items-center gap-2 mt-3 text-xs text-yellow-400">
                <AlertTriangle className="w-3 h-3" />
                Approaching monthly cap
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 lg:p-6">
          <h2 className="font-semibold text-sm lg:text-base mb-1">Per-Agent Spend Limits</h2>
          <p className="text-[10px] lg:text-xs text-[#666] mb-4 lg:mb-6">
            Set individual spending caps for each agent
          </p>

          <div className="space-y-3 lg:space-y-4">
            {agents.map((agent) => {
              const percent = (agent.totalSpent / agent.spendLimit) * 100;
              return (
                <div
                  key={agent.id}
                  className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3 lg:p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          agent.status === "active" ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      />
                      <span className="font-medium text-sm">{agent.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={agent.spendLimit}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          if (v > 0) setAgentSpendLimit(agent.id, v);
                        }}
                        className="w-24 bg-black border border-[#222] rounded px-2 py-1 text-sm font-mono text-right focus:outline-none focus:border-[#444]"
                      />
                      <span className="text-xs text-[#666]">USDC</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#666] mb-1">
                    <span>
                      ${agent.totalSpent.toFixed(2)} spent
                    </span>
                    <span>{percent.toFixed(1)}% used</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#222] rounded-full">
                    <div
                      className={`h-full rounded-full transition-all ${
                        percent > 80 ? "bg-red-500" : "bg-white"
                      }`}
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
          <h2 className="font-semibold mb-1">Policy Rules</h2>
          <p className="text-xs text-[#666] mb-4">
            Automatic enforcement for all agent payments
          </p>

          <div className="space-y-3">
            {[
              {
                label: "Reject payments exceeding agent limit",
                enabled: true,
              },
              {
                label: "Reject payments exceeding monthly cap",
                enabled: true,
              },
              {
                label: "Reject payments when wallet balance is insufficient",
                enabled: true,
              },
              {
                label: "Reject payments from paused agents",
                enabled: true,
              },
              {
                label: "Alert on spend > 80% of agent limit",
                enabled: true,
              },
            ].map((rule) => (
              <div
                key={rule.label}
                className="flex items-center justify-between py-2 px-3 bg-[#0a0a0a] rounded-lg border border-[#1a1a1a]"
              >
                <span className="text-sm">{rule.label}</span>
                <div
                  className={`w-8 h-4 rounded-full relative cursor-pointer ${
                    rule.enabled ? "bg-white" : "bg-[#333]"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${
                      rule.enabled
                        ? "right-0.5 bg-black"
                        : "left-0.5 bg-[#666]"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
