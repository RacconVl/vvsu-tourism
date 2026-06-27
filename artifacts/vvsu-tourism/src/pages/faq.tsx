import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronDown, MessageCircle, Phone, Mail, ArrowRight } from "lucide-react";

type FaqItem = { q: string; a: string; category: string };

const faqs: FaqItem[] = [
  // Поступление
  { category: "Поступление", q: "Какие экзамены нужно сдавать для поступления на туризм?", a: "Для поступления на бакалавриат по направлению «Туризм» необходимо сдать ЕГЭ по русскому языку (обязательно), истории и географии или обществознанию. Минимальный балл — 38 по каждому предмету. Список ЕГЭ может варьироваться по программам — уточните на странице каждой программы." },
  { category: "Поступление", q: "Когда начинается приём документов?", a: "Приём документов для поступления в бакалавриат начинается 20 июня и заканчивается 25 июля. Для магистратуры — с 1 июля по 10 августа. Документы можно подать лично в приёмной комиссии (каб. 102), по почте или через портал Госуслуги." },
  { category: "Поступление", q: "Можно ли поступить без ЕГЭ?", a: "Да. Если у вас уже есть среднее профессиональное образование (колледж/техникум), вы можете поступить на основе внутренних вступительных испытаний ВВГУ. Для магистратуры ЕГЭ не требуется — нужен диплом бакалавра и прохождение собеседования." },
  { category: "Поступление", q: "Принимаются ли иностранные абитуриенты?", a: "Да, ВВГУ активно принимает студентов из стран АТР: Кореи, Китая, Японии и других. Иностранные граждане могут поступить по квоте Правительства РФ, через двусторонние соглашения или на платной основе. Для поступления потребуется сертификат по русскому языку уровня B1 или выше." },
  { category: "Поступление", q: "Есть ли бюджетные места?", a: "Да. В 2026 году выделено 25 бюджетных мест на «Туризм», 20 на «Гостиничное дело», 15 на «Дизайн», 10 на «Экологический туризм» и 8 на «Гастрономический туризм». Магистратура также имеет бюджетные места. Конкурс проводится по совокупности баллов ЕГЭ и индивидуальных достижений." },
  { category: "Поступление", q: "Учитываются ли дополнительные достижения при поступлении?", a: "Да. К ЕГЭ прибавляются баллы за: победу в олимпиадах (до 10 баллов), значок ГТО золотого уровня (+2 балла), статус волонтёра (+2 балла), сочинение (+10 баллов), медаль «За особые успехи в учении» (+10 баллов). Максимально — 10 дополнительных баллов." },
  // Обучение
  { category: "Обучение", q: "Есть ли практика во время учёбы?", a: "Да, практика — ключевая часть обучения. Уже с 1-го семестра студенты работают над реальными кейсами туристических компаний Приморья. На 2–3-м курсах — производственная практика в партнёрских компаниях (отели, туроператоры, агентства). На 4-м курсе — преддипломная практика у работодателя на выбор студента." },
  { category: "Обучение", q: "Можно ли учиться по обмену за рубежом?", a: "Да. ВВГУ имеет соглашения с 12 университетами Кореи, Китая и Японии. Студенты 2–3-го курса могут пройти семестр обмена в Пусанском национальном университете (Корея), Хоккайдском университете (Япония) или Даляньском политехническом университете (Китай). Действуют гранты для частичного покрытия расходов." },
  { category: "Обучение", q: "Есть ли вечерняя или заочная форма обучения?", a: "Да. По направлениям «Туризм» и «Гостиничное дело» доступна очно-заочная и заочная форма. Занятия проходят по субботам и воскресеньям, а также в онлайн-формате. Стоимость заочной формы — от 82 000 ₽ в год. Для работающих граждан это удобный вариант совмещения учёбы и работы." },
  { category: "Обучение", q: "Как устроена система оценок и зачётов?", a: "В ВВГУ применяется балльно-рейтинговая система (БРС). По каждой дисциплине студент набирает баллы за посещаемость, контрольные работы, проекты и экзамен. Итоговая оценка выставляется по 100-балльной шкале. Студенты с рейтингом 75+ освобождаются от сдачи зачёта. Кроме академических оценок, действует система XP за квесты и практические задания." },
  // Стоимость и стипендии
  { category: "Стоимость и льготы", q: "Сколько стоит обучение в год?", a: "Стоимость зависит от направления и формы обучения. Бакалавриат очно: «Туризм» — от 148 000 ₽/год, «Гостиничное дело» — от 155 000 ₽/год, «Дизайн» — от 165 000 ₽/год. Магистратура: от 175 000 ₽/год. Заочная форма — на 30–40% дешевле. Возможна оплата в рассрочку (ежемесячно или посеместрово) без процентов." },
  { category: "Стоимость и льготы", q: "Есть ли скидки и льготы на обучение?", a: "Да. Скидки предусмотрены для: отличников (20% при среднем баллу ЕГЭ 90+), сирот и детей без попечения (100% на бюджете), студентов с ОВЗ (специальные условия), выпускников подшефных школ ВВГУ (15%), детей сотрудников ВВГУ (25%). Также доступен образовательный кредит Сбербанка под 3%." },
  { category: "Стоимость и льготы", q: "Какие стипендии доступны студентам?", a: "Академическая стипендия — от 3 500 ₽/мес (бюджет). Повышенная стипендия за успехи — до 8 000 ₽/мес. Именные стипендии партнёров (Приморское туристическое агентство, Hyatt, Marriott) — от 10 000 ₽/мес. Стипендия Правительства Приморского края для лучших студентов — 15 000 ₽/мес. Можно получать несколько стипендий одновременно." },
  // Общежитие и жизнь
  { category: "Общежитие и кампус", q: "Есть ли общежитие?", a: "Да. ВВГУ предоставляет иногородним студентам место в общежитии на Острове Русском (кампус ДВФУ) или в городских общежитиях в 15 минутах от корпусов. Стоимость — от 2 500 до 5 000 ₽ в месяц. Подача заявки — в приёмной комиссии одновременно с документами на поступление. Места гарантированы иногородним на 1-м курсе." },
  { category: "Общежитие и кампус", q: "Как добраться до кампуса?", a: "Главный корпус ВВГУ находится по адресу: ул. Гоголя, 41, Владивосток. До него ходят автобусы 23, 45, 78. Также есть корпуса в центре города. Занятия проходят в нескольких учебных корпусах — расписание включает адреса аудиторий. Для студентов, живущих на Русском острове, организован бесплатный автобус до главного корпуса." },
  { category: "Общежитие и кампус", q: "Есть ли спортивные секции и кружки?", a: "Да. Студентам доступны: секции по плаванию, волейболу, баскетболу, бегу, йоге и боевым искусствам. Творческие кружки: фотоклуб, студенческий театр, ансамбль «Приморье». Туристический клуб организует походы по Приморскому краю. Студенческий совет проводит регулярные мероприятия, квесты и вечеринки." },
  // Трудоустройство
  { category: "Трудоустройство", q: "Помогает ли вуз с трудоустройством?", a: "Да. В ВВГУ действует Центр карьеры, который помогает студентам с поиском работы с 3-го курса. Услуги: составление резюме, мастер-классы по собеседованиям, база вакансий от 200+ партнёров, карьерные ярмарки 2 раза в год. 94% выпускников трудоустраиваются в течение 6 месяцев после окончания." },
  { category: "Трудоустройство", q: "Можно ли работать во время учёбы?", a: "Да, многие студенты работают со 2–3-го курса в туристических компаниях, отелях и агентствах. Очная форма позволяет совмещать учёбу с частичной занятостью (20–30 часов в неделю). Центр карьеры помогает найти подработку, связанную со специальностью. Работа засчитывается как часть практики при наличии документов." },
  { category: "Трудоустройство", q: "Сколько зарабатывают выпускники?", a: "По данным 2025 года: начинающий менеджер туркомпании — от 45 000 ₽/мес, гид (+ чаевые) — от 55 000 ₽, дизайнер в турбизнесе — от 70 000 ₽, менеджер отеля — от 60 000 ₽, директор по маркетингу в международном отеле — от 150 000 ₽. Работа в Японии и Корее — от $2 500/мес." },
];

