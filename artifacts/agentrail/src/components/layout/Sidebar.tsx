import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  Bot,
  Shield,
  BarChart3,
  FileText,
  Zap,
  LogOut,
  Wallet,
} from "lucide-react";
import { logout } from "@/lib/store";
import { useStore } from "@/hooks/useStore";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/agents", label: "Agents", icon: Bot },
  { path: "/policies", label: "Policies", icon: Shield },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/demo", label: "Interceptor Demo", icon: Zap },
  { path: "/docs", label: "Docs", icon: FileText },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user, wallet } = useStore();

  return (
    <aside className="w-64 h-screen bg-[#050505] border-r border-[#1a1a1a] flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-[#1a1a1a]">
        <Link href="/dashboard">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="text-lg font-bold tracking-tight">AgentRail</span>
          </div>
        </Link>
      </div>

      <div className="p-4 mx-3 mt-4 bg-[#111] rounded-lg border border-[#1a1a1a]">
        <div className="flex items-center gap-2 text-xs text-[#888] mb-1">
          <Wallet className="w-3 h-3" />
          USDC Balance
        </div>
        <div className="text-xl font-bold font-mono">${wallet.balance.toFixed(2)}</div>
      </div>

      <nav className="flex-1 p-3 mt-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 cursor-pointer transition-colors text-sm ${
                  isActive
                    ? "bg-white text-black font-medium"
                    : "text-[#999] hover:text-white hover:bg-[#111]"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1a1a1a]">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <div className="text-white font-medium truncate max-w-[140px]">
              {user?.name || "User"}
            </div>
            <div className="text-[#666] text-xs truncate max-w-[140px]">
              {user?.email || "user@example.com"}
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 text-[#666] hover:text-white transition-colors rounded-lg hover:bg-[#111]"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
