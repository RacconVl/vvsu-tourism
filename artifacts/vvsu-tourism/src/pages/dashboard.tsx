import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGetDashboardSummary, useGetProgressMap, useGetLeaderboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BookOpen, Compass, Award, Star, Clock, ChevronRight, Trophy, Flame, Anchor, MapPin, Waves } from "lucide-react";

const roleLabels: Record<string, string> = {
  guide: "Экскурсовод",
  marketer: "Маркетолог",
  designer: "Дизайнер",
  operator: "Туроператор",
};

const activityIcons: Record<string, React.ReactNode> = {
  module_complete: <BookOpen className="h-4 w-4 text-accent" />,
  quest_complete: <Compass className="h-4 w-4 text-accent" />,
  achievement: <Award className="h-4 w-4 text-yellow-400" />,
};

export default function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary();
  const { data: progressMap, isLoading: mapLoading } = useGetProgressMap();
  const { data: leaderboard, isLoading: lbLoading } = useGetLeaderboard();

  const xpPercent = summary
    ? Math.round((summary.xp / (summary.xp + summary.xpToNextLevel)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero banner */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #172E46 0%, #033F7E 55%, #0a2d5c 100%)",
        }}
      >
        {/* Decorative wave shapes */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="hsl(var(--background))" />
          </svg>
          <div className="absolute top-6 right-12 opacity-10">
            <Waves className="h-40 w-40 text-white" />
          </div>
          <div className="absolute -top-4 -left-4 opacity-5">
            <Anchor className="h-56 w-56 text-white" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-10 pb-16">
          {summaryLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-32 bg-white/10" />
              <Skeleton className="h-10 w-64 bg-white/10" />
              <Skeleton className="h-4 w-48 bg-white/10" />
            </div>
          ) : summary ? (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Anchor className="h-5 w-5 text-accent" />
                  <span className="text-white/50 text-xs uppercase tracking-widest font-medium">
                    Личный кабинет
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-white leading-tight">
                  {summary.studentName}
                </h1>
                <p className="text-white/60 mt-1.5 text-sm">
                  {roleLabels[summary.currentRole] ?? summary.currentRole}
                  <span className="mx-2 text-white/30">·</span>
                  <span className="text-accent/90">{summary.currentStage}</span>
                </p>
              </div>

              {/* XP block */}
              <div
                className="flex flex-col gap-3 rounded-2xl p-5 min-w-[240px]"
                style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.10)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-accent" />
                    <span className="text-2xl font-bold text-white">
                      {summary.xp.toLocaleString()}
                      <span className="text-base font-normal text-white/50 ml-1">XP</span>
                    </span>
                  </div>
                  <Badge
                    className="text-xs font-bold border-0 px-3"
                    style={{ background: "#EB7124", color: "#fff" }}
                  >
                    Уровень {summary.level}
                  </Badge>
                </div>
                <div>
                  <div className="relative h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.12)" }}>
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                      style={{ width: `${xpPercent}%`, background: "linear-gradient(90deg, #EB7124, #f59e0b)" }}
                    />
                  </div>
                  <p className="text-xs text-white/40 mt-1.5 text-right">
                    Ещё {summary.xpToNextLevel} XP до уровня {summary.level + 1}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-10 space-y-8 -mt-2">
        {/* Stat cards */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              {
                label: "Курсов завершено",
                value: `${summary.completedCourses}/${summary.totalCourses}`,
                icon: <BookOpen className="h-5 w-5" />,
                href: "/courses",
                accent: "#033F7E",
              },
              {
                label: "Квестов выполнено",
                value: `${summary.completedQuests}/${summary.totalQuests}`,
                icon: <Compass className="h-5 w-5" />,
                href: "/quests",
                accent: "#EB7124",
              },
              {
                label: "Достижений",
                value: `${summary.unlockedAchievements}/${summary.totalAchievements}`,
                icon: <Award className="h-5 w-5" />,
                href: "/profile",
                accent: "#d97706",
              },
              {
                label: "Текущий этап",
                value: summary.currentStage,
                icon: <MapPin className="h-5 w-5" />,
                href: "/map",
                accent: "#172E46",
              },
            ].map((stat, i) => (
              <Link key={i} href={stat.href}>
                <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer rounded-2xl border-border/60 overflow-hidden group">
                  <CardContent className="p-0">
                    <div
                      className="h-1.5 w-full"
                      style={{ background: stat.accent }}
                    />
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl text-white" style={{ background: stat.accent }}>
                          {stat.icon}
                        </span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider leading-tight">{stat.label}</span>
                      </div>
                      <p className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {stat.value}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Journey Map */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="rounded-2xl border-border/60 overflow-hidden">
              <div className="h-1" style={{ background: "linear-gradient(90deg, #172E46, #033F7E, #EB7124)" }} />
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="flex items-center gap-2 text-primary text-base">
                  <MapPin className="h-4 w-4 text-accent" />
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
                          transition={{ delay: i * 0.08 }}
                          className="flex gap-4 items-start pl-2"
                        >
                          <div className={`relative z-10 flex-shrink-0 h-10 w-10 rounded-full border-2 flex items-center justify-center text-sm font-bold shadow-sm ${
                            stage.isCompleted
                              ? "text-white border-[#033F7E]"
                              : stage.isCurrent
                              ? "text-white border-[#EB7124] animate-pulse"
                              : stage.isLocked
                              ? "bg-muted border-muted text-muted-foreground"
                              : "bg-background border-border text-foreground"
                          }`} style={
                            stage.isCompleted ? { background: "#033F7E" }
                            : stage.isCurrent ? { background: "#EB7124" }
                            : {}
                          }>
                            {stage.isCompleted ? "✓" : i + 1}
                          </div>
                          <div className={`flex-1 p-3 rounded-xl border transition-all ${
                            stage.isCurrent
                              ? "border-[#EB7124]/30 bg-[#EB7124]/5"
                              : stage.isCompleted
                              ? "border-[#033F7E]/20 bg-[#033F7E]/5"
                              : "border-border/40 bg-muted/20"
                          }`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className={`font-semibold text-sm ${stage.isLocked ? "text-muted-foreground" : "text-foreground"}`}>
                                  {stage.name}
                                </p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <MapPin className="h-3 w-3" /> {stage.location}
                                </p>
                              </div>
                              {stage.isCurrent && (
                                <Badge className="border-0 text-white text-xs" style={{ background: "#EB7124" }}>
                                  Текущий
                                </Badge>
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
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <Card className="rounded-2xl border-border/60 overflow-hidden">
                <div className="h-1" style={{ background: "#EB7124" }} />
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Star className="h-3.5 w-3.5 text-accent" /> Последняя активность
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {summaryLoading ? (
                    [1,2,3].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl" />)
                  ) : summary?.recentActivity.length ? summary.recentActivity.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-muted/30 border border-border/40">
                      <div className="mt-0.5 shrink-0">{activityIcons[item.type] ?? <Star className="h-4 w-4 text-muted-foreground" />}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground line-clamp-2 leading-snug">{item.description}</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: "#EB7124" }}>+{item.xpEarned} XP</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-muted-foreground py-2 text-center">Активность пока отсутствует</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Deadlines */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <Card className="rounded-2xl border-border/60 overflow-hidden">
                <div className="h-1" style={{ background: "#033F7E" }} />
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" /> Ближайшие дедлайны
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {summaryLoading ? (
                    [1,2].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />)
                  ) : summary?.upcomingDeadlines.length ? summary.upcomingDeadlines.map((d) => (
                    <div key={d.id} className="p-3 rounded-xl border border-border/60 bg-background">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{d.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{d.courseTitle}</p>
                      <p className="text-xs font-medium mt-1" style={{ color: "#EB7124" }}>
                        {new Date(d.dueDate).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
                      </p>
                    </div>
                  )) : (
                    <p className="text-xs text-muted-foreground py-2 text-center">Дедлайнов нет</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Mini Leaderboard */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
              <Card className="rounded-2xl border-border/60 overflow-hidden">
                <div className="h-1" style={{ background: "linear-gradient(90deg, #172E46, #033F7E)" }} />
                <CardHeader className="pb-2 pt-4 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Trophy className="h-3.5 w-3.5 text-yellow-500" /> Топ студентов
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild className="text-xs h-7 px-2">
                    <Link href="/leaderboard">Все <ChevronRight className="h-3 w-3 ml-0.5" /></Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {lbLoading ? (
                    [1,2,3].map(i => <Skeleton key={i} className="h-10 w-full rounded-xl" />)
                  ) : leaderboard?.length ? leaderboard.slice(0, 4).map((entry) => (
                    <div
                      key={entry.rank}
                      className="flex items-center gap-3 p-2 rounded-xl transition-colors hover:bg-muted/40"
                      style={entry.rank <= 3 ? { background: "rgba(235,113,36,0.05)" } : {}}
                    >
                      <span className={`text-sm font-bold w-5 text-center shrink-0 ${
                        entry.rank === 1 ? "text-yellow-500"
                        : entry.rank === 2 ? "text-gray-400"
                        : entry.rank === 3 ? "text-amber-600"
                        : "text-muted-foreground"
                      }`}>
                        {entry.rank}
                      </span>
                      <img src={entry.avatarUrl} alt={entry.studentName} className="h-7 w-7 rounded-full object-cover ring-1 ring-border" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{entry.studentName}</p>
                        <p className="text-xs text-muted-foreground">Ур. {entry.level}</p>
                      </div>
                      <span className="text-xs font-bold" style={{ color: "#EB7124" }}>{entry.xp.toLocaleString()}</span>
                    </div>
                  )) : (
                    <p className="text-xs text-muted-foreground py-2 text-center">Пока нет студентов</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
