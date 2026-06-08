import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetCourse,
  useCompleteModule,
  getListCoursesQueryKey,
  getGetDashboardSummaryQueryKey,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckCircle, PlayCircle, Zap, FlaskConical, Star, Clock,
  ArrowLeft, Trophy, Sparkles, ChevronRight, BookOpen, BarChart3,
  FileText, Lock, CheckSquare,
} from "lucide-react";

/* ── Module content library ──────────────────────────────────────────── */

type VideoData = { summary: string; keyPoints: string[] };
type InteractiveData = { intro: string; tasks: string[] };
type AnimationData = { summary: string; facts: { label: string; value: string; desc: string }[] };
type TestData = { questions: { question: string; options: string[]; answer: number; explanation: string }[] };
type ModuleContent =
  | { kind: "video"; data: VideoData }
  | { kind: "interactive"; data: InteractiveData }
  | { kind: "animation"; data: AnimationData }
  | { kind: "test"; data: TestData };

const CONTENT: Record<number, ModuleContent> = {
  /* ── Course 1: Введение в туризм Владивостока ── */
  1: { kind: "video", data: { summary: "Владивосток — жемчужина Дальнего Востока и один из наиболее динамичных туристических центров России. В этом уроке вы познакомитесь с историей формирования города как туристического направления.", keyPoints: ["Владивосток основан в 1860 году как военный пост; в 1871-м стал главной базой Тихоокеанского флота России", "К концу XIX века превратился в крупнейший торговый порт Дальнего Востока с населением из 60+ национальностей", "В советский период (1952–1991) город был закрытым — иностранцы въезжать не могли", "Открытие города в 1992 году дало толчок туризму; масштабное ускорение произошло к саммиту АТЭС-2012", "Сегодня Владивосток принимает 1,2+ млн туристов в год, в том числе 350 000+ из АТР"] } },
  2: { kind: "interactive", data: { intro: "Владивосток расположен на полуострове Муравьёва-Амурского и отличается уникальным рельефом с множеством бухт, островов и перешейков. Выполните задания ниже, чтобы закрепить знания о топографии города.", tasks: ["Изучить карту основных акваторий: бухта Золотой Рог (деловой центр), Амурский залив (запад), Уссурийский залив (восток)", "Запомнить ключевые острова архипелага Петра Великого: Русский, Попова, Рейнеке, Путятина — и их туристический потенциал", "Разобрать инфраструктуру мостов: Золотой мост (2012) и мост на Русский остров — один из длиннейших вантовых мостов мира"] } },
  3: { kind: "video", data: { summary: "Развитая туристическая инфраструктура — ключевой фактор привлекательности направления. В этом уроке рассматриваем, что предлагает Владивосток своим гостям.", keyPoints: ["Авиация: аэропорт Кневичи — рейсы из Москвы, Сеула, Пекина, Токио, Харбина и 30+ городов", "Размещение: 150+ объектов от хостелов до отелей 5★ — Hyundai, Azimut, Lotte, VC Hotel", "Гастрономия: 300+ ресторанов; специализация — морепродукты Японского моря, паназиатская и авторская кухня", "Транспорт: городские автобусы, каршеринг, паромы на острова, фуникулёр в центре города", "Аттракции: Приморский океанариум, форты, маяки, острова, Музей Тихоокеанского флота"] } },
  4: { kind: "animation", data: { summary: "Понимание целевой аудитории — основа туристического маркетинга. Владивосток привлекает несколько сегментов туристов с разными мотивациями и поведением.", facts: [{ label: "Внутренние туристы", value: "62%", desc: "Жители Москвы, Сибири и Дальнего Востока. Мотивация: природа, морепродукты, азиатская атмосфера" }, { label: "Туристы из АТР", value: "28%", desc: "Китай, Корея, Япония, Вьетнам. Мотивация: шопинг, культурный обмен, природный туризм" }, { label: "Дальние рынки", value: "10%", desc: "Европа, Северная Америка, Австралия. Мотивация: уникальность, Транссиб, аутентичность" }] } },
  5: { kind: "test", data: { questions: [{ question: "В каком году Владивосток был основан как военный пост?", options: ["1847", "1856", "1860", "1875"], answer: 2, explanation: "Владивосток основан 2 июля 1860 года как военный пост Российской империи на берегу бухты Золотой Рог." }, { question: "Какой мост был построен к саммиту АТЭС-2012?", options: ["Золотой мост", "Мост на Русский остров", "Амурский мост", "Тихоокеанский мост"], answer: 1, explanation: "К саммиту АТЭС-2012 был построен мост на Русский остров — один из самых длинных вантовых мостов мира (центральный пролёт 1104 м)." }, { question: "Какой процент туристов Владивостока составляют гости из АТР?", options: ["10%", "18%", "28%", "45%"], answer: 2, explanation: "По данным Приморского туристического комитета, около 28% туристов — гости из Азиатско-Тихоокеанского региона: Китая, Кореи, Японии и Вьетнама." }] } },
  /* ── Course 2: Туристический маркетинг ── */
  6: { kind: "video", data: { summary: "Современный туристический маркетинг начинается с глубокого понимания, кто ваш турист и почему он выбирает именно ваш продукт. Анализ аудитории — фундамент любой стратегии.", keyPoints: ["Сегментация туристов по психографике: приключенцы, культурные туристы, гастрономы, любители природы, деловые гости", "Customer Journey Map: путь туриста от осознания потребности до возвращения и отзыва", "Методы исследования: опросы, глубинные интервью, анализ отзывов на Booking и TripAdvisor", "Сезонность рынка Владивостока: пик — июль/август; зимний туризм развивается за счёт Нового года", "Конкурентный анализ: Сочи, Байкал, Калининград как альтернативные внутренние направления"] } },
  7: { kind: "interactive", data: { intro: "Цифровой маркетинг открывает туристическим брендам беспрецедентные возможности. Освойте ключевые инструменты онлайн-продвижения туристического продукта.", tasks: ["SEO-оптимизация туристического сайта: ключевые слова («отдых во Владивостоке», «тур в Приморье»), структура URL, мета-теги", "Контент-стратегия: блог, фото/видео о локациях, гиды по достопримечательностям, истории реальных туристов", "Аналитика: Яндекс.Метрика + Google Analytics — отслеживать источники трафика, конверсии, поведение пользователей"] } },
  8: { kind: "video", data: { summary: "Социальные сети — главный канал продвижения туристических направлений. Узнайте, как выстроить эффективную SMM-стратегию для туристического бренда.", keyPoints: ["ВКонтакте — основная площадка для российских туристов; форматы: фото-посты, рилсы, истории", "VK Reels: видео 15–60 сек о локациях получают в 3× больше охвата, чем статичные фото", "Telegram-каналы: эффективны для B2B и лояльных подписчиков; конверсия в бронирование выше на 40%", "Контент-план: 3 поста в неделю, 1 рилс, 5 историй — оптимальная частота для туристического бренда", "UGC-кампании: репосты фото гостей + хэштеги повышают доверие к бренду на 72% (Nielsen)"] } },
  9: { kind: "animation", data: { summary: "Работа с инфлюенсерами — один из наиболее рентабельных каналов продвижения туристических направлений в эпоху социальных медиа.", facts: [{ label: "ROI инфлюенсер-маркетинга", value: "6,5×", desc: "На каждый вложенный рубль турбренды получают в среднем 6,5 рублей дохода" }, { label: "Охват одной кампании", value: "2–5M", desc: "Средний охват интеграции с тревел-блогером категории 100K+ подписчиков" }, { label: "Рост бронирований", value: "+34%", desc: "Рост бронирований после крупной инфлюенсер-кампании у туроператоров Приморья (2023)" }] } },
  10: { kind: "interactive", data: { intro: "Туристический бренд — это эмоциональное обещание путешественнику. Владивосток строит свой бренд вокруг уникального сочетания природы, культуры и азиатского колорита.", tasks: ["Сформулировать УТП туристического продукта: чем он отличается от конкурирующих направлений?", "Разработать визуальную концепцию бренда: фирменные цвета, образы, символы Владивостока", "Определить tone-of-voice: как бренд говорит с туристом — дерзко, романтично, приключенчески?"] } },
  11: { kind: "test", data: { questions: [{ question: "Какой показатель лучше всего характеризует эффективность инфлюенсер-кампании?", options: ["Количество подписчиков", "Engagement Rate (ER)", "Число публикаций", "Размер бюджета"], answer: 1, explanation: "Engagement Rate (коэффициент вовлечённости) показывает отношение реакций к охвату и является ключевым показателем качества аудитории блогера." }, { question: "Какая платформа наиболее эффективна для B2B в туризме в России?", options: ["TikTok", "Telegram", "Pinterest", "YouTube"], answer: 1, explanation: "Telegram-каналы показывают наивысшую конверсию в продажи для B2B в туристической сфере." }, { question: "Что такое UGC в туристическом маркетинге?", options: ["Уникальный географический контент", "Пользовательский контент (фото, видео, отзывы туристов)", "Унифицированный гид для курьера", "Управление гостевыми комментариями"], answer: 1, explanation: "UGC (User-Generated Content) — контент, созданный туристами. Воспринимается как более доверенный, чем официальная реклама." }] } },
  /* ── Course 3: Разработка туристических маршрутов ── */
  12: { kind: "video", data: { summary: "Разработка туристического маршрута — это искусство сочетания логистики, эмоций и образования. Методология включает несколько ключевых этапов от идеи до готового продукта.", keyPoints: ["Анализ ресурсов территории: природные, культурные, гастрономические, инфраструктурные объекты", "Определение целевой аудитории: длительность, физическая нагрузка, ценовой диапазон", "Проектирование маршрута: логика перемещений, ритм (активность + отдых), акценты и кульминации", "Тестирование маршрута: пробное прохождение, сбор обратной связи, корректировка тайминга", "Паспорт маршрута: документ с описанием, картой, контактами поставщиков и ценами"] } },
  13: { kind: "interactive", data: { intro: "Поставщики туристических услуг — отели, рестораны, гиды, транспортные компании — это партнёры, от которых зависит качество вашего маршрута.", tasks: ["Составить критерии выбора поставщика: надёжность, ценообразование, гибкость, страховка и лицензии", "Изучить типы договоров: агентский договор, аллотмент, фрифлоу, блок-чартер", "Проработать контроль качества: чек-листы, mystery shopper, регулярные встречи с партнёрами"] } },
  14: { kind: "animation", data: { summary: "Правильное ценообразование туристического маршрута — это баланс между прибыльностью для оператора и ценностью для туриста.", facts: [{ label: "Себестоимость", value: "60–65%", desc: "Транспорт, размещение, питание, гиды, входные билеты в объекты показа" }, { label: "Накладные расходы", value: "10–15%", desc: "Маркетинг, офис, страхование ответственности, управление и резервы" }, { label: "Прибыль туроператора", value: "15–25%", desc: "Целевая маржинальность качественного туристического продукта" }] } },
};

