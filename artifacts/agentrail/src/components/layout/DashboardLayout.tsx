import { Sidebar } from "./Sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <div className="p-8 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
