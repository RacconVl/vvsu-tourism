import { motion } from "framer-motion";
import { useGetLeaderboard } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Star, Compass, Flame, Gift, MapPin, Swords, ArrowRight, CheckCircle, Lightbulb, Route, Palette, Megaphone } from "lucide-react";
import { Link } from "wouter";

const roleLabels: Record<string, string> = {
  guide: "Экскурсовод",
  marketer: "Маркетолог",
  designer: "Дизайнер",
  operator: "Туроператор",
};

const rankStyle = (rank: number) => {
  if (rank === 1) return { bg: "from-yellow-400 to-amber-500", text: "text-yellow-600", medal: "🥇" };
  if (rank === 2) return { bg: "from-gray-300 to-gray-400", text: "text-gray-500", medal: "🥈" };
  if (rank === 3) return { bg: "from-amber-600 to-amber-700", text: "text-amber-600", medal: "🥉" };
  return { bg: "", text: "text-muted-foreground", medal: `#${rank}` };
};

const questExamples = [
  {
    icon: <Route className="h-5 w-5" />,
    type: "Маршрут",
    color: "bg-teal-100 text-teal-700",
    title: "Маршрут по Золотому Рогу",
    desc: "Разработайте однодневный туристический маршрут по набережной с 5 ключевыми достопримечательностями",
    location: "Бухта Золотой Рог",
    difficulty: "Лёгкий",
    diffColor: "text-green-600",
    xp: 100,
  },
  {
    icon: <Megaphone className="h-5 w-5" />,
    type: "Маркетинг",
    color: "bg-purple-100 text-purple-700",
    title: "SMM-кампания для сафари-парка",
    desc: "Создайте концепцию SMM-кампании для привлечения туристов в Приморский сафари-парк",
    location: "Приморский сафари-парк",
    difficulty: "Средний",
    diffColor: "text-amber-600",
    xp: 175,
  },
  {
    icon: <Palette className="h-5 w-5" />,
    type: "Дизайн",
    color: "bg-rose-100 text-rose-700",
    title: "Фирменный стиль отеля на мысе Тобизина",
    desc: "Разработайте концепцию визуального стиля для бутик-отеля: цвета, логотип, айдентика",
    location: "Мыс Тобизина",
    difficulty: "Сложный",
    diffColor: "text-red-600",
    xp: 250,
  },
  {
    icon: <Route className="h-5 w-5" />,
    type: "Маршрут",
    color: "bg-teal-100 text-teal-700",
    title: "Экомаршрут по Морскому заповеднику",
    desc: "Разработайте эко-тур с минимальным воздействием на природу и образовательными элементами",
    location: "Морской заповедник",
    difficulty: "Сложный",
    diffColor: "text-red-600",
    xp: 300,
  },
];

const successStories = [
  {
    avatar: "/avatars/student-3.png",
    name: "Дарья Ким",
    course: "3-й курс, специальность «Туризм»",
    story: "Выполнила 12 квестов за семестр, набрала 2 400 XP и обменяла их на худи ВВГУ с символикой института. «Квесты помогли мне сделать реальные кейсы для резюме — теперь у меня есть портфолио ещё до выпуска»",
    xp: 2400,
    quests: 12,
    reward: "Худи ВВГУ",
    rewardEmoji: "👕",
  },
  {
    avatar: "/avatars/student-2.png",
    name: "Максим Соколов",
    course: "4-й курс, специальность «Туроперейтинг»",
    story: "18 выполненных квестов и 4 100 XP позволили Максиму получить билет на международную конференцию «Туризм АТР-2024» во Владивостоке. «Это открыло мне контакты с работодателями из Кореи и Японии»",
    xp: 4100,
    quests: 18,
    reward: "Билет на конференцию",
    rewardEmoji: "🎫",
  },
  {
    avatar: "/avatars/student-5.png",
    name: "Юна Пак",
    course: "2-й курс, специальность «Гостиничный сервис»",
    story: "Начав со 2-го курса, Юна уже набрала 1 600 XP за 8 квестов и обменяла их на фирменный рюкзак и блокнот. «Я вошла в топ-10 рейтинга — это мотивирует учиться ещё активнее»",
    xp: 1600,
    quests: 8,
    reward: "Рюкзак + блокнот ВВГУ",
    rewardEmoji: "🎒",
  },
];