function getDefaultContent(type: string, title: string): ModuleContent {
  if (type === "video") return { kind: "video", data: { summary: `Этот урок посвящён теме «${title}». Изучите ключевые концепции и запомните важные факты.`, keyPoints: ["Изучите основные понятия и термины модуля", "Ознакомьтесь с практическими примерами из туристической отрасли", "Запомните ключевые показатели и метрики", "Разберите типичные ошибки и как их избежать", "Применяйте полученные знания в практических заданиях"] } };
  if (type === "interactive") return { kind: "interactive", data: { intro: `Практическое задание по теме «${title}». Выполните все задания для завершения модуля.`, tasks: ["Прочитайте теоретическую часть и запомните ключевые концепции", "Выполните предложенные упражнения, опираясь на материалы урока", "Подведите итоги и сформулируйте главные выводы по теме"] } };
  if (type === "animation") return { kind: "animation", data: { summary: `Визуальный обзор по теме «${title}» с ключевыми статистическими данными отрасли.`, facts: [{ label: "Рост рынка", value: "+12%", desc: "Среднегодовой рост туристического рынка Приморского края" }, { label: "Удовлетворённость", value: "87%", desc: "Туристов оценивают свой опыт во Владивостоке положительно" }, { label: "Возврат туристов", value: "43%", desc: "Гостей возвращаются во Владивосток повторно" }] } };
  return { kind: "test", data: { questions: [{ question: "Что является ключевым фактором успеха туристического продукта?", options: ["Низкая цена", "Качество обслуживания и уникальность", "Реклама в СМИ", "Количество объектов"], answer: 1, explanation: "Качество обслуживания и уникальность продукта — главные драйверы лояльности туристов." }] } };
}

