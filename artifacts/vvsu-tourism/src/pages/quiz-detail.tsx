import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useGetQuiz, useSubmitQuiz, getGetDashboardSummaryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ArrowRight, Brain, CheckCircle2, XCircle, Trophy, RotateCcw, Sparkles } from "lucide-react";

export default function QuizDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id ?? "0");
  const { data: quiz, isLoading } = useGetQuiz(id);
  const submitMutation = useSubmitQuiz();
  const queryClient = useQueryClient();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof submitMutation.mutateAsync>> | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-6 px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Тест не найден</p>
      </div>
    );
  }

  const total = quiz.questions.length;
  const currentQuestion = quiz.questions[currentIndex];
  const isLast = currentIndex === total - 1;
  const currentAnswer = answers[currentIndex];

  function selectAnswer(idx: number) {
    setAnswers(a => {
      const next = [...a];
      next[currentIndex] = idx;
      return next;
    });
  }

  async function handleSubmit() {
    const res = await submitMutation.mutateAsync({ id, data: { answers } });
    setResult(res);
    setShowResult(true);
    void queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
  }

  function handleNext() {
    if (isLast) {
      void handleSubmit();
    } else {
      setCurrentIndex(i => i + 1);
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    setAnswers([]);
    setShowResult(false);
    setResult(null);
  }

  const progressPct = ((currentIndex + (currentAnswer != null ? 1 : 0)) / total) * 100;

  // RESULT VIEW
  if (showResult && result) {
    const passedColor = result.passed ? "from-emerald-500 to-teal-600" : "from-amber-500 to-orange-600";
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/cabinet/tasks" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" /> К списку тестов
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="rounded-2xl border-border/60 overflow-hidden">
              <div className={`bg-gradient-to-br ${passedColor} text-white p-8 text-center`}>
                <Trophy className="h-16 w-16 mx-auto mb-3 opacity-90" />
                <div className="text-5xl font-extrabold mb-1">
                  {result.score} / {result.total}
                </div>
                <div className="text-lg opacity-90 mb-3">
                  {result.passed ? "Тест успешно пройден!" : "Хорошая попытка — попробуйте ещё раз"}
                </div>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-sm font-semibold">
                  <Sparkles className="h-4 w-4" />
                  +{result.xpEarned} XP заработано
                </div>
              </div>

              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold text-lg mb-3">Разбор ответов</h3>
                {quiz.questions.map((q, i) => {
                  const r = result.results[i];
                  const userIdx = answers[i];
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border ${
                        r.correct
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : "border-rose-500/30 bg-rose-500/5"
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        {r.correct ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div className="font-medium text-sm">
                          {i + 1}. {q.question}
                        </div>
                      </div>
                      <div className="text-xs space-y-1 ml-7">
                        <div>
                          <span className="text-muted-foreground">Ваш ответ: </span>
                          <span className={r.correct ? "text-emerald-700 dark:text-emerald-400 font-medium" : "text-rose-700 dark:text-rose-400 font-medium"}>
                            {q.options[userIdx] ?? "—"}
                          </span>
                        </div>
                        {!r.correct && (
                          <div>
                            <span className="text-muted-foreground">Правильный ответ: </span>
                            <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                              {q.options[r.correctAnswerIndex]}
                            </span>
                          </div>
                        )}
                        <div className="text-muted-foreground italic pt-1 leading-relaxed">
                          {r.explanation}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleRestart} variant="outline" className="rounded-xl flex-1">
                    <RotateCcw className="h-4 w-4 mr-2" /> Пройти ещё раз
                  </Button>
                  <Link href="/cabinet/tasks" className="flex-1">
                    <Button className="rounded-xl w-full">
                      К списку тестов
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // QUIZ VIEW
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/cabinet/tasks" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> К списку тестов
        </Link>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-5 w-5 text-accent" />
            <Badge variant="secondary">{quiz.category}</Badge>
            <span className="text-xs text-muted-foreground">
              Вопрос {currentIndex + 1} из {total}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">{quiz.title}</h1>
          <Progress value={progressPct} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="rounded-2xl border-border/60">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-6 leading-snug">{currentQuestion.question}</h2>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = currentAnswer === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => selectAnswer(idx)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                          isSelected
                            ? "border-accent bg-accent/10"
                            : "border-border/60 hover:border-accent/40 hover:bg-muted/40"
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                            isSelected
                              ? "bg-accent text-accent-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-sm md:text-base">{option}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                    disabled={currentIndex === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Назад
                  </Button>
                  <Button
                    className="rounded-xl"
                    onClick={handleNext}
                    disabled={currentAnswer == null || submitMutation.isPending}
                  >
                    {isLast ? (
                      submitMutation.isPending ? "Проверяем..." : "Завершить тест"
                    ) : (
                      <>
                        Далее <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
