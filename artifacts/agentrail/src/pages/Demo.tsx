import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useStore } from "@/hooks/useStore";
import { simulatePayment } from "@/lib/store";
import {
  Zap,
  Play,
  Check,
  X,
  AlertTriangle,
  Download,
  Copy,
  ChevronRight,
} from "lucide-react";

interface LogEntry {
  type: "info" | "warn" | "success" | "error" | "payment";
  message: string;
  timestamp: string;
}

const codeSnippet = `import { agentFetch } from "@agentrail/fetch";

// LangChain-style agent using AgentRail's transparent fetch
const agent = new ResearchAgent({
  fetch: agentFetch.configure({
    agentId: "research-swarm",
    walletId: "wlt_abc123",
  }),
});

// The agent calls APIs normally. When a 402 is returned,
// AgentRail intercepts, pays, and retries — transparently.
const result = await agent.invoke({
  task: "Research the latest x402 protocol developments",
  tools: [
    webSearch,      // may return 402
    vectorQuery,    // may return 402
    llmComplete,    // may return 402
  ],
});`;

const fetchWrapperCode = `// @agentrail/fetch - Transparent x402 Payment Interceptor
// npm install @agentrail/fetch

export function agentFetch(url, options = {}) {
  const { agentId, walletId, ...fetchOptions } = options;

  return async function transparentFetch(input, init) {
    // First attempt - normal fetch
    let response = await fetch(input, { ...fetchOptions, ...init });

    // If 402 Payment Required, handle automatically
    if (response.status === 402) {
      const paymentDetails = await response.json();

      // Call AgentRail backend to sign payment
      const paymentResult = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          walletId,
          amount: paymentDetails.amount,
          recipient: paymentDetails.recipient,
          endpoint: input,
        }),
      });

      if (!paymentResult.ok) {
        throw new Error("Payment rejected by policy engine");
      }

      const { paymentHeader } = await paymentResult.json();

      // Retry with payment header
      response = await fetch(input, {
        ...fetchOptions,
        ...init,
        headers: {
          ...init?.headers,
          "X-PAYMENT": paymentHeader,
        },
      });
    }

    return response;
  };
}

export default agentFetch;`;

export default function Demo() {
  const { agents } = useStore();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (type: LogEntry["type"], message: string) => {
    const entry: LogEntry = {
      type,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs((prev) => [...prev, entry]);
  };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const runDemo = async () => {
    setLogs([]);
    setIsRunning(true);

    const agent = agents[0];
    if (!agent) {
      addLog("error", "No agents configured");
      setIsRunning(false);
      return;
    }

    addLog("info", `Agent "${agent.name}" initiating API request...`);
    await sleep(800);

    addLog("info", "GET https://api.premium-data.io/v1/research?topic=x402");
    await sleep(600);

    addLog("warn", "Response: 402 Payment Required");
    await sleep(400);

    addLog(
      "info",
      `Payment details: { amount: "0.05 USDC", recipient: "0x9f8e...3d1a", protocol: "x402" }`
    );
    await sleep(500);

    addLog("payment", "AgentRail interceptor caught 402 response");
    await sleep(300);

    addLog("info", "Checking policy engine...");
    await sleep(400);

    addLog("info", `Agent "${agent.name}" spend: $${agent.totalSpent.toFixed(2)} / $${agent.spendLimit} limit`);
    await sleep(300);

    addLog("success", "Policy check passed - payment authorized");
    await sleep(500);

    addLog("payment", "Signing payment with managed wallet (Privy server-side)...");
    await sleep(700);

    const tx = simulatePayment(agent.id, 0.05, "api.premium-data.io/v1/research");

    if (tx.status === "success") {
      addLog("success", `Payment signed: ${tx.paymentHeader}`);
      await sleep(400);

      addLog("info", "Retrying request with X-PAYMENT header...");
      await sleep(600);

      addLog(
        "info",
        'GET https://api.premium-data.io/v1/research?topic=x402 [X-PAYMENT: sat_v1_...]'
      );
      await sleep(500);

      addLog("success", "Response: 200 OK - Data received successfully");
      await sleep(300);

      addLog(
        "success",
        "Agent received response transparently. No payment code in agent logic."
      );
    } else {
      addLog("error", "Payment rejected by policy engine");
      addLog("error", `Reason: ${tx.paymentHeader}`);
    }

    setIsRunning(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(fetchWrapperCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPackage = () => {
    const blob = new Blob([fetchWrapperCode], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "agentrail-fetch.js";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getLogIcon = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return <Check className="w-3 h-3 text-green-400 shrink-0" />;
      case "error":
        return <X className="w-3 h-3 text-red-400 shrink-0" />;
      case "warn":
        return <AlertTriangle className="w-3 h-3 text-yellow-400 shrink-0" />;
      case "payment":
        return <Zap className="w-3 h-3 text-blue-400 shrink-0" />;
      default:
        return <ChevronRight className="w-3 h-3 text-[#555] shrink-0" />;
    }
  };

  const getLogColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return "text-green-400";
      case "error":
        return "text-red-400";
      case "warn":
        return "text-yellow-400";
      case "payment":
        return "text-blue-400";
      default:
        return "text-[#999]";
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Interceptor Demo</h1>
        <p className="text-[#888] text-sm">
          See how AgentRail transparently handles x402 payments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#333]" />
                <div className="w-3 h-3 rounded-full bg-[#333]" />
                <div className="w-3 h-3 rounded-full bg-[#333]" />
              </div>
              <span className="text-xs text-[#666] ml-2">agent.ts</span>
            </div>
          </div>
          <div className="p-3 lg:p-4 overflow-x-auto">
            <pre className="text-xs lg:text-sm font-mono text-[#ccc] leading-relaxed whitespace-pre-wrap break-words">
              {codeSnippet}
            </pre>
          </div>
        </div>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
            <span className="text-xs text-[#666]">Execution Log</span>
            <button
              onClick={runDemo}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-1.5 bg-white text-black text-xs font-medium rounded-lg hover:bg-[#e0e0e0] transition-colors disabled:opacity-50"
            >
              <Play className="w-3 h-3" />
              {isRunning ? "Running..." : "Run Agent Request"}
            </button>
          </div>
          <div className="flex-1 p-4 min-h-[300px] max-h-[400px] overflow-y-auto font-mono text-xs">
            {logs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-[#555]">
                Click "Run Agent Request" to start the demo
              </div>
            ) : (
              <div className="space-y-1.5">
                {logs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[#444] shrink-0 w-16">
                      {log.timestamp}
                    </span>
                    {getLogIcon(log.type)}
                    <span className={getLogColor(log.type)}>{log.message}</span>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">@agentrail/fetch</span>
            <span className="text-xs text-[#555] bg-[#1a1a1a] px-2 py-0.5 rounded">
              v0.1.0
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#222] rounded-lg hover:bg-[#1a1a1a] transition-colors"
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
            <button
              onClick={downloadPackage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white text-black font-medium rounded-lg hover:bg-[#e0e0e0] transition-colors"
            >
              <Download className="w-3 h-3" /> Download Package
            </button>
          </div>
        </div>
        <div className="p-3 lg:p-4 overflow-x-auto max-h-[400px] overflow-y-auto">
          <pre className="text-[10px] lg:text-xs font-mono text-[#aaa] leading-relaxed whitespace-pre-wrap break-words">
            {fetchWrapperCode}
          </pre>
        </div>
      </div>
    </DashboardLayout>
  );
}
