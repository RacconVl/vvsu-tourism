import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGetDashboardSummary, useGetProgressMap, useGetLeaderboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BookOpen, Compass, Award, Star, Clock, ChevronRight, Trophy, Flame, Anchor, MapPin } from "lucide-react";

const roleLabels: Record<string, string> = {
  guide: "Экскурсовод",
  marketer: "Маркетолог",
  designer: "Дизайнер",
  operator: "Туроператор",
};

const activityIcons: Record<string, React.ReactNode> = {
  module_complete: <BookOpen className="h-4 w-4 text-secondary" />,
  quest_complete: <Compass className="h-4 w-4 text-accent" />,
  achievement: <Award className="h-4 w-4 text-yellow-500" />,
};

export default function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary();
  const { data: progressMap, isLoading: mapLoading } = useGetProgressMap();
  const { data: leaderboard, isLoading: lbLoading } = useGetLeaderboard();

  const xpPercent = summary
    ? Math.round((summary.xp / (summary.xp + summary.xpToNextLevel)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        {summaryLoading ? (
          <Skeleton className="h-24 w-full rounded-2xl" />
        ) : summary ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-primary rounded-2xl p-6 text-primary-foreground flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Anchor className="h-6 w-6 text-accent" />
                <span className="text-primary-foreground/70 text-sm uppercase tracking-wider">Личный кабинет</span>
              </div>
              <h1 className="text-3xl font-bold">{summary.studentName}</h1>
              <p className="text-primary-foreground/80 mt-1">
                {roleLabels[summary.currentRole] ?? summary.currentRole} · {summary.currentStage}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 min-w-[200px]">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-accent" />
                <span className="text-2xl font-bold">{summary.xp.toLocaleString()} XP</span>
                <Badge className="bg-accent text-white border-0">Уровень {summary.level}</Badge>
              </div>
              <div className="w-full">
                <Progress value={xpPercent} className="h-2 bg-primary-foreground/20" />
                <p className="text-xs text-primary-foreground/60 mt-1 text-right">
                  Ещё {summary.xpToNextLevel} XP до уровня {summary.level + 1}
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Stats */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: "Курсов завершено", value: `${summary.completedCourses}/${summary.totalCourses}`, icon: <BookOpen className="h-5 w-5 text-secondary" />, href: "/courses" },
              { label: "Квестов выполнено", value: `${summary.completedQuests}/${summary.totalQuests}`, icon: <Compass className="h-5 w-5 text-accent" />, href: "/quests" },
              { label: "Достижений", value: `${summary.unlockedAchievements}/${summary.totalAchievements}`, icon: <Award className="h-5 w-5 text-yellow-500" />, href: "/achievements" },
              { label: "Текущий этап", value: summary.currentStage, icon: <MapPin className="h-5 w-5 text-primary" />, href: "/map" },
            ].map((stat, i) => (
              <Link key={i} href={stat.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group rounded-2xl border-border/60">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      {stat.icon}
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                    </div>
                    <p className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{stat.value}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Journey Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="rounded-2xl border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <MapPin className="h-5 w-5" />
                  Карта путешествия
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mapLoading ? (
                  <div className="space-y-3">
                    {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
                  </div>
                ) : progressMap ? (
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                    <div className="space-y-4">
                      {progressMap.stages.map((stage, i) => (
                        <motion.div
                          key={stage.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex gap-4 items-start pl-2"
                        >
                          <div className={`relative z-10 flex-shrink-0 h-10 w-10 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                            stage.isCompleted
                              ? "bg-secondary border-secondary text-white"
                              : stage.isCurrent
                              ? "bg-accent border-accent text-white animate-pulse"
                              : stage.isLocked
                              ? "bg-muted border-muted-border text-muted-foreground"
                              : "bg-background border-border text-foreground"
                          }`}>
                            {stage.isCompleted ? "✓" : i + 1}
                          </div>
                          <div className={`flex-1 p-3 rounded-xl border transition-all ${
                            stage.isCurrent
                              ? "border-accent/40 bg-accent/5"
                              : stage.isCompleted
                              ? "border-secondary/30 bg-secondary/5"
                              : "border-border/40 bg-muted/30"
                          }`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className={`font-semibold ${stage.isLocked ? "text-muted-foreground" : "text-foreground"}`}>
                                  {stage.name}
                                </p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <MapPin className="h-3 w-3" /> {stage.location}
                                </p>
                              </div>
                              {stage.isCurrent && (
                                <Badge className="bg-accent text-white border-0 text-xs">Текущий</Badge>
                              )}
                              {stage.isLocked && (
                                <span className="text-xs text-muted-foreground">{stage.xpRequired} XP</span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <Card className="rounded-2xl border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Star className="h-4 w-4" /> Последняя активность
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {summaryLoading ? (
                    [1,2,3].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl" />)
                  ) : summary?.recentActivity.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-2 rounded-xl bg-muted/30">
                      <div className="mt-0.5">{activityIcons[item.type] ?? <Star className="h-4 w-4" />}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground line-clamp-2">{item.description}</p>
                        <p className="text-xs text-accent font-medium mt-0.5">+{item.xpEarned} XP</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Deadlines */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <Card className="rounded-2xl border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Ближайшие дедлайны
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {summaryLoading ? (
                    [1,2].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />)
                  ) : summary?.upcomingDeadlines.map((d) => (
                    <div key={d.id} className="p-3 rounded-xl border border-border/60 bg-background">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{d.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{d.courseTitle}</p>
                      <p className="text-xs text-accent mt-1">
                        {new Date(d.dueDate).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Mini Leaderboard */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
              <Card className="rounded-2xl border-border/60">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Trophy className="h-4 w-4" /> Топ студентов
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild className="text-xs">
                    <Link href="/leaderboard">Все <ChevronRight className="h-3 w-3 ml-1" /></Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  {lbLoading ? (
                    [1,2,3].map(i => <Skeleton key={i} className="h-10 w-full rounded-xl" />)
                  ) : leaderboard?.slice(0, 4).map((entry) => (
                    <div key={entry.rank} className={`flex items-center gap-3 p-2 rounded-xl ${entry.rank <= 3 ? "bg-accent/5" : ""}`}>
                      <span className={`text-sm font-bold w-5 text-center ${entry.rank === 1 ? "text-yellow-500" : entry.rank === 2 ? "text-gray-400" : entry.rank === 3 ? "text-amber-600" : "text-muted-foreground"}`}>
                        {entry.rank}
                      </span>
                      <img src={entry.avatarUrl} alt={entry.studentName} className="h-7 w-7 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{entry.studentName}</p>
                        <p className="text-xs text-muted-foreground">Ур. {entry.level}</p>
                      </div>
                      <span className="text-xs font-semibold text-accent">{entry.xp.toLocaleString()}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
