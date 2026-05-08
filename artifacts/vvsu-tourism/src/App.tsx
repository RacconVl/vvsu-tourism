import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Courses from "@/pages/courses";
import CourseDetail from "@/pages/course-detail";
import Quests from "@/pages/quests";
import MapPage from "@/pages/map-page";
import Community from "@/pages/community";
import LibraryPage from "@/pages/library";
import Achievements from "@/pages/achievements";
import Leaderboard from "@/pages/leaderboard";
import Quizzes from "@/pages/quizzes";
import QuizDetail from "@/pages/quiz-detail";
import NotFound from "@/pages/not-found";

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
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/courses" component={Courses} />
        <Route path="/courses/:id" component={CourseDetail} />
        <Route path="/quizzes" component={Quizzes} />
        <Route path="/quiz/:id" component={QuizDetail} />
        <Route path="/quests" component={Quests} />
        <Route path="/map" component={MapPage} />
        <Route path="/community" component={Community} />
        <Route path="/library" component={LibraryPage} />
        <Route path="/achievements" component={Achievements} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
