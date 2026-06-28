import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Star, Users, ArrowRight, Quote, Building2, Globe } from "lucide-react";

const alumniList = [
  {
    photo: "/avatars/alumni-1.png",
    name: "Анастасия Петрова",
    year: "Выпуск 2021",
    role: "Менеджер по развитию туризма",
    company: "Visit Vladivostok — Официальный туристический центр",
    city: "Владивосток",
    flag: "🇷🇺",
    specialty: "Туризм, бакалавриат",
    quote: "ВВГУ дал мне понимание, как работает туристическая индустрия изнутри. Уже на 3-м курсе я вела реальные проекты вместе с городским туристическим центром — это бесценный опыт.",
    tags: ["Туристический маркетинг", "Event-планирование", "PR"],
    color: "#0057B8",
  },
  {
    photo: "/avatars/alumni-2.png",
    name: "Чон Миннам",
    year: "Выпуск 2020",
    role: "Директор туроператора по Приморью",
    company: "Pacific Routes — туроператор АТР",
    city: "Владивосток / Сеул",
    flag: "🇰🇷",
    specialty: "Туроперейтинг, бакалавриат",
    quote: "Знание языков и понимание культуры АТР, которое я получил в ВВГУ, открыли мне двери в корейский туристический рынок. Сейчас наша компания обслуживает более 5 000 туристов из Кореи ежегодно.",
    tags: ["Туроперейтинг", "Корейский рынок", "B2B"],
    color: "#EB7124",
  },
  {
    photo: "/avatars/alumni-3.png",
    name: "Виктория Соколова",
    year: "Выпуск 2019",
    role: "Marketing Director",
    company: "Hyatt Regency Vladivostok",
    city: "Владивосток",
    flag: "🇷🇺",
    specialty: "Гостиничное дело, магистратура",
    quote: "Магистратура по гостиничному менеджменту дала мне системное мышление. Я начала с позиции ассистента, а через 4 года стала директором по маркетингу международного отеля.",
    tags: ["Гостиничный маркетинг", "Бренд-стратегия", "Digital"],
    color: "#7c3aed",
  },
  {
    photo: "/avatars/alumni-4.png",
    name: "Лю Хао",
    year: "Выпуск 2022",
    role: "Travel Blogger & Influencer",
    company: "12.8M подписчиков · Douyin / YouTube",
    city: "Владивосток / Шанхай",
    flag: "🇨🇳",
    specialty: "Туризм, бакалавриат",
    quote: "Я выбрал ВВГУ, чтобы изучить Россию изнутри. Курсы по культуре Дальнего Востока и практика на маршрутах Приморья стали основой для моего блога о путешествиях.",
    tags: ["Контент-маркетинг", "SMM", "Туристическое видео"],
    color: "#0891b2",
  },
  {
    photo: "/avatars/alumni-5.png",
    name: "Артём Волков",
    year: "Выпуск 2018",
    role: "Владелец ресторана и гастро-тура",
    company: "«Приморский краб» — ресторан и гастрономические туры",
    city: "Владивосток",
    flag: "🇷🇺",
    specialty: "Гастрономический туризм, магистратура",
    quote: "Программа по гастрономическому туризму научила меня видеть в еде культурный продукт. Сегодня мой ресторан — часть туристического маршрута, который посещают 3 000 гостей в год.",
    tags: ["Ресторанный бизнес", "Гастро-туры", "Предпринимательство"],
    color: "#16a34a",
  },
  {
    photo: "/avatars/alumni-6.png",
    name: "Ю Сонён",
    year: "Выпуск 2023",
    role: "Гид по экологическому туризму",
    company: "Wild Primorye Eco Tours",
    city: "Приморский край",
    flag: "🇰🇷",
    specialty: "Экотуризм, магистратура",
    quote: "Я мечтала работать в дикой природе. Магистратура по экотуризму в ВВГУ — это уникальная программа, которой нет нигде в АТР. Теперь я провожу туры по Морскому заповеднику.",
    tags: ["Экотуризм", "Гид-натуралист", "Conservation"],
    color: "#d97706",
  },
];

const stats = [
  { num: "94%", label: "выпускников трудоустроены\nв течение 6 месяцев", color: "#0057B8" },
  { num: "3 000+", label: "выпускников по всему\nАзиатско-Тихоокеанскому региону", color: "#EB7124" },
  { num: "12", label: "стран, где работают\nнаши выпускники", color: "#7c3aed" },
  { num: "200+", label: "компаний-партнёров\nнанимают студентов ВВГУ", color: "#0891b2" },
];

export default function AlumniPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden py-16 px-4" style={{ background: "linear-gradient(135deg, #0057B8 0%, #0057B8 60%, #0891b2 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Briefcase className="h-5 w-5 text-accent" />
              <span className="text-white/60 uppercase tracking-widest text-xs">Карьера выпускников</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Кем становятся<br /><span className="text-accent">наши выпускники</span>
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              Реальные истории людей, которые выбрали ВВГУ — и построили карьеру в туризме, гостиничном деле и дизайне
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-card border-b border-border/40">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.num}</div>
              <div className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Alumni cards */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alumniList.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="rounded-2xl border-border/60 hover:shadow-xl transition-shadow h-full overflow-hidden">
                {/* Top accent bar */}
                <div className="h-1.5" style={{ background: a.color }} />
                <CardContent className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <img src={a.photo} alt={a.name} className="h-16 w-16 rounded-full object-cover ring-2 shrink-0" style={{ ringColor: a.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <h3 className="font-bold text-foreground">{a.name}</h3>
                        <span className="text-base">{a.flag}</span>
                      </div>
                      <p className="text-sm font-semibold" style={{ color: a.color }}>{a.role}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Building2 className="h-3 w-3" />
                        <span className="truncate">{a.company}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {a.city}
                        </span>
                        <Badge variant="outline" className="text-[10px]">{a.year}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="bg-muted/40 rounded-xl p-4 relative">
                    <Quote className="h-4 w-4 text-muted-foreground/40 absolute top-3 left-3" />
                    <p className="text-sm text-muted-foreground leading-relaxed pl-5 italic">{a.quote}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {a.tags.map((tag, j) => (
                      <Badge key={j} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                    <Badge variant="outline" className="text-xs ml-auto">{a.specialty}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 text-center">
          <div className="rounded-2xl p-10 border border-border/60" style={{ background: "linear-gradient(135deg, #0057B8, #0057B8)" }}>
            <Globe className="h-12 w-12 text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">Начни свою историю в ВВГУ</h2>
            <p className="text-white/60 mb-6 max-w-md mx-auto text-sm">Более 3 000 выпускников уже строят карьеру в туризме по всему АТР. Следующим можете стать вы.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild className="bg-accent hover:bg-accent/90 text-white rounded-full px-8">
                <Link href="/admission">Узнать о поступлении <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-8 border-white/20 bg-white/5 text-white hover:bg-white/10">
                <Link href="/open-day">День открытых дверей</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