/* ── Icon helpers ──────────────────────────────────────────────────── */
const typeIcon: Record<string, React.ReactNode> = {
  video: <PlayCircle className="h-4 w-4" />,
  interactive: <Zap className="h-4 w-4" />,
  animation: <BarChart3 className="h-4 w-4" />,
  test: <FlaskConical className="h-4 w-4" />,
};
const typeLabel: Record<string, string> = {
  video: "Видеоурок", interactive: "Практика", animation: "Инфографика", test: "Тест",
};
const typeColor: Record<string, string> = {
  video: "text-blue-500", interactive: "text-accent", animation: "text-purple-500", test: "text-yellow-500",
};

/* ── Sub-components ─────────────────────────────────────────────────── */

function VideoPlayer({ data, module, onComplete, isPending }: { data: VideoData; module: { isCompleted: boolean; xpReward: number }; onComplete: () => void; isPending: boolean }) {
  const [watched, setWatched] = useState(false);
  return (
    <div className="space-y-5">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-secondary/70 cursor-pointer group" onClick={() => setWatched(true)}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <div className={`h-16 w-16 rounded-full flex items-center justify-center transition-colors ${watched ? "bg-secondary/80" : "bg-white/20 group-hover:bg-white/30"}`}>
              {watched ? <CheckCircle className="h-8 w-8 text-white" /> : <PlayCircle className="h-8 w-8 text-white" />}
            </div>
          </motion.div>
          <p className="text-white/80 text-sm">{watched ? "Просмотрено ✓" : "Нажмите для просмотра"}</p>
        </div>
        {watched && <div className="absolute inset-0 bg-secondary/20" />}
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">{data.summary}</p>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground flex items-center gap-2"><BookOpen className="h-4 w-4 text-accent" /> Ключевые тезисы урока</p>
        {data.keyPoints.map((point, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
            <div className="flex gap-3 p-3 rounded-xl bg-muted/40 border border-border/40">
              <span className="text-accent font-bold text-sm shrink-0">{i + 1}.</span>
              <p className="text-sm text-foreground leading-relaxed">{point}</p>
            </div>
          </motion.div>
        ))}
      </div>
      {!module.isCompleted && (
        <Button onClick={onComplete} disabled={isPending || !watched} className="w-full rounded-xl gap-2 text-base py-5">
          <CheckCircle className="h-5 w-5" />
          {watched ? `Урок пройден · +${module.xpReward} XP` : "Просмотрите урок, чтобы завершить"}
        </Button>
      )}
    </div>
  );
}

