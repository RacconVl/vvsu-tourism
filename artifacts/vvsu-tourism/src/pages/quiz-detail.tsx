import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useGetQuiz, useSubmitQuiz, getGetDashboardSummaryQueryKey, getListQuizzesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, ArrowRight, Brain, CheckCircle2, XCircle, Trophy,
  RotateCcw, Sparkles, Clock, Flag, AlertTriangle, BookOpen,
  ChevronRight, Star, Timer, Eye,
} from "lucide-react";

type Phase = "intro" | "active" | "confirm" | "result";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function QuizDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id ?? "0");
  const { data: quiz, isLoading } = useGetQuiz(id);
  const submitMutation = useSubmitQuiz();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof submitMutation.mutateAsync>> | null>(null);
  const [answersSnapshot, setAnswersSnapshot] = useState<Record<number, number>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = quiz?.questions.length ?? 0;
  const answeredCount = Object.keys(answers).length;
  const unansweredIndices = Array.from({ length: total }, (_, i) => i).filter(i => answers[i] == null);
  const flaggedList = Array.from(flagged);

  const doSubmit = useCallback(async (finalAnswers: Record<number, number>) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const ansArr = Array.from({ length: total }, (_, i) => finalAnswers[i] ?? -1);
    try {
      const res = await submitMutation.mutateAsync({ id, data: { answers: ansArr } });
      setResult(res);
      setAnswersSnapshot(finalAnswers);
      setPhase("result");
      void queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
      void queryClient.invalidateQueries({ queryKey: getListQuizzesQueryKey() });
    } catch {
      toast({ title: "Ошибка", description: "Не удалось отправить тест. Попробуйте ещё раз.", variant: "destructive" });
    }
  }, [id, total, submitMutation, queryClient, toast]);

  useEffect(() => {
    if (phase !== "active") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          toast({ title: "Время вышло!", description: "Ответы отправлены автоматически." });
          void doSubmit(answers);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  function startTest() {
    setAnswers({});
    setFlagged(new Set());
    setCurrentIndex(0);
    setTimeLeft((quiz?.estimatedMinutes ?? 10) * 60);
    setPhase("active");
  }

  function restart() {
    setPhase("intro");
    setResult(null);
    setAnswers({});
    setFlagged(new Set());
    setCurrentIndex(0);
  }

  function selectAnswer(idx: number) {
    setAnswers(a => ({ ...a, [currentIndex]: idx }));
  }

  function toggleFlag(i: number) {
    setFlagged(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  const timeRatio = quiz ? timeLeft / (quiz.estimatedMinutes * 60) : 1;
  const timerColor = timeRatio > 0.5 ? "text-secondary" : timeRatio > 0.25 ? "text-yellow-500" : "text-destructive";
  const timerBg = timeRatio > 0.5 ? "bg-secondary/10" : timeRatio > 0.25 ? "bg-yellow-500/10" : "bg-destructive/10";

  /* ── LOADING ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-6 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!quiz) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Тест не найден</div>;
  }

  /* ── INTRO ── */
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-background">
        {/* Mobile sticky back bar */}
        <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <Link href="/cabinet/tasks" className="flex items-center gap-2 text-sm font-semibold text-foreground shrink-0">
            <ArrowLeft className="h-5 w-5" /> Задания
          </Link>
          <span className="text-muted-foreground text-sm truncate">{quiz.title}</span>
        </div>
        <div className="max-w-2xl mx-auto py-6 px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="rounded-2xl border-border/60 overflow-hidden">
              <div className="relative h-44 overflow-hidden">
                <img src={quiz.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"} alt={quiz.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <div className="flex gap-2 mb-2">
                    <Badge className="bg-accent/90 text-white border-0 text-xs">{quiz.category}</Badge>
                    <Badge className="bg-white/20 text-white border-0 text-xs backdrop-blur">{quiz.difficulty === "easy" ? "Лёгкий" : quiz.difficulty === "medium" ? "Средний" : "Сложный"}</Badge>
                  </div>
                  <h1 className="text-2xl font-bold text-white leading-tight">{quiz.title}</h1>
                </div>
              </div>
              <CardContent className="p-6 space-y-6">
                <p className="text-muted-foreground text-sm leading-relaxed">{quiz.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: <Brain className="h-5 w-5 text-accent" />, label: "Вопросов", value: String(quiz.questions.length) },
                    { icon: <Clock className="h-5 w-5 text-blue-500" />, label: "Времени", value: `${quiz.estimatedMinutes} мин` },
                    { icon: <Star className="h-5 w-5 text-yellow-500" />, label: "Награда", value: `${quiz.xpReward} XP` },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="flex flex-col items-center p-4 rounded-2xl bg-muted/40 border border-border/40 text-center gap-2">
                      {icon}
                      <span className="text-lg font-bold text-foreground">{value}</span>
                      <span className="text-xs text-muted-foreground">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Rules */}
                <div className="space-y-2.5 p-4 rounded-2xl bg-accent/5 border border-accent/20">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2"><BookOpen className="h-4 w-4 text-accent" />Правила тестирования</p>
                  {[
                    `На выполнение теста отводится ${quiz.estimatedMinutes} минут`,
                    "По истечении времени ответы отправляются автоматически",
                    "Вы можете вернуться к предыдущим вопросам и изменить ответ",
                    "Используйте флаг 🚩, чтобы отметить вопросы для повторной проверки",
                    `Для успешного прохождения необходимо набрать не менее 60%`,
                  ].map((rule, i) => (
                    <div key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                      <span className="text-accent font-bold shrink-0">{i + 1}.</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>

                <Button onClick={startTest} className="w-full rounded-xl py-5 text-base gap-2 bg-accent hover:bg-accent/90">
                  <Timer className="h-5 w-5" /> Начать тестирование
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── RESULT ── */
  if (phase === "result" && result) {
    const pct = Math.round((result.score / result.total) * 100);
    const passedColor = result.passed ? "from-secondary to-teal-600" : "from-amber-500 to-orange-600";
    return (
      <div className="min-h-screen bg-background">
        {/* Sticky back bar */}
        <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <Link href="/cabinet/tasks" className="flex items-center gap-2 text-sm font-semibold text-foreground shrink-0">
            <ArrowLeft className="h-5 w-5" /> Задания
          </Link>
          <span className="text-muted-foreground text-sm truncate">Результаты: {quiz.title}</span>
        </div>
        <div className="max-w-3xl mx-auto py-6 px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="rounded-2xl border-border/60 overflow-hidden">
              <div className={`bg-gradient-to-br ${passedColor} text-white p-8 text-center`}>
                <Trophy className="h-16 w-16 mx-auto mb-3 opacity-90" />
                <div className="text-6xl font-extrabold mb-1">{pct}%</div>
                <div className="text-xl font-semibold opacity-90 mb-1">{result.score} / {result.total} правильных ответов</div>
                <div className="text-base opacity-80 mb-4">{result.passed ? "Тест успешно пройден! 🎉" : "Попробуйте ещё раз — вы справитесь!"}</div>
                {result.xpEarned > 0 && (
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-5 py-2 rounded-full text-sm font-bold">
                    <Sparkles className="h-4 w-4" /> +{result.xpEarned} XP заработано
                  </div>
                )}
              </div>
              <CardContent className="p-6 space-y-3">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Eye className="h-5 w-5 text-accent" />Разбор ответов</h3>
                {quiz.questions.map((q, i) => {
                  const r = result.results[i];
                  const userIdx = answersSnapshot[i];
                  return (
                    <div key={q.id} className={`p-4 rounded-2xl border ${r.correct ? "border-secondary/30 bg-secondary/5" : "border-destructive/30 bg-destructive/5"}`}>
                      <div className="flex items-start gap-3 mb-3">
                        {r.correct
                          ? <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                          : <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />}
                        <p className="font-semibold text-sm leading-snug">{i + 1}. {q.question}</p>
                      </div>
                      <div className="ml-8 space-y-1 text-sm">
                        <div className="flex gap-2">
                          <span className="text-muted-foreground shrink-0">Ваш ответ:</span>
                          <span className={r.correct ? "text-secondary font-medium" : "text-destructive font-medium line-through"}>
                            {userIdx != null ? q.options[userIdx] : "—"}
                          </span>
                        </div>
                        {!r.correct && (
                          <div className="flex gap-2">
                            <span className="text-muted-foreground shrink-0">Правильно:</span>
                            <span className="text-secondary font-medium">{q.options[r.correctAnswerIndex]}</span>
                          </div>
                        )}
                        {r.explanation && (
                          <p className="text-muted-foreground italic text-xs leading-relaxed pt-1 border-t border-border/30 mt-2">{r.explanation}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div className="flex gap-3 pt-4">
                  <Button onClick={restart} variant="outline" className="rounded-xl flex-1 gap-2">
                    <RotateCcw className="h-4 w-4" /> Пройти ещё раз
                  </Button>
                  <Link href="/cabinet/tasks" className="flex-1">
                    <Button className="rounded-xl w-full gap-2"><ChevronRight className="h-4 w-4" />К списку тестов</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── ACTIVE ── */
  const q = quiz.questions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const isFlagged = flagged.has(currentIndex);
  const progressPct = (answeredCount / total) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border/60 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/cabinet/tasks" className="text-muted-foreground hover:text-foreground shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Тестирование</p>
              <p className="text-sm font-semibold text-foreground truncate">{quiz.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold tabular-nums ${timerBg} ${timerColor} ${timeRatio < 0.25 ? "animate-pulse" : ""}`}>
              <Clock className="h-4 w-4" />
              {formatTime(timeLeft)}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs border-destructive/40 text-destructive hover:bg-destructive/5 hidden sm:flex gap-1.5"
              onClick={() => setShowConfirm(true)}
            >
              <AlertTriangle className="h-3.5 w-3.5" /> Завершить попытку
            </Button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="max-w-5xl mx-auto mt-2">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Отвечено: {answeredCount} из {total}</span>
            <span>{Math.round(progressPct)}%</span>
          </div>
          <Progress value={progressPct} className="h-1.5" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
        {/* Question area */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="rounded-2xl border-border/60">
                <CardContent className="p-6 md:p-8">
                  {/* Question header */}
                  <div className="flex items-start justify-between gap-3 mb-6">
                    <div>
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Вопрос {currentIndex + 1} из {total}</span>
                      <h2 className="text-lg md:text-xl font-semibold mt-1 leading-snug text-foreground">{q.question}</h2>
                    </div>
                    <button
                      onClick={() => toggleFlag(currentIndex)}
                      className={`p-2 rounded-xl transition-colors shrink-0 ${isFlagged ? "bg-amber-500/15 text-amber-600" : "bg-muted text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600"}`}
                      title="Отметить для проверки"
                    >
                      <Flag className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {q.options.map((option, idx) => {
                      const isSelected = currentAnswer === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => selectAnswer(idx)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3.5 group ${
                            isSelected
                              ? "border-accent bg-accent/8 shadow-sm"
                              : "border-border/60 hover:border-accent/40 hover:bg-muted/30"
                          }`}
                        >
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                            isSelected ? "bg-accent text-white" : "bg-muted text-muted-foreground group-hover:bg-accent/10"
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className={`text-sm md:text-base transition-colors ${isSelected ? "text-foreground font-medium" : "text-foreground"}`}>{option}</span>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-accent ml-auto shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-5 border-t border-border/40">
                    <Button
                      variant="outline"
                      className="rounded-xl gap-2"
                      onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                      disabled={currentIndex === 0}
                    >
                      <ArrowLeft className="h-4 w-4" /> Назад
                    </Button>

                    <div className="flex items-center gap-2">
                      {isFlagged && <span className="text-xs text-amber-600 flex items-center gap-1"><Flag className="h-3 w-3" />Отмечен</span>}
                    </div>

                    {currentIndex < total - 1 ? (
                      <Button className="rounded-xl gap-2" onClick={() => setCurrentIndex(i => i + 1)}>
                        Далее <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button className="rounded-xl gap-2 bg-secondary hover:bg-secondary/90" onClick={() => setShowConfirm(true)}>
                        Завершить <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation sidebar */}
        <div className="space-y-4">
          <Card className="rounded-2xl border-border/60 sticky top-[120px]">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Навигация по вопросам</p>

              {/* Question grid */}
              <div className="grid grid-cols-5 gap-1.5 mb-4">
                {quiz.questions.map((_, i) => {
                  const isAnswered = answers[i] != null;
                  const isCurrent = i === currentIndex;
                  const isQ_Flagged = flagged.has(i);
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`relative h-9 rounded-lg text-xs font-bold transition-all border-2 ${
                        isCurrent
                          ? "border-accent bg-accent text-white shadow-sm scale-105"
                          : isAnswered
                          ? "border-secondary/50 bg-secondary/10 text-secondary hover:bg-secondary/20"
                          : "border-border/60 bg-muted/40 text-muted-foreground hover:border-accent/40"
                      }`}
                      title={`Вопрос ${i + 1}${isAnswered ? " · Отвечен" : " · Не отвечен"}${isQ_Flagged ? " · Отмечен" : ""}`}
                    >
                      {i + 1}
                      {isQ_Flagged && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
                          <Flag className="h-1.5 w-1.5 text-white" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="space-y-1.5 text-xs text-muted-foreground border-t border-border/40 pt-3 mb-4">
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-accent inline-block" />Текущий вопрос</div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-secondary/15 border border-secondary/40 inline-block" />Отвечен</div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-muted border border-border/50 inline-block" />Не отвечен</div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-amber-500/80 inline-block" /><Flag className="h-2.5 w-2.5" />Отмечен флагом</div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-center mb-4">
                <div className="p-2 rounded-xl bg-secondary/10 border border-secondary/20">
                  <p className="text-base font-bold text-secondary">{answeredCount}</p>
                  <p className="text-[10px] text-muted-foreground">Отвечено</p>
                </div>
                <div className="p-2 rounded-xl bg-muted/40 border border-border/40">
                  <p className="text-base font-bold text-foreground">{total - answeredCount}</p>
                  <p className="text-[10px] text-muted-foreground">Осталось</p>
                </div>
              </div>

              <Button
                className="w-full rounded-xl gap-2 bg-secondary hover:bg-secondary/90 text-sm"
                onClick={() => setShowConfirm(true)}
              >
                <CheckCircle2 className="h-4 w-4" /> Завершить попытку
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm submit dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> Завершить попытку?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20 text-center">
                <p className="text-xl font-bold text-secondary">{answeredCount}</p>
                <p className="text-xs text-muted-foreground">Отвечено</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border/40 text-center">
                <p className="text-xl font-bold text-foreground">{total - answeredCount}</p>
                <p className="text-xs text-muted-foreground">Не отвечено</p>
              </div>
            </div>

            {unansweredIndices.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-500/8 border border-amber-500/20">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" /> Вопросы без ответа:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {unansweredIndices.map(i => (
                    <button
                      key={i}
                      onClick={() => { setCurrentIndex(i); setShowConfirm(false); }}
                      className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 transition-colors"
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {flaggedList.length > 0 && (
              <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Flag className="h-3.5 w-3.5 text-amber-500" /> Отмечены для проверки: {flaggedList.map(i => i + 1).join(", ")}
                </p>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              {unansweredIndices.length === 0
                ? "Вы ответили на все вопросы. Нажмите «Сдать», чтобы отправить тест."
                : `Вы не ответили на ${unansweredIndices.length} вопр. Пропущенные вопросы будут засчитаны как неверные.`}
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowConfirm(false)} className="rounded-xl">
              Вернуться к тесту
            </Button>
            <Button
              onClick={() => { setShowConfirm(false); void doSubmit(answers); }}
              disabled={submitMutation.isPending}
              className="rounded-xl gap-2 bg-secondary hover:bg-secondary/90"
            >
              <CheckCircle2 className="h-4 w-4" />
              {submitMutation.isPending ? "Отправляем..." : "Сдать тест"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