const storeItems = [
  { name: "Кепка ВВГУ", xp: 500, emoji: "🧢" },
  { name: "Блокнот + ручка", xp: 750, emoji: "📓" },
  { name: "Худи института", xp: 2000, emoji: "👕" },
  { name: "Рюкзак ВВГУ", xp: 3000, emoji: "🎒" },
  { name: "Билет на конференцию", xp: 4000, emoji: "🎫" },
  { name: "Стажировка в партнёрской компании", xp: 6000, emoji: "🏢" },
];

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useGetLeaderboard();

  const top3 = leaderboard?.slice(0, 3) ?? [];
  const rest = leaderboard?.slice(3) ?? [];

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ───────────────────────────────────────────── */}
      <div className="py-10 px-4 border-b border-border/40" style={{ background: "linear-gradient(135deg, #0057B8 0%, #0057B8 70%, #0891b2 100%)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-3 mb-3">
              <Trophy className="h-7 w-7 text-amber-400" />
              <span className="text-white/60 uppercase tracking-widest text-xs">Рейтинг</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Зал славы</h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              Выполняй квесты, копи XP и обменивай баллы на фирменную атрибутику ВВГУ
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-16">

        {/* ── Как работает система ───────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="h-5 w-5 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Как работает система баллов</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: "01", icon: <Compass className="h-6 w-6" />, title: "Выбери квест", desc: "Реальные задания по туризму, маркетингу, дизайну и бюджетированию во Владивостоке", color: "#0057B8" },
              { step: "02", icon: <CheckCircle className="h-6 w-6" />, title: "Выполни задание", desc: "Отправь решение через личный кабинет — преподаватели проверяют работу", color: "#EB7124" },
              { step: "03", icon: <Star className="h-6 w-6" />, title: "Получи XP", desc: "За каждый квест начисляются баллы опыта: от 100 до 300 XP в зависимости от сложности", color: "#7c3aed" },
              { step: "04", icon: <Gift className="h-6 w-6" />, title: "Обменяй на имиджку", desc: "Накопленные XP можно обменять в деканате на фирменную атрибутику ВВГУ", color: "#0891b2" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="rounded-2xl border-border/60 h-full">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-muted-foreground">{s.step}</span>
                      <div className="flex-1 h-px bg-border/40" />
                    </div>
                    <motion.div
                      className="h-11 w-11 rounded-xl flex items-center justify-center text-white mb-3"
                      style={{ background: s.color }}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {s.icon}
                    </motion.div>
                    <h3 className="font-bold text-foreground mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* XP Arrow flow */}
          <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
            <span className="text-sm text-muted-foreground">Квест</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-accent">+XP</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Рейтинг вырос</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Обмен в деканате</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-accent font-semibold">Имиджевая атрибутика 🎁</span>
          </div>
        </motion.section>

        {/* ── Магазин имиджки ─────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-6">
            <Gift className="h-5 w-5 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Что можно получить за XP</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {storeItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4, scale: 1.03 }}
              >
                <Card className="rounded-2xl border-border/60 text-center p-4 hover:shadow-lg transition-shadow cursor-default">
                  <div className="text-3xl mb-2">{item.emoji}</div>
                  <p className="text-xs font-semibold text-foreground leading-tight mb-1">{item.name}</p>
                  <Badge variant="outline" className="text-[10px] text-accent border-accent/40">
                    <Flame className="h-2.5 w-2.5 mr-0.5" /> {item.xp.toLocaleString()} XP
                  </Badge>
                </Card>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Обмен производится в деканате института (каб. 312) в рабочие часы. XP не сгорают.
          </p>
        </motion.section>

        {/* ── Примеры квестов ──────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Примеры квестов из кабинета</h2>
            </div>
            <Link href="/quests">
              <span className="text-sm text-accent hover:underline flex items-center gap-1 cursor-pointer">
                Все квесты <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questExamples.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -3 }}
              >
                <Card className="rounded-2xl border-border/60 hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        <Badge className={`${q.color} border-0 text-xs flex items-center gap-1 px-2 py-1`}>
                          {q.icon} {q.type}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground text-sm mb-1 leading-tight">{q.title}</h3>
                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{q.desc}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {q.location}
                          </span>
                          <span className={`text-xs font-medium flex items-center gap-1 ${q.diffColor}`}>
                            <Swords className="h-3 w-3" /> {q.difficulty}
                          </span>
                          <span className="text-xs font-bold text-accent flex items-center gap-1 ml-auto">
                            <Star className="h-3 w-3" /> +{q.xp} XP
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Истории успеха ───────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="h-5 w-5 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Студенты, которые уже получают имиджку</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {successStories.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -4 }}
              >
                <Card className="rounded-2xl border-border/60 hover:shadow-lg transition-shadow h-full overflow-hidden">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <img src={s.avatar} alt={s.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-accent/30 shrink-0" />
                      <div>
                        <p className="font-bold text-foreground">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.course}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">"{s.story}"</p>
                    <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-border/40">
                      <Badge variant="outline" className="text-xs">
                        <Flame className="h-3 w-3 mr-1 text-accent" /> {s.xp.toLocaleString()} XP
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Compass className="h-3 w-3 mr-1" /> {s.quests} квестов
                      </Badge>
                      <span className="text-xs font-semibold text-foreground ml-auto">
                        {s.rewardEmoji} {s.reward}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Top 3 Podium ─────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-8">
            <Trophy className="h-5 w-5 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Текущий рейтинг</h2>
          </div>

          {!isLoading && top3.length >= 3 && (
            <div className="flex items-end justify-center gap-4 mb-8">
              {[top3[1], top3[0], top3[2]].map((entry, idx) => {
                const actualRank = entry.rank;
                const styles = rankStyle(actualRank);
                const heights = [idx === 1 ? "h-36" : "h-28"];
                return (
                  <div key={entry.rank} className="flex flex-col items-center gap-2">
                    <img src={entry.avatarUrl || undefined} alt={entry.studentName} className="h-14 w-14 rounded-full object-cover ring-4 ring-white shadow-lg" />
                    <p className="text-sm font-semibold text-foreground text-center max-w-20 line-clamp-2">{entry.studentName}</p>
                    <p className="text-xs text-muted-foreground">{entry.xp.toLocaleString()} XP</p>
                    <div className={`w-24 ${heights[0] ?? "h-28"} rounded-t-2xl bg-gradient-to-t ${styles.bg || "from-muted to-muted-foreground/30"} flex items-start justify-center pt-3`}>
                      <span className="text-2xl">{actualRank <= 3 ? ["🥇","🥈","🥉"][actualRank-1] : `#${actualRank}`}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full List */}
          <Card className="rounded-2xl border-border/60">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 space-y-3">
                  {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {leaderboard?.map((entry, i) => {
                    const styles = rankStyle(entry.rank);
                    const isMe = entry.studentName === "Александра Морозова";
                    return (
                      <motion.div
                        key={entry.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center gap-4 p-4 transition-colors ${isMe ? "bg-accent/5" : "hover:bg-muted/30"}`}
                        data-testid={`row-leaderboard-${entry.rank}`}
                      >
                        <div className={`w-8 text-center font-bold text-sm ${styles.text}`}>
                          {entry.rank <= 3 ? ["🥇","🥈","🥉"][entry.rank-1] : entry.rank}
                        </div>
                        <img src={entry.avatarUrl || undefined} alt={entry.studentName} className="h-10 w-10 rounded-full object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`font-semibold text-sm ${isMe ? "text-accent" : "text-foreground"}`}>{entry.studentName}</p>
                            {isMe && <Badge className="bg-accent text-white border-0 text-xs">Вы</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">{roleLabels[entry.role] ?? entry.role}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center gap-1 justify-end">
                            <Badge variant="outline" className="text-xs">Ур. {entry.level}</Badge>
                          </div>
                          <p className="text-sm font-bold text-accent mt-1 flex items-center gap-1 justify-end">
                            <Flame className="h-3.5 w-3.5" /> {entry.xp.toLocaleString()} XP
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-0.5">
                            <Compass className="h-3 w-3" /> {entry.completedQuests} квест.
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>

      </div>
    </div>
  );
}
