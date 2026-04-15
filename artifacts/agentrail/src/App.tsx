import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useStore } from "@/hooks/useStore";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Agents from "@/pages/Agents";
import Policies from "@/pages/Policies";
import Analytics from "@/pages/Analytics";
import Demo from "@/pages/Demo";
import Docs from "@/pages/Docs";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useStore();
  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/agents">
        <ProtectedRoute component={Agents} />
      </Route>
      <Route path="/policies">
        <ProtectedRoute component={Policies} />
      </Route>
      <Route path="/analytics">
        <ProtectedRoute component={Analytics} />
      </Route>
      <Route path="/demo">
        <ProtectedRoute component={Demo} />
      </Route>
      <Route path="/docs">
        <ProtectedRoute component={Docs} />
      </Route>
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="dark">
            <Router />
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
