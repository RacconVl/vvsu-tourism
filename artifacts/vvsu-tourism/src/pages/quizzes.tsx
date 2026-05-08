import { motion } from "framer-motion";
import { Link } from "wouter";
import { useListQuizzes } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Clock, Award, ChevronRight, Compass, BookOpen, Mountain, Palette, Trees } from "lucide-react";

const categoryConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  history: { label: "История", color: "bg-amber-500/10 text-amber-700 dark:text-amber-300", icon: <BookOpen className="h-4 w-4" /> },
  geography: { label: "География", color: "bg-blue-500/10 text-blue-700 dark:text-blue-300", icon: <Compass className="h-4 w-4" /> },
  nature: { label: "Природа", color: "bg-green-500/10 text-green-700 dark:text-green-300", icon: <Trees className="h-4 w-4" /> },
  culture: { label: "Культура", color: "bg-purple-500/10 text-purple-700 dark:text-purple-300", icon: <Palette className="h-4 w-4" /> },
  tourism: { label: "Туризм", color: "bg-rose-500/10 text-rose-700 dark:text-rose-300", icon: <Mountain className="h-4 w-4" /> },
};

const difficultyConfig: Record<string, { label: string; color: string }> = {
  easy: { label: "Лёгкий", color: "bg-green-500/15 text-green-700 dark:text-green-300" },
  medium: { label: "Средний", color: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  hard: { label: "Сложный", color: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
};

export default function QuizzesPage() {
  const { data: quizzes, isLoading } = useListQuizzes();

  return (
    <div className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-6 w-6 text-accent" />
            <span className="text-muted-foreground uppercase tracking-widest text-xs">Знания</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Тесты и викторины</h1>
          <p className="text-muted-foreground mt-1">
            Проверьте свои знания о Владивостоке, Приморском крае, его истории, природе и культуре
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {quizzes?.map((q, i) => {
              const cat = categoryConfig[q.category] ?? categoryConfig.history;
              const diff = difficultyConfig[q.difficulty] ?? difficultyConfig.easy;
              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/quiz/${q.id}`}>
                    <Card className="rounded-2xl border-border/60 overflow-hidden cursor-pointer hover-elevate transition-all h-full">
                      <div
                        className="h-32 bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${q.imageUrl})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <Badge className={`${cat.color} border-0 backdrop-blur-sm`}>
                            <span className="mr-1">{cat.icon}</span>
                            {cat.label}
                          </Badge>
                          <Badge className={`${diff.color} border-0 backdrop-blur-sm`}>
                            {diff.label}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="text-lg font-bold mb-1.5 leading-tight">{q.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{q.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Brain className="h-3.5 w-3.5" />
                              {q.questionCount} вопр.
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {q.estimatedMinutes} мин
                            </span>
                            <span className="inline-flex items-center gap-1 text-accent font-semibold">
                              <Award className="h-3.5 w-3.5" />
                              +{q.xpReward} XP
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
