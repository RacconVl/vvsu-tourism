import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  useListQuests, useSubmitQuest, getListQuestsQueryKey,
  useListQuizzes, useAdminCreateQuest, getGetDashboardSummaryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Compass, Brain, CheckCircle, MapPin, Star, Swords,
  Filter, Clock, Award, ChevronRight, BookOpen, Palette, Trees, Mountain, Plus,
  Target, Zap, ListChecks, Trophy, ArrowLeft,
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
  history:   { label: "История",   color: "bg-amber-500/10 text-amber-700 dark:text-amber-300",    icon: <BookOpen className="h-4 w-4" /> },
  geography: { label: "География", color: "bg-blue-500/10 text-blue-700 dark:text-blue-300",       icon: <Compass className="h-4 w-4" /> },
  nature:    { label: "Природа",   color: "bg-green-500/10 text-green-700 dark:text-green-300",    icon: <Trees className="h-4 w-4" /> },
  culture:   { label: "Культура",  color: "bg-purple-500/10 text-purple-700 dark:text-purple-300", icon: <Palette className="h-4 w-4" /> },
  tourism:   { label: "Туризм",    color: "bg-rose-500/10 text-rose-700 dark:text-rose-300",       icon: <Mountain className="h-4 w-4" /> },
};
const quizDifficultyConfig: Record<string, { label: string; color: string }> = {
  easy:   { label: "Лёгкий",  color: "bg-green-500/15 text-green-700 dark:text-green-300" },
  medium: { label: "Средний", color: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  hard:   { label: "Сложный", color: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
};

type Tab = "quizzes" | "quests";

type QuestForm = {
  title: string;
  description: string;
  type: string;
  difficulty: string;
  location: string;
  xpReward: string;
  timeEstimate: string;
};

const emptyQuestForm: QuestForm = {
  title: "", description: "", type: "route", difficulty: "easy",
  location: "", xpReward: "150", timeEstimate: "60",
};

export default function TasksPage({ defaultTab = "quizzes" }: { defaultTab?: Tab }) {
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);
  const { isAdmin } = useAuth();

  /* quests state */
  const { data: quests, isLoading: questsLoading } = useListQuests();
  const submitQuest = useSubmitQuest();
  const createQuest = useAdminCreateQuest();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");

  /* admin create quest state */
  const [questDialogOpen, setQuestDialogOpen] = useState(false);
  const [questForm, setQuestForm] = useState<QuestForm>(emptyQuestForm);

  /* quizzes state */
  const { data: quizzes, isLoading: quizzesLoading } = useListQuizzes();

  const questTypes = ["all", "route", "budget", "marketing", "design"];
  const filteredQuests = quests?.filter(q => selectedType === "all" || q.type === selectedType);

  const handleQuestSubmit = () => {
    if (!submittingId || !answer.trim()) return;
    submitQuest.mutate({ id: submittingId, data: { answer } }, {
      onSuccess: (result) => {
        toast({
          title: result.success ? "Квест выполнен!" : "Попробуйте ещё раз",
          description: result.xpEarned > 0 ? `${result.feedback} +${result.xpEarned} XP` : result.feedback,
        });
        queryClient.invalidateQueries({ queryKey: getListQuestsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        setSubmittingId(null);
        setAnswer("");
      },
    });
  };

  const handleCreateQuest = () => {
    const { title, description, type, difficulty, location, xpReward, timeEstimate } = questForm;
    if (!title.trim() || !description.trim() || !location.trim()) return;
    createQuest.mutate(
      { data: { title, description, type, difficulty, location, xpReward: Number(xpReward) || 150, timeEstimate: Number(timeEstimate) || 60 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListQuestsQueryKey() });
          toast({ title: "Квест создан", description: `«${title}» добавлен в список квестов.` });
          setQuestDialogOpen(false);
          setQuestForm(emptyQuestForm);
        },
        onError: () => toast({ title: "Ошибка", description: "Не удалось создать квест.", variant: "destructive" }),
      },
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky back bar */}
      <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/cabinet" className="flex items-center gap-2 text-sm font-semibold text-foreground shrink-0">
          <ArrowLeft className="h-5 w-5" /> Обзор
        </Link>
        <span className="text-muted-foreground text-sm">
          {activeTab === "quizzes" ? "Тесты" : "Квесты"}
        </span>
      </div>
      <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
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
            </div>
            {isAdmin && activeTab === "quests" && (
              <Button onClick={() => setQuestDialogOpen(true)} className="rounded-full gap-2 shrink-0 mt-1">
                <Plus className="h-4 w-4" /> Добавить квест
              </Button>
            )}
          </div>
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
            {isAdmin && (
              <div className="mb-6 p-4 rounded-2xl border border-dashed border-border bg-muted/20 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Управление тестами</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Тесты создаются через базу данных и OpenAPI. Поддержка редактора тестов в разработке.</p>
                </div>
              </div>
            )}
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
                              <Badge className={`${diff.color} border-0 backdrop-blur-sm`}>{diff.label}</Badge>
                            </div>
                          </div>
                          <CardContent className="p-5">
                            <h3 className="text-lg font-bold mb-1.5 leading-tight group-hover:text-primary transition-colors">{q.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{q.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1"><Brain className="h-3.5 w-3.5" />{q.questionCount} вопр.</span>
                                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{q.estimatedMinutes} мин</span>
                                <span className="inline-flex items-center gap-1 text-accent font-semibold"><Award className="h-3.5 w-3.5" />+{q.xpReward} XP</span>
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
                          src={quest.imageUrl || "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600"}
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
                          <Button className="w-full rounded-xl" size="sm" variant="outline" disabled>Выполнен</Button>
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
      {(() => {
        const submittingQuest = quests?.find(q => q.id === submittingId) ?? null;
        const questSteps: Record<string, { icon: React.ReactNode; step: string }[]> = {
          route: [
            { icon: <MapPin className="h-4 w-4 text-teal-600" />, step: "Изучите локацию на карте, отметьте ключевые точки маршрута и препятствия" },
            { icon: <Target className="h-4 w-4 text-teal-600" />, step: "Составьте детальный план маршрута с тайммингом и описанием каждого участка" },
            { icon: <Zap className="h-4 w-4 text-teal-600" />, step: "Опишите туристический потенциал, рекомендации и возможные улучшения" },
          ],
          budget: [
            { icon: <ListChecks className="h-4 w-4 text-amber-600" />, step: "Соберите актуальные цены на транспорт, размещение, питание и экскурсии" },
            { icon: <Target className="h-4 w-4 text-amber-600" />, step: "Составьте детальную смету с разбивкой по статьям затрат" },
            { icon: <Zap className="h-4 w-4 text-amber-600" />, step: "Рассчитайте итоговую стоимость, наценку и рентабельность тура" },
          ],
          marketing: [
            { icon: <Target className="h-4 w-4 text-purple-600" />, step: "Определите целевую аудиторию и проанализируйте конкурентов" },
            { icon: <ListChecks className="h-4 w-4 text-purple-600" />, step: "Разработайте контент-план и список маркетинговых активностей" },
            { icon: <Zap className="h-4 w-4 text-purple-600" />, step: "Укажите KPI, бюджет и методы оценки эффективности кампании" },
          ],
          design: [
            { icon: <Target className="h-4 w-4 text-rose-600" />, step: "Изучите фирменный стиль бренда и особенности целевой аудитории" },
            { icon: <ListChecks className="h-4 w-4 text-rose-600" />, step: "Разработайте концепцию дизайна с визуальными примерами и обоснованием" },
            { icon: <Zap className="h-4 w-4 text-rose-600" />, step: "Опишите технические требования и процесс реализации дизайн-решения" },
          ],
        };
        const steps = submittingQuest ? (questSteps[submittingQuest.type] ?? questSteps.route) : [];

        return (
          <Dialog open={!!submittingId} onOpenChange={() => { setSubmittingId(null); setAnswer(""); }}>
            <DialogContent className="rounded-2xl max-w-lg max-h-[90vh] overflow-y-auto p-0">
              {submittingQuest && (
                <>
                  {/* Header with image */}
                  <div className="relative h-36 overflow-hidden rounded-t-2xl">
                    <img
                      src={submittingQuest.imageUrl || "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600"}
                      alt={submittingQuest.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge className={`${questTypeColors[submittingQuest.type] ?? ""} text-xs border-0`}>
                        {questTypeLabels[submittingQuest.type] ?? submittingQuest.type}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <h2 className="text-white font-bold text-lg leading-tight">{submittingQuest.title}</h2>
                    </div>
                  </div>

                  <div className="p-5 space-y-5">
                    {/* Meta */}
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{submittingQuest.locationName}</span>
                      <span className={`flex items-center gap-1.5 text-xs font-medium ${difficultyColors[submittingQuest.difficulty] ?? ""}`}>
                        <Swords className="h-3.5 w-3.5" />{difficultyLabels[submittingQuest.difficulty]}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-accent ml-auto">
                        <Trophy className="h-3.5 w-3.5" />+{submittingQuest.xpReward} XP
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">{submittingQuest.description}</p>

                    {/* Step-by-step guide */}
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground flex items-center gap-2"><ListChecks className="h-4 w-4 text-accent" />Задание</p>
                      {steps.map((s, i) => (
                        <div key={i} className="flex gap-3 p-3 rounded-xl bg-muted/40 border border-border/40">
                          <span className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-[11px] font-bold text-muted-foreground shrink-0">{i + 1}</span>
                          <div className="flex items-start gap-2 flex-1">
                            {s.icon}
                            <p className="text-sm text-foreground leading-snug">{s.step}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Submission */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Ваш ответ</Label>
                      <Textarea
                        placeholder="Опишите ваше решение подробно. Покажите, что вы изучили локацию, продумали детали и готовы к реальной работе..."
                        value={answer}
                        onChange={e => setAnswer(e.target.value)}
                        rows={5}
                        className="rounded-xl resize-none"
                      />
                      <p className="text-xs text-muted-foreground">Минимум 50 символов. Сейчас: {answer.length}</p>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => { setSubmittingId(null); setAnswer(""); }} className="flex-1 rounded-xl">Отмена</Button>
                      <Button
                        onClick={handleQuestSubmit}
                        disabled={submitQuest.isPending || answer.trim().length < 50}
                        className="flex-1 rounded-xl gap-2"
                      >
                        {submitQuest.isPending
                          ? "Отправляю..."
                          : <><Zap className="h-4 w-4" />Сдать квест · +{submittingQuest.xpReward} XP</>
                        }
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        );
      })()}

      {/* Admin: Create Quest Dialog */}
      <Dialog open={questDialogOpen} onOpenChange={setQuestDialogOpen}>
        <DialogContent className="rounded-2xl max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-accent" /> Новый квест
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Название *</Label>
              <Input value={questForm.title} onChange={e => setQuestForm(f => ({ ...f, title: e.target.value }))} className="rounded-xl" placeholder="Маршрут по набережной..." />
            </div>
            <div className="space-y-1.5">
              <Label>Описание *</Label>
              <Textarea rows={3} value={questForm.description} onChange={e => setQuestForm(f => ({ ...f, description: e.target.value }))} className="rounded-xl" placeholder="Краткое описание квеста..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Тип</Label>
                <Select value={questForm.type} onValueChange={v => setQuestForm(f => ({ ...f, type: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="route">Маршрут</SelectItem>
                    <SelectItem value="budget">Бюджет</SelectItem>
                    <SelectItem value="marketing">Маркетинг</SelectItem>
                    <SelectItem value="design">Дизайн</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Сложность</Label>
                <Select value={questForm.difficulty} onValueChange={v => setQuestForm(f => ({ ...f, difficulty: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Лёгкий</SelectItem>
                    <SelectItem value="medium">Средний</SelectItem>
                    <SelectItem value="hard">Сложный</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Место *</Label>
              <Input value={questForm.location} onChange={e => setQuestForm(f => ({ ...f, location: e.target.value }))} className="rounded-xl" placeholder="Набережная Спортивной гавани" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>XP за квест</Label>
                <Input type="number" value={questForm.xpReward} onChange={e => setQuestForm(f => ({ ...f, xpReward: e.target.value }))} className="rounded-xl" min={0} />
              </div>
              <div className="space-y-1.5">
                <Label>Время (мин)</Label>
                <Input type="number" value={questForm.timeEstimate} onChange={e => setQuestForm(f => ({ ...f, timeEstimate: e.target.value }))} className="rounded-xl" min={0} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuestDialogOpen(false)}>Отмена</Button>
            <Button
              onClick={handleCreateQuest}
              disabled={createQuest.isPending || !questForm.title.trim() || !questForm.description.trim() || !questForm.location.trim()}
            >
              {createQuest.isPending ? "Создание..." : "Создать квест"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
