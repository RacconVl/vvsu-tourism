import { Switch, Route, Redirect } from "wouter";
import { CabinetSidebar } from "@/components/layout/CabinetSidebar";
import Dashboard from "@/pages/dashboard";
import Courses from "@/pages/courses";
import CourseDetail from "@/pages/course-detail";
import Tasks from "@/pages/tasks";
import QuizDetail from "@/pages/quiz-detail";
import Community from "@/pages/community";
import Messages from "@/pages/messages";
import Conversation from "@/pages/conversation";
import Friends from "@/pages/friends";

export default function Cabinet() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      <CabinetSidebar />
      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        <Switch>
          <Route path="/cabinet" component={Dashboard} />
          <Route path="/cabinet/courses/:id">
            {(params: { id?: string }) => (
              <CourseDetail courseId={parseInt(params?.id ?? "0", 10)} />
            )}
          </Route>
          <Route path="/cabinet/courses" component={Courses} />
          <Route path="/cabinet/tasks/quiz/:id">
            {(params: { id?: string }) => (
              <QuizDetail quizId={parseInt(params?.id ?? "0", 10)} />
            )}
          </Route>
          <Route path="/cabinet/tasks" component={() => <Tasks />} />
          <Route path="/cabinet/community" component={Community} />
          <Route path="/cabinet/messages/:userId">
            {(params: { userId?: string }) => (
              <Conversation partnerId={parseInt(params?.userId ?? "0", 10)} />
            )}
          </Route>
          <Route path="/cabinet/messages" component={Messages} />
          <Route path="/cabinet/friends" component={Friends} />
          <Route><Redirect to="/cabinet" /></Route>
        </Switch>
      </main>
    </div>
  );
}
