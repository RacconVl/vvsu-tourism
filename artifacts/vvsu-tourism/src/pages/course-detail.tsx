import { useParams } from "wouter";
import { motion } from "framer-motion";
import {
  useGetCourse,
  useCompleteModule,
  getListCoursesQueryKey,
  getGetDashboardSummaryQueryKey,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, PlayCircle, FileText, Zap, FlaskConical, Star, Clock, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const moduleTypeIcon: Record<string, React.ReactNode> = {
  video: <PlayCircle className="h-5 w-5 text-secondary" />,
  interactive: <Zap className="h-5 w-5 text-accent" />,
  animation: <FileText className="h-5 w-5 text-purple-500" />,
  test: <FlaskConical className="h-5 w-5 text-yellow-500" />,
};

const moduleTypeLabel: Record<string, string> = {
  video: "Видео",
  interactive: "Интерактив",
  animation: "Анимация",
  test: "Тест",
};

export default function CourseDetail() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id ?? "0", 10);
  const queryClient = useQueryClient();

  const { data: course, isLoading } = useGetCourse(id);
  const completeModule = useCompleteModule();
  const { toast } = useToast();

  const progress = course && course.totalModules > 0
    ? Math.round((course.completedModules / course.totalModules) * 100)
    : 0;

  const handleCompleteModule = (moduleId: number) => {
    completeModule.mutate({ id: moduleId }, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() });
        queryClient.invalidateQueries({ queryKey: ["getCourse", id] });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        if (data.xpEarned > 0) {
          toast({ title: `+${data.xpEarned} XP заработано`, description: "Модуль успешно завершён!" });
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {isLoading ? (
        <div className="p-8 space-y-6">
          <Skeleton className="h-60 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      ) : course ? (
        <>
          {/* Hero */}
          <div className="relative h-72 overflow-hidden">
            <img
              src={course.imageUrl || "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200"}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <Link href="/cabinet/courses">
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-white mb-4 w-fit gap-1">
                  <ArrowLeft className="h-4 w-4" /> Назад к курсам
                </Button>
              </Link>
              <Badge className="w-fit mb-2 bg-accent text-white border-0">{course.stage}</Badge>
              <h1 className="text-3xl font-bold text-white">{course.title}</h1>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
            {/* Overview */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <Card className="rounded-2xl border-border/60">
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">{course.description}</p>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-accent" />
                      <span className="text-sm text-foreground font-medium">{course.xpReward} XP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-secondary" />
                      <span className="text-sm text-foreground font-medium">{course.totalModules} модулей</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Прогресс</span>
                        <span className="font-medium text-foreground">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Modules */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Модули курса</h2>
              <div className="space-y-3">
                {course.modules?.map((module, i) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Card className={`rounded-2xl border-border/60 transition-all ${module.isCompleted ? "bg-secondary/5 border-secondary/20" : "hover:shadow-md"}`}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {module.isCompleted
                            ? <CheckCircle className="h-6 w-6 text-secondary" />
                            : <div className="h-6 w-6 rounded-full border-2 border-border flex items-center justify-center text-xs text-muted-foreground">{i + 1}</div>
                          }
                        </div>
                        <div className="flex-shrink-0">
                          {moduleTypeIcon[module.type] ?? <FileText className="h-5 w-5 text-muted-foreground" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm leading-tight ${module.isCompleted ? "text-muted-foreground line-through" : "text-foreground"}`}>
                            {module.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-muted-foreground">{moduleTypeLabel[module.type]}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {module.durationMinutes} мин
                            </span>
                            <span className="text-xs text-accent font-medium">+{module.xpReward} XP</span>
                          </div>
                        </div>
                        {!module.isCompleted && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => handleCompleteModule(module.id)}
                            disabled={completeModule.isPending}
                            data-testid={`button-complete-module-${module.id}`}
                          >
                            Завершить
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-64 text-muted-foreground">Курс не найден</div>
      )}
    </div>
  );
}
