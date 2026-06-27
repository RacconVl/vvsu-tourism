import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, RotateCcw, Star, CheckCircle } from "lucide-react";

type Answer = { text: string; scores: Record<string, number> };
type Question = { question: string; emoji: string; answers: Answer[] };

const questions: Question[] = [
  {
    question: "Что больше всего привлекает тебя в путешествиях?",
    emoji: "✈️",
    answers: [
      { text: "Организация маршрутов и логистики", scores: { tourism: 3, ecotourism: 1 } },
      { text: "Красота природы и экология", scores: { ecotourism: 3, tourism: 1 } },
      { text: "Комфорт и сервис отелей", scores: { hotel: 3 } },
      { text: "Еда и гастрономия разных стран", scores: { gastronomy: 3, tourism: 1 } },
      { text: "Визуальный стиль мест и брендов", scores: { design: 3 } },
    ],
  },
  {
    question: "Какой рабочий день тебе ближе?",
    emoji: "💼",
    answers: [
      { text: "Общение с людьми, переговоры, встречи", scores: { tourism: 2, hotel: 2 } },
      { text: "Разработка визуальных проектов, макеты", scores: { design: 3 } },
      { text: "Полевая работа на природе, экспедиции", scores: { ecotourism: 3 } },
      { text: "Управление командой в ресторане или отеле", scores: { hotel: 2, gastronomy: 2 } },
      { text: "Исследование рынков и написание текстов", scores: { tourism: 2, gastronomy: 2 } },
    ],
  },
  {
    question: "Какой проект тебя бы вдохновил?",
    emoji: "🚀",
    answers: [
      { text: "Создать авторский тур по Приморью", scores: { tourism: 3, ecotourism: 1 } },
      { text: "Разработать фирменный стиль для отеля", scores: { design: 3 } },
      { text: "Открыть экологический лагерь", scores: { ecotourism: 3 } },
      { text: "Запустить ресторан с морепродуктами", scores: { gastronomy: 3 } },
      { text: "Стать менеджером пятизвёздочного отеля", scores: { hotel: 3 } },
    ],
  },
  {
    question: "Какой предмет в школе тебе нравился больше?",
    emoji: "📚",
    answers: [
      { text: "География и история", scores: { tourism: 3, ecotourism: 1 } },
      { text: "Изобразительное искусство и дизайн", scores: { design: 3 } },
      { text: "Биология и экология", scores: { ecotourism: 3 } },
      { text: "Технологии или кулинария", scores: { gastronomy: 3 } },
      { text: "Экономика и менеджмент", scores: { hotel: 3, tourism: 1 } },
    ],
  },
  {
    question: "Что для тебя важнее всего в работе?",
    emoji: "⭐",
    answers: [
      { text: "Путешествия и смена обстановки", scores: { tourism: 3, ecotourism: 2 } },
      { text: "Творческая свобода и самовыражение", scores: { design: 3 } },
      { text: "Помощь природе и устойчивое развитие", scores: { ecotourism: 3 } },
      { text: "Высокий уровень сервиса и атмосфера", scores: { hotel: 2, gastronomy: 2 } },
      { text: "Стабильность и карьерный рост", scores: { hotel: 3 } },
    ],
  },
];

const results: Record<string, { title: string; description: string; emoji: string; color: string; careers: string[]; link: string }> = {
  tourism: {
    title: "Туризм (Бакалавриат)",
    description: "Ты прирождённый организатор и любитель путешествий. Тебе подойдёт специальность «Туризм» — ты будешь разрабатывать маршруты, работать с туристами из разных стран и строить карьеру туроператора или менеджера.",
    emoji: "🗺️",
    color: "#033F7E",
    careers: ["Туроператор", "Турменеджер", "Гид", "Маркетолог туркомпании"],
    link: "/admission",
  },
  hotel: {
    title: "Гостиничное дело (Бакалавриат)",
    description: "Тебе важен первоклассный сервис и управление. Специальность «Гостиничное дело» откроет путь к менеджменту в ведущих отелях Владивостока, Японии и Кореи.",
    emoji: "🏨",
    color: "#EB7124",
    careers: ["Менеджер отеля", "Директор по маркетингу", "Revenue manager", "Администратор"],
    link: "/admission",
  },
  design: {
    title: "Дизайн (Бакалавриат)",
    description: "Ты мыслишь визуально и хочешь создавать. Программа «Дизайн» в нашем институте — это брендинг для туристической индустрии, айдентика отелей и ресторанов, UX-дизайн для travel-приложений.",
    emoji: "🎨",
    color: "#7c3aed",
    careers: ["Дизайнер брендинга", "UX/UI Designer", "Art Director", "Motion Designer"],
    link: "/admission",
  },
  ecotourism: {
    title: "Экологический туризм (Магистратура)",
    description: "Природа и устойчивое развитие — твои приоритеты. Магистратура по экотуризму уникальна в АТР: ты будешь разрабатывать маршруты по Морскому заповеднику и создавать экологически ответственный туризм.",
    emoji: "🌿",
    color: "#16a34a",
    careers: ["Эко-гид", "Менеджер заповедника", "Разработчик эко-маршрутов", "Консультант по устойчивому туризму"],
    link: "/admission",
  },
  gastronomy: {
    title: "Гастрономический туризм (Магистратура)",
    description: "Гастрономия — твоя страсть. Уникальная магистратура объединяет кулинарные традиции, туризм и предпринимательство. Ты будешь разрабатывать гастро-туры и открывать рестораны-аттракции.",
    emoji: "🦀",
    color: "#d97706",
    careers: ["Шеф-гид гастро-туров", "Ресторатор", "Food & Beverage Manager", "Гастрономический критик"],
    link: "/admission",
  },
};