function InteractiveLesson({ data, module, onComplete, isPending }: { data: InteractiveData; module: { isCompleted: boolean; xpReward: number }; onComplete: () => void; isPending: boolean }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const allDone = checked.size === data.tasks.length;
  const toggle = (i: number) => setChecked(prev => { const next = new Set(prev); next.has(i) ? next.delete(i) : next.add(i); return next; });
  return (
    <div className="space-y-5">
      <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20">
        <p className="text-sm text-foreground leading-relaxed">{data.intro}</p>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground flex items-center gap-2"><CheckSquare className="h-4 w-4 text-accent" /> Выполните все задания</p>
        {data.tasks.map((task, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <label className={`flex gap-3 p-4 rounded-xl border cursor-pointer transition-all ${checked.has(i) ? "bg-secondary/5 border-secondary/30" : "bg-card border-border/60 hover:border-accent/30"}`}>
              <Checkbox checked={checked.has(i)} onCheckedChange={() => toggle(i)} className="mt-0.5 shrink-0" />
              <div className="flex-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Задание {i + 1}</span>
                <p className={`text-sm mt-0.5 leading-relaxed transition-colors ${checked.has(i) ? "text-muted-foreground line-through" : "text-foreground"}`}>{task}</p>
              </div>
              {checked.has(i) && <CheckCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />}
            </label>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Progress value={(checked.size / data.tasks.length) * 100} className="h-2 flex-1" />
        <span className="text-xs text-muted-foreground shrink-0">{checked.size}/{data.tasks.length}</span>
      </div>
      {!module.isCompleted && (
        <Button onClick={onComplete} disabled={isPending || !allDone} className="w-full rounded-xl gap-2 text-base py-5">
          <Zap className="h-5 w-5" />
          {allDone ? `Задания выполнены · +${module.xpReward} XP` : `Выполните все ${data.tasks.length} задания`}
        </Button>
      )}
    </div>
  );
}

function AnimationLesson({ data, module, onComplete, isPending }: { data: AnimationData; module: { isCompleted: boolean; xpReward: number }; onComplete: () => void; isPending: boolean }) {
  const [explored, setExplored] = useState<Set<number>>(new Set());
  const allExplored = explored.size === data.facts.length;
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground leading-relaxed">{data.summary}</p>
      <div className="grid gap-4">
        {data.facts.map((fact, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.12 }}>
            <button onClick={() => setExplored(prev => new Set([...prev, i]))} className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${explored.has(i) ? "border-secondary/40 bg-secondary/5" : "border-border/60 bg-card hover:border-primary/30 hover:bg-muted/30"}`}>
              <div className="flex items-start gap-4">
                <div className={`text-3xl font-extrabold shrink-0 ${explored.has(i) ? "text-secondary" : "text-primary"}`}>{fact.value}</div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{fact.label}</p>
                  <AnimatePresence>
                    {explored.has(i) && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-xs text-muted-foreground mt-1 leading-relaxed">{fact.desc}</motion.p>
                    )}
                  </AnimatePresence>
                  {!explored.has(i) && <p className="text-xs text-muted-foreground mt-1">Нажмите, чтобы узнать подробнее →</p>}
                </div>
                {explored.has(i) && <CheckCircle className="h-5 w-5 text-secondary shrink-0" />}
              </div>
            </button>
          </motion.div>
        ))}
      </div>
      {!module.isCompleted && (
        <Button onClick={onComplete} disabled={isPending || !allExplored} className="w-full rounded-xl gap-2 text-base py-5">
          <Sparkles className="h-5 w-5" />
          {allExplored ? `Инфографика изучена · +${module.xpReward} XP` : `Откройте все ${data.facts.length} блока`}
        </Button>
      )}
    </div>
  );
}

function TestLesson({ data, module, onComplete, isPending }: { data: TestData; module: { isCompleted: boolean; xpReward: number }; onComplete: () => void; isPending: boolean }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const allAnswered = Object.keys(answers).length === data.questions.length;
  const score = submitted ? data.questions.filter((q, i) => answers[i] === q.answer).length : 0;
  const passed = score / data.questions.length >= 0.6;

  const handleSubmit = () => setSubmitted(true);
  const handleRetry = () => { setAnswers({}); setSubmitted(false); };

  return (
    <div className="space-y-5">
      {submitted ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`p-6 rounded-2xl text-center ${passed ? "bg-secondary/10 border border-secondary/30" : "bg-destructive/5 border border-destructive/20"}`}>
          <Trophy className={`h-10 w-10 mx-auto mb-2 ${passed ? "text-secondary" : "text-muted-foreground"}`} />
          <p className="text-2xl font-extrabold">{score}/{data.questions.length}</p>
          <p className="text-sm text-muted-foreground mt-1">{passed ? "Тест сдан! Отличная работа." : "Недостаточно баллов. Попробуйте ещё раз."}</p>
          {!passed && <Button onClick={handleRetry} variant="outline" className="mt-3 rounded-xl">Пройти ещё раз</Button>}
        </motion.div>
      ) : null}

      <div className="space-y-5">
        {data.questions.map((q, qi) => (
          <div key={qi} className={`space-y-2 ${submitted && answers[qi] !== q.answer ? "opacity-100" : ""}`}>
            <p className="text-sm font-semibold text-foreground">{qi + 1}. {q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const isSelected = answers[qi] === oi;
                const isCorrect = oi === q.answer;
                let cls = "w-full text-left p-3 rounded-xl border-2 text-sm transition-all flex items-center gap-3 ";
                if (!submitted) cls += isSelected ? "border-primary bg-primary/5 text-foreground" : "border-border/60 hover:border-primary/40 text-foreground";
                else if (isCorrect) cls += "border-secondary bg-secondary/10 text-foreground";
                else if (isSelected) cls += "border-destructive bg-destructive/5 text-foreground";
                else cls += "border-border/40 text-muted-foreground";
                return (
                  <button key={oi} disabled={submitted} onClick={() => setAnswers(prev => ({ ...prev, [qi]: oi }))} className={cls}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${!submitted ? (isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground") : isCorrect ? "bg-secondary text-white" : isSelected ? "bg-destructive text-white" : "bg-muted text-muted-foreground"}`}>{String.fromCharCode(65 + oi)}</span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {submitted && <p className={`text-xs p-2 rounded-lg ${answers[qi] === q.answer ? "bg-secondary/10 text-secondary" : "bg-muted/50 text-muted-foreground"}`}>{q.explanation}</p>}
          </div>
        ))}
      </div>

      {!submitted && !module.isCompleted && (
        <Button onClick={handleSubmit} disabled={!allAnswered} className="w-full rounded-xl gap-2 text-base py-5">
          <FlaskConical className="h-5 w-5" />
          {allAnswered ? "Проверить ответы" : `Ответьте на все ${data.questions.length} вопроса`}
        </Button>
      )}
      {submitted && passed && !module.isCompleted && (
        <Button onClick={onComplete} disabled={isPending} className="w-full rounded-xl gap-2 text-base py-5 bg-secondary hover:bg-secondary/90">
          <Trophy className="h-5 w-5" />
          Завершить тест · +{module.xpReward} XP
        </Button>
      )}
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────── */

export default function CourseDetail() {
  const params = useParams<{ id: string }>();
  const courseId = parseInt(params.id ?? "0", 10);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: course, isLoading } = useGetCourse(courseId);
  const completeModule = useCompleteModule();

  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);

  useEffect(() => {
    if (course?.modules && selectedModuleId === null) {
      const first = course.modules.find(m => !m.isCompleted) ?? course.modules[0];
      if (first) setSelectedModuleId(first.id);
    }
  }, [course?.modules, selectedModuleId]);

  const selectedModule = course?.modules?.find(m => m.id === selectedModuleId);

  const handleSelectModule = (id: number) => setSelectedModuleId(id);

  const handleCompleteModule = (moduleId: number) => {
    completeModule.mutate({ id: moduleId }, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() });
        queryClient.invalidateQueries({ queryKey: ["getCourse", courseId] });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        if (data.xpEarned > 0) {
          toast({ title: `+${data.xpEarned} XP заработано!`, description: "Модуль успешно завершён. Продолжайте!" });
          const modules = course?.modules ?? [];
          const idx = modules.findIndex(m => m.id === moduleId);
          const next = modules[idx + 1];
          if (next) setTimeout(() => setSelectedModuleId(next.id), 600);
        }
      },
    });
  };

  const progress = course && course.totalModules > 0
    ? Math.round((course.completedModules / course.totalModules) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-56 w-full rounded-2xl" />
        <div className="grid grid-cols-[280px_1fr] gap-6">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!course) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Курс не найден</div>;
  }

  const moduleContent: ModuleContent = selectedModule
    ? (CONTENT[selectedModule.id] ?? getDefaultContent(selectedModule.type, selectedModule.title))
    : getDefaultContent("video", "");

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sticky back bar */}
      <div className="md:hidden sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/cabinet/courses" className="flex items-center gap-2 text-sm font-semibold text-foreground shrink-0">
          <ArrowLeft className="h-5 w-5" /> Курсы
        </Link>
        <span className="text-muted-foreground text-sm truncate">{course.title}</span>
      </div>

      {/* Hero */}
      <div className="relative h-56 overflow-hidden">
        <img src={course.imageUrl || "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200"} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <Link href="/cabinet/courses">
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white mb-3 w-fit gap-1.5 -ml-2">
              <ArrowLeft className="h-4 w-4" /> Назад к курсам
            </Button>
          </Link>
          <Badge className="w-fit mb-2 bg-accent text-white border-0 text-xs">{course.stage}</Badge>
          <h1 className="text-2xl font-bold text-white leading-tight">{course.title}</h1>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-white/80 text-xs"><FileText className="h-3.5 w-3.5" />{course.totalModules} модулей</div>
            <div className="flex items-center gap-1.5 text-white/80 text-xs"><Star className="h-3.5 w-3.5 text-yellow-300" />{course.xpReward} XP</div>
            <div className="flex items-center gap-1.5 text-white/80 text-xs"><CheckCircle className="h-3.5 w-3.5 text-secondary" />{course.completedModules}/{course.totalModules} пройдено</div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Progress value={progress} className="h-1.5 flex-1 max-w-xs bg-white/20" />
            <span className="text-white/70 text-xs">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Content layout */}
      <div className="flex flex-col lg:flex-row gap-0 min-h-[calc(100vh-224px)]">
        {/* Sidebar */}
        <div className="lg:w-72 xl:w-80 shrink-0 border-r border-border/60 bg-card/40">
          <div className="p-4 border-b border-border/40">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Содержание курса</p>
          </div>
          <div className="overflow-y-auto">
            {course.modules?.map((mod, i) => {
              const isSelected = mod.id === selectedModuleId;
              return (
                <button
                  key={mod.id}
                  onClick={() => handleSelectModule(mod.id)}
                  className={`w-full text-left px-4 py-3.5 border-b border-border/30 flex items-start gap-3 transition-all group ${isSelected ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-muted/40"}`}
                >
                  <div className="shrink-0 mt-0.5">
                    {mod.isCompleted
                      ? <CheckCircle className="h-5 w-5 text-secondary" />
                      : <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${isSelected ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>{i + 1}</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium leading-tight line-clamp-2 ${mod.isCompleted ? "text-muted-foreground" : isSelected ? "text-primary" : "text-foreground"}`}>{mod.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] flex items-center gap-1 ${typeColor[mod.type] ?? "text-muted-foreground"}`}>{typeIcon[mod.type]}{typeLabel[mod.type]}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Clock className="h-3 w-3" />{mod.durationMinutes}м</span>
                      <span className="text-[10px] text-accent font-semibold">+{mod.xpReward}XP</span>
                    </div>
                  </div>
                  {isSelected && <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
          {progress === 100 && (
            <div className="p-4 m-4 rounded-2xl bg-secondary/10 border border-secondary/30 text-center">
              <Trophy className="h-8 w-8 text-secondary mx-auto mb-2" />
              <p className="text-sm font-bold text-secondary">Курс завершён!</p>
              <p className="text-xs text-muted-foreground mt-1">Все модули пройдены. Отличная работа!</p>
            </div>
          )}
        </div>

        {/* Module content */}
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {selectedModule ? (
            <AnimatePresence mode="wait">
              <motion.div key={selectedModule.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                {/* Module header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-muted ${typeColor[selectedModule.type]}`}>
                      {typeIcon[selectedModule.type]}{typeLabel[selectedModule.type]}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{selectedModule.durationMinutes} мин</span>
                    <span className="text-xs text-accent font-semibold flex items-center gap-1"><Star className="h-3.5 w-3.5" />+{selectedModule.xpReward} XP</span>
                    {selectedModule.isCompleted && <Badge variant="secondary" className="text-[10px] gap-1"><CheckCircle className="h-3 w-3" />Пройдено</Badge>}
                  </div>
                  <h2 className="text-xl font-bold text-foreground leading-tight">{selectedModule.title}</h2>
                </div>

                {/* Completed overlay */}
                {selectedModule.isCompleted && (
                  <div className="mb-4 p-3 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center gap-2 text-sm text-secondary">
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    Этот модуль уже пройден. Вы можете повторить материал.
                  </div>
                )}

                {/* Type-specific content */}
                {moduleContent.kind === "video" && (
                  <VideoPlayer data={moduleContent.data} module={selectedModule} onComplete={() => handleCompleteModule(selectedModule.id)} isPending={completeModule.isPending} />
                )}
                {moduleContent.kind === "interactive" && (
                  <InteractiveLesson data={moduleContent.data} module={selectedModule} onComplete={() => handleCompleteModule(selectedModule.id)} isPending={completeModule.isPending} />
                )}
                {moduleContent.kind === "animation" && (
                  <AnimationLesson data={moduleContent.data} module={selectedModule} onComplete={() => handleCompleteModule(selectedModule.id)} isPending={completeModule.isPending} />
                )}
                {moduleContent.kind === "test" && (
                  <TestLesson data={moduleContent.data} module={selectedModule} onComplete={() => handleCompleteModule(selectedModule.id)} isPending={completeModule.isPending} />
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <BookOpen className="h-12 w-12 mb-3 opacity-30" />
              <p>Выберите модуль слева</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
