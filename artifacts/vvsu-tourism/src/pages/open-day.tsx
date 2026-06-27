import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin, Users, CheckCircle, Star, Mic, Coffee, ArrowRight, BookOpen, Compass, Trophy } from "lucide-react";

const TARGET_DATE = new Date("2026-08-22T10:00:00+10:00");

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

const schedule = [
  { time: "10:00", title: "Открытие. Приветственное слово декана", icon: <Mic className="h-4 w-4" />, tag: "Пленарная", color: "#033F7E" },
  { time: "10:30", title: "Презентация программ бакалавриата и магистратуры", icon: <BookOpen className="h-4 w-4" />, tag: "Лекция", color: "#EB7124" },
  { time: "11:30", title: "Экскурсия по кампусу и лабораториям", icon: <MapPin className="h-4 w-4" />, tag: "Экскурсия", color: "#7c3aed" },
  { time: "12:30", title: "Кофе-пауза и общение со студентами", icon: <Coffee className="h-4 w-4" />, tag: "Нетворкинг", color: "#0891b2" },
  { time: "13:00", title: "Мастер-класс «Разработка туристического маршрута»", icon: <Compass className="h-4 w-4" />, tag: "Практика", color: "#16a34a" },
  { time: "14:00", title: "Квест по Владивостоку для абитуриентов", icon: <Trophy className="h-4 w-4" />, tag: "Квест", color: "#d97706" },
  { time: "15:00", title: "Консультации по поступлению. Ответы на вопросы", icon: <Users className="h-4 w-4" />, tag: "Консультация", color: "#033F7E" },
  { time: "16:00", title: "Завершение. Подарки участникам", icon: <Star className="h-4 w-4" />, tag: "Финал", color: "#EB7124" },
];

export default function OpenDayPage() {
  const { toast } = useToast();
  const countdown = useCountdown(TARGET_DATE);
  const [form, setForm] = useState({ name: "", email: "", city: "", school: "", program: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.city) {
      toast({ title: "Заполните обязательные поля", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Регистрация принята! 🎉", description: "Мы пришлём подтверждение на вашу почту." });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden py-16 px-4" style={{ background: "linear-gradient(135deg, #172E46 0%, #033F7E 60%, #0891b2 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="bg-accent text-white border-0 mb-4 text-sm px-4 py-1">День открытых дверей 2026</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Приходи и почувствуй<br /><span className="text-accent">атмосферу ВВГУ</span></h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
              22 августа 2026 • 10:00–16:00 • ВВГУ, г. Владивосток, ул. Гоголя, 41
            </p>
            {/* Countdown */}
            <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
              {[
                { val: countdown.days, label: "дней" },
                { val: countdown.hours, label: "часов" },
                { val: countdown.minutes, label: "минут" },
                { val: countdown.seconds, label: "секунд" },
              ].map((unit, i) => (
                <motion.div key={i} className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-1 border border-white/20">
                    <span className="text-3xl font-black text-white tabular-nums">
                      {String(unit.val).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-xs text-white/50">{unit.label}</span>
                </motion.div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-3 text-white/60 text-sm flex-wrap">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> 22 августа 2026</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 10:00–16:00</span>
              <span>·</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> ул. Гоголя, 41, Владивосток</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">
        {/* What you'll get */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-foreground mb-6">Что вас ждёт</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: "🎓", title: "Презентации программ", desc: "Подробно расскажем о каждом направлении" },
              { emoji: "🏛️", title: "Экскурсия по кампусу", desc: "Аудитории, лаборатории, студия дизайна" },
              { emoji: "🧭", title: "Мастер-класс", desc: "Реальное задание по разработке тур-маршрута" },
              { emoji: "📝", title: "Консультация", desc: "Ответим на все вопросы о поступлении" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -3 }}>
                <Card className="rounded-2xl border-border/60 text-center p-5 hover:shadow-md transition-shadow h-full">
                  <div className="text-4xl mb-3">{item.emoji}</div>
                  <h3 className="font-bold text-foreground text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Schedule */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-foreground mb-6">Программа дня</h2>
          <div className="space-y-3">
            {schedule.map((ev, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Card className="rounded-2xl border-border/60 hover:shadow-sm transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="text-sm font-bold text-muted-foreground w-12 shrink-0 tabular-nums">{ev.time}</div>
                    <div className="w-px h-8 bg-border/60 shrink-0" />
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: ev.color }}>
                      {ev.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm">{ev.title}</p>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">{ev.tag}</Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Registration form */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Зарегистрируйтесь заранее</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Регистрация бесплатная. Участники получают фирменный блокнот ВВГУ и возможность пройти ускоренное собеседование для поступления.
              </p>
              <div className="space-y-3 text-sm">
                {["Участие бесплатное", "Подтверждение на почту", "Подарок каждому участнику", "Онлайн-участие для иногородних"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {submitted ? (
              <Card className="rounded-2xl border-border/60 bg-accent/5">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="text-5xl">🎉</div>
                  <h3 className="text-xl font-bold text-foreground">Вы зарегистрированы!</h3>
                  <p className="text-muted-foreground text-sm">Подтверждение придёт на {form.email}. Ждём вас 22 августа в 10:00!</p>
                  <Button asChild variant="outline" className="rounded-xl">
                    <Link href="/admission">Узнать о программах</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-2xl border-border/60">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Имя и фамилия *</label>
                      <Input className="rounded-xl" placeholder="Иван Петров" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Электронная почта *</label>
                      <Input className="rounded-xl" type="email" placeholder="ivan@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Город *</label>
                      <Input className="rounded-xl" placeholder="Владивосток" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Интересующая программа</label>
                      <Select value={form.program} onValueChange={v => setForm(f => ({ ...f, program: v }))}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Выберите направление" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tourism">Туризм (бакалавриат)</SelectItem>
                          <SelectItem value="hotel">Гостиничное дело (бакалавриат)</SelectItem>
                          <SelectItem value="design">Дизайн (бакалавриат)</SelectItem>
                          <SelectItem value="ecotourism">Экотуризм (магистратура)</SelectItem>
                          <SelectItem value="gastronomy">Гастрономический туризм (магистратура)</SelectItem>
                          <SelectItem value="unsure">Ещё не определился</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full rounded-xl bg-accent hover:bg-accent/90 text-white h-11">
                      Зарегистрироваться <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
