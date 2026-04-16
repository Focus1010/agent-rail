import { useState } from "react";
import { useLocation } from "wouter";
import { Zap, ArrowRight, Shield, Bot, CreditCard, Code, ChevronRight } from "lucide-react";
import { login } from "@/lib/store";
import { useStore } from "@/hooks/useStore";

export default function Landing() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useStore();
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || "demo@agentrail.com", name || "Demo User");
    navigate("/dashboard");
  };

  if (showAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 justify-center">
            <img src="https://res.cloudinary.com/dw3tqpt60/image/upload/v1776379341/favicon_byrhrp.svg" alt="AgentRail" className="w-10 h-10" />
            <span className="text-2xl font-bold tracking-tight">AgentRail</span>
          </div>

          <div className="bg-[#111] border border-[#222] rounded-xl p-8">
            <h2 className="text-xl font-semibold mb-1 text-center">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-[#888] text-sm text-center mb-6">
              {isLogin
                ? "Sign in to manage your agents"
                : "Start building with autonomous payments"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-sm text-[#aaa] block mb-1.5">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#444] transition-colors"
                  />
                </div>
              )}
              <div>
                <label className="text-sm text-[#aaa] block mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#444] transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-[#aaa] block mb-1.5">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#444] transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-white text-black font-medium py-2.5 rounded-lg text-sm hover:bg-[#e0e0e0] transition-colors"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-[#888] hover:text-white transition-colors"
              >
                {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowAuth(false)}
            className="mt-4 w-full text-center text-sm text-[#555] hover:text-white transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-[#111] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="https://res.cloudinary.com/dw3tqpt60/image/upload/v1776379341/favicon_byrhrp.svg" alt="AgentRail" className="w-8 h-8" />
            <span className="text-lg font-bold tracking-tight">AgentRail</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsLogin(true);
                setShowAuth(true);
              }}
              className="text-sm text-[#999] hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setShowAuth(true);
              }}
              className="text-sm bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-[#e0e0e0] transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs bg-[#111] border border-[#222] rounded-full px-4 py-1.5 mb-8 text-[#aaa]">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            x402 Protocol Compatible
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Agents pay autonomously.
            <br />
            <span className="text-[#666]">You never touch keys.</span>
          </h1>
          <p className="text-lg text-[#888] max-w-2xl mx-auto mb-10 leading-relaxed">
            AgentRail is the transparent payment rail for AI agents. Managed wallets, automatic
            x402 payment handling, and full spend control — all without exposing private keys.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                setIsLogin(false);
                setShowAuth(true);
              }}
              className="bg-white text-black px-6 py-3 rounded-lg font-medium text-sm hover:bg-[#e0e0e0] transition-colors flex items-center gap-2"
            >
              Start Building <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsLogin(true);
                setShowAuth(true);
              }}
              className="border border-[#333] text-white px-6 py-3 rounded-lg text-sm hover:bg-[#111] transition-colors flex items-center gap-2"
            >
              <Code className="w-4 h-4" /> View Demo
            </button>
          </div>
        </div>
      </section>

      <section className="py-4 px-6 border-t border-[#111]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 font-mono text-sm">
            <div className="flex items-center gap-2 text-[#555] mb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#333]" />
                <div className="w-3 h-3 rounded-full bg-[#333]" />
                <div className="w-3 h-3 rounded-full bg-[#333]" />
              </div>
              <span className="ml-2">npm install @agentrail/fetch</span>
            </div>
            <code className="text-[#ccc] text-xs lg:text-sm leading-relaxed block whitespace-pre-wrap break-words">{`import { agentFetch } from "@agentrail/fetch";

// Your agent's fetch calls work exactly the same.
// AgentRail intercepts 402 responses and pays automatically.
const response = await agentFetch("https://api.example.com/data", {
  agentId: "research-swarm",
  walletId: "wlt_abc123"
});

// That's it. No payment logic in your agent code.`}</code>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: CreditCard,
                title: "Managed Wallets",
                desc: "Server-side wallets powered by Privy. No private keys exposed to your agents. Fund with USDC and set limits.",
              },
              {
                icon: Shield,
                title: "Policy Engine",
                desc: "Monthly caps, per-agent spend limits, endpoint allowlists. Full control over what your agents can spend.",
              },
              {
                icon: Bot,
                title: "Transparent Interceptor",
                desc: "Drop-in fetch replacement. Catches 402 responses, pays from the managed wallet, and retries — all invisible to your agent.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 hover:border-[#333] transition-colors"
              >
                <div className="w-10 h-10 bg-[#111] border border-[#222] rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-[#888] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-[#111]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-12 text-center">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: "01", title: "Fund Wallet", desc: "Add USDC to your managed wallet via our on-ramp" },
              { step: "02", title: "Set Policies", desc: "Configure spend caps per agent and monthly limits" },
              { step: "03", title: "Integrate SDK", desc: "Swap fetch() for agentFetch() — one line change" },
              { step: "04", title: "Agents Pay", desc: "x402 payments happen transparently on every 402" },
            ].map((item, i) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="text-xs font-mono text-[#555] mb-2">{item.step}</div>
                  <div className="w-2 h-2 rounded-full bg-white" />
                  {i < 3 && <div className="w-px h-full bg-[#222] hidden md:block" />}
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-[#888]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-[#111]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to build?</h2>
          <p className="text-[#888] mb-8">
            Get your agents paying autonomously in under 5 minutes.
          </p>
          <button
            onClick={() => {
              setIsLogin(false);
              setShowAuth(true);
            }}
            className="bg-white text-black px-8 py-3 rounded-lg font-medium text-sm hover:bg-[#e0e0e0] transition-colors inline-flex items-center gap-2"
          >
            Create Account <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <footer className="border-t border-[#111] py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-[#555]">
          <div className="flex items-center gap-2">
            <img src="https://res.cloudinary.com/dw3tqpt60/image/upload/v1776379341/favicon_byrhrp.svg" className="w-6 h-6" />
            AgentRail
          </div>
          <div>© 2026 AgentRail. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
