import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Book, Terminal, Shield, Zap, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1a1a1a]">
        <span className="text-xs text-[#555]">{lang}</span>
        <button
          onClick={copy}
          className="text-xs text-[#555] hover:text-white flex items-center gap-1"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-400" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-sm font-mono text-[#ccc] overflow-x-auto whitespace-pre">
        {code}
      </pre>
    </div>
  );
}

export default function Docs() {
  const sections = [
    {
      id: "quickstart",
      icon: Zap,
      title: "Quick Start",
      content: (
        <>
          <p className="text-[#999] leading-relaxed mb-4">
            Get your agents paying autonomously in under 5 minutes. AgentRail
            provides a drop-in fetch replacement that transparently handles x402
            payment responses.
          </p>
          <h4 className="font-medium mb-2">1. Install the SDK</h4>
          <CodeBlock code="npm install @agentrail/fetch" lang="bash" />
          <h4 className="font-medium mb-2 mt-6">2. Configure your agent</h4>
          <CodeBlock
            code={`import { agentFetch } from "@agentrail/fetch";

const fetch = agentFetch.configure({
  agentId: "your-agent-id",
  walletId: "wlt_your_wallet_id",
  apiKey: "ar_live_..."
});`}
            lang="typescript"
          />
          <h4 className="font-medium mb-2 mt-6">3. Use it like normal fetch</h4>
          <CodeBlock
            code={`// Your agent code doesn't change at all
const response = await fetch("https://api.example.com/data");
const data = await response.json();

// If the API returns 402, AgentRail:
// 1. Catches the 402 response
// 2. Calls your managed wallet to sign payment
// 3. Checks your policy engine (spend limits, caps)
// 4. Retries with X-PAYMENT header
// 5. Returns the successful response to your agent`}
            lang="typescript"
          />
        </>
      ),
    },
    {
      id: "api",
      icon: Terminal,
      title: "API Reference",
      content: (
        <>
          <p className="text-[#999] leading-relaxed mb-4">
            AgentRail exposes a simple REST API for wallet management and payment operations.
          </p>

          <div className="space-y-4">
            {[
              {
                method: "GET",
                path: "/api/wallet/balance",
                desc: "Returns current USDC balance and wallet address",
              },
              {
                method: "POST",
                path: "/api/wallet/topup",
                desc: "Add funds to the managed wallet (simulated on-ramp)",
              },
              {
                method: "POST",
                path: "/api/pay",
                desc: "Sign and submit an x402 payment from the managed wallet",
              },
              {
                method: "GET",
                path: "/api/wallet/transactions",
                desc: "List recent payment transactions with filtering",
              },
              {
                method: "PUT",
                path: "/api/wallet/policy",
                desc: "Update monthly cap or per-agent spend limits",
              },
            ].map((endpoint) => (
              <div
                key={endpoint.path}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4"
              >
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      endpoint.method === "GET"
                        ? "bg-green-500/10 text-green-400"
                        : endpoint.method === "POST"
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-mono">{endpoint.path}</code>
                </div>
                <p className="text-xs text-[#666] mt-1">{endpoint.desc}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "policies",
      icon: Shield,
      title: "Policy Engine",
      content: (
        <>
          <p className="text-[#999] leading-relaxed mb-4">
            The policy engine runs before every payment. It enforces your configured rules to prevent
            overspending and unauthorized payments.
          </p>

          <div className="space-y-3">
            {[
              {
                rule: "Monthly Cap",
                desc: "Set a maximum total spend across all agents per billing cycle. Payments exceeding this cap are automatically rejected.",
              },
              {
                rule: "Per-Agent Limits",
                desc: "Each agent has its own spend limit. An agent exceeding its limit gets a policy rejection, preventing runaway costs.",
              },
              {
                rule: "Balance Check",
                desc: "Payments are only authorized when the wallet has sufficient USDC balance. No overdrafts, no debt.",
              },
              {
                rule: "Agent Status",
                desc: "Paused agents cannot make payments. Use this to temporarily disable an agent without removing it.",
              },
            ].map((policy) => (
              <div
                key={policy.rule}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4"
              >
                <h4 className="font-medium text-sm mb-1">{policy.rule}</h4>
                <p className="text-xs text-[#666]">{policy.desc}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "architecture",
      icon: Book,
      title: "Architecture",
      content: (
        <>
          <p className="text-[#999] leading-relaxed mb-4">
            AgentRail sits between your AI agents and the APIs they consume.
            It's designed to be invisible to the agent while giving you full
            control over spending.
          </p>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6 font-mono text-xs text-[#888]">
            <pre className="whitespace-pre leading-loose">{`
  Your Agent            AgentRail               API Provider
  ----------           -----------             -------------
      |                     |                       |
      |--- fetch(url) ----->|                       |
      |                     |--- GET url ---------->|
      |                     |<-- 402 Payment -------|
      |                     |                       |
      |                     |-- Check Policy --|    |
      |                     |<- Approved ------|    |
      |                     |                       |
      |                     |-- Sign Payment --|    |
      |                     |<- x402 Header ---|    |
      |                     |                       |
      |                     |--- GET url + x402 --->|
      |                     |<-- 200 OK ------------|
      |<-- response --------|                       |
      |                     |                       |
            `}</pre>
          </div>

          <div className="mt-6 space-y-3">
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4">
              <h4 className="font-medium text-sm mb-1">Managed Wallets (Privy)</h4>
              <p className="text-xs text-[#666]">
                Server-side wallets using Privy's infrastructure. Private keys never leave the
                secure enclave. Your agents never have access to signing keys.
              </p>
            </div>
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4">
              <h4 className="font-medium text-sm mb-1">x402 Protocol</h4>
              <p className="text-xs text-[#666]">
                Based on HTTP 402 Payment Required. APIs return a 402 with payment details,
                and AgentRail automatically constructs and signs the payment response.
              </p>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Documentation</h1>
        <p className="text-[#888] text-sm">
          Everything you need to integrate AgentRail
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <div
            key={section.id}
            id={section.id}
            className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
                <section.icon className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-semibold">{section.title}</h2>
            </div>
            {section.content}
          </div>
        ))}
      </div>

      <div className="mt-8 bg-[#111] border border-[#1a1a1a] rounded-xl p-6 text-center">
        <p className="text-[#888] text-sm mb-3">Need help? Have questions?</p>
        <a
          href="mailto:hello@agentrail.com"
          className="text-white text-sm hover:underline inline-flex items-center gap-1"
        >
          hello@agentrail.com <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </DashboardLayout>
  );
}
