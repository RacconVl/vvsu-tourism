import { Switch, Route, Redirect } from "wouter";
import { CabinetSidebar } from "@/components/layout/CabinetSidebar";
import Dashboard from "@/pages/dashboard";
import Courses from "@/pages/courses";
import CourseDetail from "@/pages/course-detail";
import Tasks from "@/pages/tasks";
import QuizDetail from "@/pages/quiz-detail";
import Community from "@/pages/community";

export default function Cabinet() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      <CabinetSidebar />
      <main className="flex-1 overflow-auto">
        <Switch>
          <Route path="/cabinet" component={Dashboard} />
          <Route path="/cabinet/courses/:id" component={CourseDetail} />
          <Route path="/cabinet/courses" component={Courses} />
          <Route path="/cabinet/tasks/quiz/:id" component={QuizDetail} />
          <Route path="/cabinet/tasks" component={() => <Tasks />} />
          <Route path="/cabinet/community" component={Community} />
          <Route><Redirect to="/cabinet" /></Route>
        </Switch>
      </main>
    </div>
  );
}