export default function SpecialtyTestPage() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [resultKey, setResultKey] = useState<string | null>(null);

  const q = questions[step];
  const progress = ((step) / questions.length) * 100;

  const handleAnswer = (idx: number, ans: Answer) => {
    setSelected(idx);
    setTimeout(() => {
      const newScores = { ...scores };
      for (const [k, v] of Object.entries(ans.scores)) {
        newScores[k] = (newScores[k] ?? 0) + v;
      }
      const newAnswers = [...answers, idx];
      setAnswers(newAnswers);
      setScores(newScores);
      setSelected(null);
      if (step + 1 >= questions.length) {
        const top = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "tourism";
        setResultKey(top);
      } else {
        setStep(s => s + 1);
      }
    }, 350);
  };

  const reset = () => {
    setStep(0);
    setScores({});
    setSelected(null);
    setAnswers([]);
    setResultKey(null);
  };

  const result = resultKey ? results[resultKey] : null;

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="h-5 w-5 text-accent" />
            <span className="text-muted-foreground uppercase tracking-widest text-xs">Тест</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Какая специальность тебе подходит?</h1>
          <p className="text-muted-foreground mt-2">5 вопросов — и ты узнаешь, куда поступать</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {result ? (
            /* Result */
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <Card className="rounded-2xl border-border/60 overflow-hidden">
                <div className="h-2" style={{ background: result.color }} />
                <CardContent className="p-8 text-center space-y-6">
                  <div className="text-7xl">{result.emoji}</div>
                  <div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Твоя специальность</div>
                    <h2 className="text-2xl font-bold text-foreground mb-3" style={{ color: result.color }}>{result.title}</h2>
                    <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">{result.description}</p>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground mb-3">Куда идут выпускники этой программы:</div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {result.careers.map((c, i) => (
                        <Badge key={i} variant="secondary" className="text-sm px-3 py-1">{c}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <Button asChild className="rounded-full px-8 bg-accent hover:bg-accent/90 text-white">
                      <Link href={result.link}>Узнать о программе <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                    <Button variant="outline" className="rounded-full px-6" onClick={reset}>
                      <RotateCcw className="mr-2 h-4 w-4" /> Пройти снова
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Other results */}
              <div className="mt-6">
                <p className="text-sm text-muted-foreground text-center mb-4">Другие программы института:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(results).filter(([k]) => k !== resultKey).map(([k, r]) => (
                    <Link key={k} href="/admission">
                      <Card className="rounded-xl border-border/60 hover:shadow-md transition-shadow cursor-pointer p-3 text-center">
                        <div className="text-2xl mb-1">{r.emoji}</div>
                        <p className="text-xs font-medium text-foreground leading-tight">{r.title}</p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            /* Question */
            <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>Вопрос {step + 1} из {questions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full bg-accent" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
                </div>
              </div>

              <Card className="rounded-2xl border-border/60">
                <CardContent className="p-8 space-y-6">
                  <div className="text-center">
                    <div className="text-5xl mb-4">{q.emoji}</div>
                    <h2 className="text-xl font-bold text-foreground">{q.question}</h2>
                  </div>
                  <div className="space-y-3">
                    {q.answers.map((ans, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i, ans)}
                        disabled={selected !== null}
                        className={`w-full text-left p-4 rounded-xl border transition-all text-sm font-medium ${
                          selected === i
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border/60 bg-card hover:border-accent/50 hover:bg-accent/5 text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {selected === i ? <CheckCircle className="h-4 w-4 shrink-0 text-accent" /> : <span className="h-4 w-4 shrink-0 rounded-full border-2 border-border" />}
                          {ans.text}
                        </div>
                      </button>
                    ))}
                  </div>
                  {step > 0 && (
                    <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => { setStep(s => s - 1); setAnswers(a => a.slice(0, -1)); }}>
                      <ArrowLeft className="mr-1 h-4 w-4" /> Назад
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
