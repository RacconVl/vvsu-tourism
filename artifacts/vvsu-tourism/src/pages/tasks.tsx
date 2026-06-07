import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  useListQuests, useSubmitQuest, getListQuestsQueryKey,
  useListQuizzes,
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Compass, Brain, CheckCircle, MapPin, Star, Swords,
  Filter, Clock, Award, ChevronRight, BookOpen, Palette, Trees, Mountain,
} from "lucide-react";

/* ── Quest config ─────────────────────────────────────────── */
const questTypeColors: Record<string, string> = {
  route: "bg-teal-100 text-teal-700",
  budget: "bg-amber-100 text-amber-700",
  marketing: "bg-purple-100 text-purple-700",
  design: "bg-rose-100 text-rose-700",
};
const questTypeLabels: Record<string, string> = {
  route: "Маршрут", budget: "Бюджет", marketing: "Маркетинг", design: "Дизайн",
};
const difficultyColors: Record<string, string> = {
  easy: "text-green-600", medium: "text-amber-600", hard: "text-red-600",
};
const difficultyLabels: Record<string, string> = {
  easy: "Лёгкий", medium: "Средний", hard: "Сложный",
};

/* ── Quiz config ──────────────────────────────────────────── */
const quizCategoryConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  history:   { label: "История",   color: "bg-amber-500/10 text-amber-700 dark:text-amber-300",  icon: <BookOpen className="h-4 w-4" /> },
  geography: { label: "География", color: "bg-blue-500/10 text-blue-700 dark:text-blue-300",     icon: <Compass className="h-4 w-4" /> },
  nature:    { label: "Природа",   color: "bg-green-500/10 text-green-700 dark:text-green-300",  icon: <Trees className="h-4 w-4" /> },
  culture:   { label: "Культура",  color: "bg-purple-500/10 text-purple-700 dark:text-purple-300", icon: <Palette className="h-4 w-4" /> },
  tourism:   { label: "Туризм",    color: "bg-rose-500/10 text-rose-700 dark:text-rose-300",     icon: <Mountain className="h-4 w-4" /> },
};
const quizDifficultyConfig: Record<string, { label: string; color: string }> = {
  easy:   { label: "Лёгкий",  color: "bg-green-500/15 text-green-700 dark:text-green-300" },
  medium: { label: "Средний", color: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  hard:   { label: "Сложный", color: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
};

type Tab = "quizzes" | "quests";

export default function TasksPage({ defaultTab = "quizzes" }: { defaultTab?: Tab }) {
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);

  /* quests state */
  const { data: quests, isLoading: questsLoading } = useListQuests();
  const submitQuest = useSubmitQuest();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");

  /* quizzes state */
  const { data: quizzes, isLoading: quizzesLoading } = useListQuizzes();

  const questTypes = ["all", "route", "budget", "marketing", "design"];
  const filteredQuests = quests?.filter(q => selectedType === "all" || q.type === selectedType);

  const handleQuestSubmit = () => {
    if (!submittingId || !answer.trim()) return;
    submitQuest.mutate({ id: submittingId, data: { answer } }, {
      onSuccess: (result) => {
        toast({ title: result.success ? "Квест выполнен!" : "Попробуйте ещё раз", description: result.feedback });
        queryClient.invalidateQueries({ queryKey: getListQuestsQueryKey() });
        setSubmittingId(null);
        setAnswer("");
      },
    });
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {activeTab === "quizzes"
              ? <Brain className="h-6 w-6 text-accent" />
              : <Compass className="h-6 w-6 text-accent" />}
            <span className="text-muted-foreground uppercase tracking-widest text-xs">Задания</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Тесты и квесты</h1>
          <p className="text-muted-foreground mt-1">
            Проверяйте знания и выполняйте практические задания по туризму
          </p>
        </motion.div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-8 p-1 rounded-2xl border border-border/60 bg-muted/30 w-fit">
          <button
            onClick={() => setActiveTab("quizzes")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "quizzes"
                ? "bg-background shadow-sm text-foreground border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Brain className="h-4 w-4" /> Тесты
          </button>
          <button
            onClick={() => setActiveTab("quests")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "quests"
                ? "bg-background shadow-sm text-foreground border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Compass className="h-4 w-4" /> Квесты
          </button>
        </div>

        {/* ── QUIZZES TAB ──────────────────────────────────────── */}
        {activeTab === "quizzes" && (
          <motion.div key="quizzes" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            {quizzesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {quizzes?.map((q, i) => {
                  const cat = quizCategoryConfig[q.category] ?? quizCategoryConfig.history;
                  const diff = quizDifficultyConfig[q.difficulty] ?? quizDifficultyConfig.easy;
                  return (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link href={`/cabinet/tasks/quiz/${q.id}`}>
                        <Card className="rounded-2xl border-border/60 overflow-hidden cursor-pointer hover-elevate transition-all h-full group">
                          <div
                            className="h-32 bg-cover bg-center relative"
                            style={{ backgroundImage: `url(${q.imageUrl})` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                            <div className="absolute top-3 left-3 flex gap-2">
                              <Badge className={`${cat.color} border-0 backdrop-blur-sm`}>
                                <span className="mr-1">{cat.icon}</span>{cat.label}
                              </Badge>
                              <Badge className={`${diff.color} border-0 backdrop-blur-sm`}>
                                {diff.label}
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-5">
                            <h3 className="text-lg font-bold mb-1.5 leading-tight group-hover:text-primary transition-colors">
                              {q.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{q.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1">
                                  <Brain className="h-3.5 w-3.5" />{q.questionCount} вопр.
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />{q.estimatedMinutes} мин
                                </span>
                                <span className="inline-flex items-center gap-1 text-accent font-semibold">
                                  <Award className="h-3.5 w-3.5" />+{q.xpReward} XP
                                </span>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ── QUESTS TAB ───────────────────────────────────────── */}
        {activeTab === "quests" && (
          <motion.div key="quests" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            {/* Filter */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {questTypes.map(t => (
                <Button
                  key={t}
                  variant={selectedType === t ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(t)}
                  className="rounded-full"
                >
                  {t === "all" ? "Все" : questTypeLabels[t]}
                </Button>
              ))}
            </div>

            {questsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-72 w-full rounded-2xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuests?.map((quest, i) => (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={!quest.isCompleted ? { y: -4 } : {}}
                  >
                    <Card className={`overflow-hidden rounded-2xl border-border/60 h-full ${
                      quest.isCompleted ? "opacity-70" : "hover:shadow-xl transition-shadow"
                    }`}>
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={quest.imageUrl ?? "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600"}
                          alt={quest.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {quest.isCompleted && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <CheckCircle className="h-12 w-12 text-green-400" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <Badge className={`${questTypeColors[quest.type] ?? ""} text-xs border-0`}>
                            {questTypeLabels[quest.type] ?? quest.type}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <h3 className="font-bold text-foreground leading-tight">{quest.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{quest.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-medium flex items-center gap-1 ${difficultyColors[quest.difficulty] ?? ""}`}>
                              <Swords className="h-3.5 w-3.5" /> {difficultyLabels[quest.difficulty]}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" /> {quest.locationName}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-accent flex items-center gap-1">
                            <Star className="h-3.5 w-3.5" /> {quest.xpReward} XP
                          </span>
                        </div>
                        {quest.isCompleted ? (
                          <Button className="w-full rounded-xl" size="sm" variant="outline" disabled>
                            Выполнен
                          </Button>
                        ) : (
                          <Button
                            className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                            size="sm"
                            onClick={() => { setSubmittingId(quest.id); setAnswer(""); }}
                          >
                            Выполнить квест
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Quest submit dialog */}
      <Dialog open={!!submittingId} onOpenChange={() => setSubmittingId(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Отправить ответ на квест</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Опишите ваше решение задания..."
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            rows={5}
            className="rounded-xl"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmittingId(null)}>Отмена</Button>
            <Button
              onClick={handleQuestSubmit}
              disabled={submitQuest.isPending || !answer.trim()}
            >
              {submitQuest.isPending ? "Отправляю..." : "Отправить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
