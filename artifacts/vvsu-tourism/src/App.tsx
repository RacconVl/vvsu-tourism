import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import { AuthProvider } from "@/hooks/use-auth";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import Home from "@/pages/home";
import Cabinet from "@/pages/cabinet";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import MapPage from "@/pages/map-page";
import LibraryPage from "@/pages/library";
import Leaderboard from "@/pages/leaderboard";
import PublicProfile from "@/pages/public-profile";
import AdmissionPage from "@/pages/admission";
import NotFound from "@/pages/not-found";

// Initialize JWT token getter from localStorage on app startup
setAuthTokenGetter(() => localStorage.getItem("vvsu_auth_token"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        {/* Public */}
        <Route path="/" component={Home} />
        <Route path="/admission" component={AdmissionPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/map" component={MapPage} />
        <Route path="/library" component={LibraryPage} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/profile/:id" component={PublicProfile} />

        {/* Admin panel moved to /cabinet dashboard tab */}
        <Route path="/admin"><Redirect to="/cabinet" /></Route>

        {/* Personal cabinet — explicit routes first, then catch-all */}
        <Route path="/cabinet/courses/:id" component={() => <RequireAuth><Cabinet /></RequireAuth>} />
        <Route path="/cabinet/tasks/quiz/:id" component={() => <RequireAuth><Cabinet /></RequireAuth>} />
        <Route path="/cabinet/messages/:userId" component={() => <RequireAuth><Cabinet /></RequireAuth>} />
        <Route path="/cabinet/:rest*" component={() => <RequireAuth><Cabinet /></RequireAuth>} />
        <Route path="/cabinet" component={() => <RequireAuth><Cabinet /></RequireAuth>} />

        {/* Legacy redirects */}
        <Route path="/dashboard"><Redirect to="/cabinet" /></Route>
        <Route path="/courses/:id" component={({ params }) => <Redirect to={`/cabinet/courses/${params.id}`} />} />
        <Route path="/courses"><Redirect to="/cabinet/courses" /></Route>
        <Route path="/tasks"><Redirect to="/cabinet/tasks" /></Route>
        <Route path="/quizzes"><Redirect to="/cabinet/tasks" /></Route>
        <Route path="/quests"><Redirect to="/cabinet/tasks" /></Route>
        <Route path="/quiz/:id" component={({ params }) => <Redirect to={`/cabinet/tasks/quiz/${params.id}`} />} />
        <Route path="/community"><Redirect to="/cabinet/community" /></Route>
        <Route path="/profile"><Redirect to="/cabinet/profile" /></Route>

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