const categories = ["Все", "Поступление", "Обучение", "Стоимость и льготы", "Общежитие и кампус", "Трудоустройство"];

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const filtered = faqs.filter(f => {
    const matchCat = category === "Все" || f.category === category;
    const matchQ = !query || f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MessageCircle className="h-5 w-5 text-accent" />
            <span className="text-muted-foreground uppercase tracking-widest text-xs">Справочник</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">FAQ для абитуриентов</h1>
          <p className="text-muted-foreground">Ответы на самые частые вопросы о поступлении, обучении и жизни в ВВГУ</p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="rounded-xl pl-10 h-11" placeholder="Поиск по вопросам..." value={query} onChange={e => setQuery(e.target.value)} />
        </motion.div>

        {/* Category filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${category === cat ? "bg-primary text-primary-foreground border-primary" : "border-border/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ items */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Ничего не найдено. Попробуйте другой запрос.</p>
            </div>
          )}
          {filtered.map((item, i) => {
            const isOpen = openIdx === i;
            return (
              <motion.div key={`${category}-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className={`rounded-2xl border-border/60 overflow-hidden transition-shadow ${isOpen ? "shadow-md" : "hover:shadow-sm"}`}>
                  <button className="w-full text-left p-5 flex items-start gap-3" onClick={() => setOpenIdx(isOpen ? null : i)}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge variant="outline" className="text-[10px] shrink-0">{item.category}</Badge>
                      </div>
                      <p className="font-semibold text-foreground text-sm leading-snug">{item.q}</p>
                    </div>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 mt-0.5">
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                        <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Contact block */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12">
          <Card className="rounded-2xl border-border/60 bg-muted/30">
            <CardContent className="p-6">
              <h3 className="font-bold text-foreground mb-4 text-center">Не нашли ответ? Свяжитесь с нами</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <Phone className="h-5 w-5 text-accent mx-auto" />
                  <p className="text-sm font-semibold text-foreground">+7 (423) 240-40-09</p>
                  <p className="text-xs text-muted-foreground">Пн–Пт, 9:00–17:00</p>
                </div>
                <div className="space-y-1">
                  <Mail className="h-5 w-5 text-accent mx-auto" />
                  <p className="text-sm font-semibold text-foreground">abitur@vvsu.ru</p>
                  <p className="text-xs text-muted-foreground">Приёмная комиссия</p>
                </div>
                <div className="space-y-1">
                  <MessageCircle className="h-5 w-5 text-accent mx-auto" />
                  <p className="text-sm font-semibold text-foreground">ВКонтакте / Telegram</p>
                  <p className="text-xs text-muted-foreground">@vvsu_itki</p>
                </div>
              </div>
              <div className="text-center mt-6">
                <Button asChild className="bg-accent hover:bg-accent/90 text-white rounded-full px-8">
                  <Link href="/open-day">Прийти на день открытых дверей <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
