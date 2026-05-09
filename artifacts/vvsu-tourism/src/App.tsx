import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import { AuthProvider } from "@/hooks/use-auth";
import { RequireAuth } from "@/components/auth/RequireAuth";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import PublicProfile from "@/pages/public-profile";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import AdminPage from "@/pages/admin";
import Courses from "@/pages/courses";
import CourseDetail from "@/pages/course-detail";
import Quests from "@/pages/quests";
import MapPage from "@/pages/map-page";
import Community from "@/pages/community";
import LibraryPage from "@/pages/library";
import Leaderboard from "@/pages/leaderboard";
import Quizzes from "@/pages/quizzes";
import QuizDetail from "@/pages/quiz-detail";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/use-auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function CabinetSwitch() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return user ? <Profile /> : <Dashboard />;
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/dashboard" component={CabinetSwitch} />
        <Route path="/profile" component={() => <RequireAuth><Profile /></RequireAuth>} />
        <Route path="/profile/:id" component={PublicProfile} />
        <Route path="/admin" component={() => <RequireAuth adminOnly><AdminPage /></RequireAuth>} />
        <Route path="/courses" component={Courses} />
        <Route path="/courses/:id" component={CourseDetail} />
        <Route path="/quizzes" component={() => <RequireAuth><Quizzes /></RequireAuth>} />
        <Route path="/quiz/:id" component={() => <RequireAuth><QuizDetail /></RequireAuth>} />
        <Route path="/quests" component={() => <RequireAuth><Quests /></RequireAuth>} />
        <Route path="/map" component={MapPage} />
        <Route path="/community" component={Community} />
        <Route path="/library" component={LibraryPage} />
        <Route path="/leaderboard" component={Leaderboard} />
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
