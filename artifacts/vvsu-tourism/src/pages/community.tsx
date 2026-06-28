import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { GeoCircle, GhostText, DotGrid, VerticalText, GhostSectionNum, AccentCard } from "@/components/GraphicAccents";
import {
  useListCommunityPosts,
  useCreateCommunityPost,
  getListCommunityPostsQueryKey,
  useListPostComments,
  useCreatePostComment,
  getListPostCommentsQueryKey,
} from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ExternalLink, Send, ChevronDown, ChevronUp } from "lucide-react";


const roleLabels: Record<string, string> = {
  guide: "Экскурсовод", marketer: "Маркетолог", designer: "Дизайнер", operator: "Туроператор"
};

const categoryImages: Record<string, string> = {
  "Маркетинг": "/post-cat-marketing.png",
  "Операционная деятельность": "/post-cat-operations.png",
  "Фотография": "/post-cat-photo.png",
  "Дизайн": "/post-cat-design.png",
};

const categoryIcons: Record<string, string> = {
  "Фотография": "ФТО",
  "Маркетинг": "МКТ",
  "Операционная деятельность": "ОПЕ",
  "Дизайн": "ДЗН",
};


const REACTION_EMOJIS = ["❤️", "👍", "🔥", "🤔"] as const;
type Emoji = typeof REACTION_EMOJIS[number];
type ReactionsState = Record<string, Record<Emoji, { count: number; mine: boolean }>>;
const STORAGE_KEY = "vvsu_post_reactions";

function loadReactions(): ReactionsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveReactions(state: ReactionsState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function initPostReactions(reactions: ReactionsState, postId: string, baseLikes: number): ReactionsState {
  if (reactions[postId]) return reactions;
  return {
    ...reactions,
    [postId]: {
      "❤️": { count: baseLikes, mine: false },
      "👍": { count: Math.floor(baseLikes * 0.6), mine: false },
      "🔥": { count: Math.floor(baseLikes * 0.3), mine: false },
      "🤔": { count: Math.floor(baseLikes * 0.15), mine: false },
    },
  };
}

/* ── Comments section for a single post ─────────────────────────── */
function PostCommentsSection({ postId, onRepliesChange }: { postId: number; onRepliesChange: () => void }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [text, setText] = useState("");
  const { data: comments, isLoading } = useListPostComments(postId);
  const createComment = useCreatePostComment();

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    createComment.mutate(
      { id: postId, data: { content: trimmed } },
      {
        onSuccess: () => {
          setText("");
          queryClient.invalidateQueries({ queryKey: getListPostCommentsQueryKey(postId) });
          queryClient.invalidateQueries({ queryKey: getListCommunityPostsQueryKey() });
          onRepliesChange();
        },
        onError: () => {
          toast({ title: "Ошибка", description: "Не удалось отправить комментарий.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="mt-3 pt-3 border-t border-border/50 space-y-3">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-3/4 rounded-xl" />
          </div>
        ) : comments && comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map(c => (
              <div key={c.id} className="flex gap-2.5">
                <div className="shrink-0 w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {c.authorName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-foreground">{c.authorName}</span>
                    <span className="text-xs text-muted-foreground">{roleLabels[c.authorRole] ?? c.authorRole}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground mt-0.5 leading-relaxed">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-1">Пока нет комментариев. Будьте первым!</p>
        )}

        {user ? (
          <div className="flex gap-2">
            <div className="shrink-0 w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
              {user.name?.charAt(0).toUpperCase() ?? "?"}
            </div>
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Написать комментарий..."
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                className="rounded-xl text-sm h-8 flex-1"
                disabled={createComment.isPending}
              />
              <Button
                size="sm"
                className="h-8 px-3 rounded-xl"
                onClick={handleSubmit}
                disabled={!text.trim() || createComment.isPending}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          <Link href="/login">
            <p className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors text-center">
              Войдите, чтобы оставить комментарий →
            </p>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

/* ── Main Component ──────────────────────────────────────────────── */
export default function Community() {
  const { user } = useAuth();
  const { data: posts, isLoading: postsLoading } = useListCommunityPosts();
  const createPost = useCreateCommunityPost();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", category: "Маркетинг" });
  const [reactions, setReactions] = useState<ReactionsState>(loadReactions);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);

  useEffect(() => {
    if (!posts) return;
    setReactions(prev => {
      let next = { ...prev };
      posts.forEach(p => { next = initPostReactions(next, String(p.id), p.likes); });
      saveReactions(next);
      return next;
    });
  }, [posts]);

  const toggleReaction = (postId: string, emoji: Emoji) => {
    setReactions(prev => {
      const postR = prev[postId] ?? {};
      const cur = postR[emoji] ?? { count: 0, mine: false };
      const next: ReactionsState = {
        ...prev,
        [postId]: {
          ...postR,
          [emoji]: { count: cur.mine ? cur.count - 1 : cur.count + 1, mine: !cur.mine },
        },
      };
      saveReactions(next);
      return next;
    });
  };

  const handleCreate = () => {
    if (!form.title || !form.content) return;
    createPost.mutate({ data: form }, {
      onSuccess: () => {
        toast({ title: "Пост создан!", description: "Ваш пост опубликован в сообществе." });
        queryClient.invalidateQueries({ queryKey: getListCommunityPostsQueryKey() });
        setShowDialog(false);
        setForm({ title: "", content: "", category: "Маркетинг" });
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky back bar */}
      <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/cabinet" className="flex items-center gap-2 text-sm font-semibold text-foreground shrink-0">
          <ArrowLeft className="h-5 w-5" /> Обзор
        </Link>
        <span className="text-muted-foreground text-sm">Молодёжка</span>
      </div>

      {/* Editorial header */}
      <div style={{ background: "#0A0A0A", borderBottom: "3px solid #0A0A0A" }}>
        {/* Label strip */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 24, padding: "18px 32px", borderBottom: "3px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, background: "#C6FF00" }} />
            <span style={{ fontWeight: 900, fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: "#C6FF00" }}>Молодёжка</span>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>→ Студенческая жизнь</span>
        </div>
        {/* Marquee */}
        <div style={{ overflow: "hidden", borderBottom: "3px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", animation: "marquee 26s linear infinite", width: "max-content", padding: "10px 0" }}>
            {Array.from({ length: 4 }).flatMap((_, ri) =>
              ["МОЛОДЁЖКА", "◆", "ТВОРЧЕСТВО", "◆", "ФОРУМ", "◆", "ПОСТЫ", "◆", "ПРОЕКТЫ", "◆", "СООБЩЕСТВО ВВГУ", "◆"].map((w, wi) => (
                <span key={`${ri}-${wi}`} style={{ fontWeight: 800, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", paddingRight: 28, color: w === "◆" ? "#FF007F" : "rgba(255,255,255,0.45)", flexShrink: 0 }}>{w}</span>
              ))
            )}
          </div>
        </div>
        {/* Hero title + photo strip */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "stretch" }}>
          <div style={{ padding: "36px 40px", borderRight: "3px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 280, position: "relative", overflow: "hidden" }}>
            {/* Graphic accents */}
            <GhostText text="МЛ" size={220} color="#fff" opacity={0.04} bottom={-60} right={-30} />
            <GeoCircle size={200} color="#FF007F" opacity={0.12} shape="full" top={-100} right={-80} animate />
            <GeoCircle size={80} color="#C6FF00" opacity={0.2} shape="quarter-br" bottom={-1} left={-1} />
            <DotGrid cols={4} rows={3} color="#FF007F" opacity={0.2} top={20} right={20} />
            <h1 style={{ fontSize: "clamp(40px,5vw,64px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", color: "#fff", marginBottom: 12, position: "relative", zIndex: 1 }}>
              Молодёжка
            </h1>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.6, position: "relative", zIndex: 1 }}>
              Делитесь опытом, обсуждайте<br />проекты и вдохновляйтесь
            </p>
          </div>
          {/* Photo strip */}
          <div className="w-full overflow-hidden" style={{ height: 180 }}>
            <div className="grid grid-cols-6 h-full">
              {["/community-1.png","/community-2.png","/community-3.png","/community-4.png","/community-5.png","/community-6.png"].map((src, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }} className="overflow-hidden relative" style={{ borderLeft: "3px solid rgba(255,255,255,0.07)" }}>
                  <img src={src} alt="" className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/30 hover:bg-transparent transition-colors duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8" style={{ position: "relative" }}>
          <GhostSectionNum num="МЛ" color="var(--color-foreground)" opacity={0.04} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="flex items-center gap-3 mb-2">
              <div style={{ width: 4, height: 16, background: "#FF007F", flexShrink: 0 }} />
              <span className="text-muted-foreground uppercase tracking-widest text-xs">Студенческая жизнь</span>
            </div>
            <p className="text-muted-foreground mt-2">Делитесь опытом, обсуждайте проекты и вдохновляйтесь работами коллег</p>
          </div>
        </motion.div>

        <div className="flex items-center justify-end mb-6">
          {user ? (
            <Button onClick={() => setShowDialog(true)} className="rounded-full" data-testid="button-create-post">
              + Новый пост
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="outline" className="rounded-full" data-testid="button-login-to-post">
                + Войти, чтобы публиковать
              </Button>
            </Link>
          )}
        </div>

        <div className="space-y-4">
            {/* Pinned posts from ITKI / mc.vvsu.ru */}
            {[
              {
                img: "/post-mascot.png",
                badge: "КНК",
                badgeLabel: "Конкурс",
                badgeBg: "#EB7124",
                tag: "Творчество",
                title: "Конкурс на создание маскота ИТКИ — подай заявку до 30 июля!",
                body: "Институт туризма и креативных индустрий объявляет открытый конкурс на создание официального маскота кафедры! Нарисуй персонажа, который будет олицетворять дух путешествий, творчества и Владивостока. Победитель получит диплом, мерч ИТКИ и 10 000 рублей. Работы принимаются в любом формате: скетч, цифровая иллюстрация, 3D.",
                source: "Кафедра ИТКИ · ВВГУ",
                link: "https://www.vvsu.ru/miost/",
                accentColor: "#EB7124",
                delay: 0,
              },
              {
                img: "/post-volunteer.png",
                badge: "НВС",
                badgeLabel: "Новость",
                badgeBg: "#0057B8",
                tag: "Волонтёрство",
                title: "«Чистые игры на ВЭФ 2024» — ВВГУ снова в числе лидеров",
                body: "Центр волонтёров ВВГУ — единственный на Дальнем Востоке, готовивший добровольцев для Олимпийских игр 2014 в Сочи. С 2021 года координирует международный проект «Чистые игры в Приморье». В акции на ВЭФ 2024 участвовали около 80 человек — студенты ВВГУ и представители бизнеса. Ежегодно Центр задействован в более 300 событиях.",
                source: "mc.vvsu.ru · Центр волонтёров",
                link: "https://www.vvsu.ru/mc/",
                accentColor: "#0057B8",
                delay: 0.06,
              },
              {
                img: "/post-excursion.png",
                badge: "СТЖ",
                badgeLabel: "Стажировки",
                badgeBg: "#C6FF00",
                tag: "Практика",
                title: "Туроператор «ВГУЭС-ТРЭВЕЛ» — производственные экскурсии для студентов ИТКИ",
                body: "40% преподавателей ИТКИ — практики отрасли: замминистра туризма Приморского края, директор нацпарка «Земля Леопарда», директор учебного центра «Билетур». Туроператор ВГУЭС-ТРЭВЕЛ организует для студентов образовательные стажировки с участием в конференциях и конкурсах по всей России и миру.",
                source: "vvsu.ru/miost · ИТКИ",
                link: "https://www.vvsu.ru/miost/",
                accentColor: "#C6FF00",
                delay: 0.12,
              },
              {
                img: "/post-festival.png",
                badge: "ХКТ",
                badgeLabel: "Хакатон",
                badgeBg: "#FF007F",
                tag: "Креативные индустрии",
                title: "Creative Generation 2025 — федеральный хакатон для студентов ИТКИ",
                body: "Стартовал федеральный контент-хакатон «Creative Generation» в сфере креативных индустрий. Бесплатное обучение нейросетям и работа на реальных задачах. Сроки: 1 октября — 19 декабря 2025. Участники получат сертификаты и возможность попасть в лучшие креативные агентства страны. Подавай заявку от кафедры ИТКИ!",
                source: "mc.vvsu.ru · Творческие объединения",
                link: "https://www.vvsu.ru/mc/",
                accentColor: "#FF007F",
                delay: 0.18,
              },
            ].map((post, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: post.delay }}>
                <div className="hover:shadow-lg transition-shadow overflow-hidden"
                  style={{ border: "2px solid var(--border)", borderTop: `4px solid ${post.accentColor}` }}>
                  <div className="h-48 overflow-hidden relative">
                    <img src={post.img} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-[9px] font-black px-2 py-1"
                        style={{ background: post.accentColor, color: post.accentColor === "#C6FF00" ? "#0A0A0A" : "#fff" }}>
                        {post.badge}
                      </span>
                      <span className="text-[9px] font-bold px-2 py-1" style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}>
                        {post.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-black text-foreground text-base mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{post.body}</p>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs text-muted-foreground">{post.source}</span>
                      <a href={post.link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-black transition-colors"
                        style={{ color: post.accentColor }}>
                        Подробнее →
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Alumni designer posts */}
            <div className="mt-2 mb-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-accent font-black">◆</span>
                <span className="text-sm font-bold text-foreground">Выпускники — дизайнеры ВВГУ</span>
                <span className="text-xs text-muted-foreground ml-1">Истории успеха</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: "Анна Серова",
                    year: "Выпуск 2022",
                    role: "Art Director · Branding Studio VL",
                    avatar: "А",
                    color: "#db2777",
                    tags: ["Графический дизайн", "Брендинг"],
                    text: "После ВВГУ я сразу попала в одну из крупнейших дизайн-студий Владивостока. Портфолио с реальных проектов кафедры открыло все двери — работодатель увидел не просто дипломную работу, а готовый коммерческий продукт.",
                    achievement: "5 наград Red Dot 2024",
                    link: "https://www.vvsu.ru/about/flagship-educational-programs/",
                  },
                  {
                    name: "Кирилл Ли",
                    year: "Выпуск 2021",
                    role: "UX/UI Lead · Tinkoff Bank Владивосток",
                    avatar: "К",
                    color: "#EB7124",
                    tags: ["UX/UI", "Digital"],
                    text: "Практика в студии дизайна ИТКИ дала мне понимание реального продуктового цикла. Сейчас я руковожу командой из 8 дизайнеров в банке — навыки проектного мышления с кафедры использую каждый день.",
                    achievement: "Product Designer года 2023",
                    link: "https://www.vvsu.ru/about/flagship-educational-programs/",
                  },
                  {
                    name: "Мария Чен",
                    year: "Выпуск 2023",
                    role: "Freelance · Motion Designer / Шанхай",
                    avatar: "М",
                    color: "#7c3aed",
                    tags: ["Motion", "3D", "АТР"],
                    text: "Знание азиатских рынков, которое мы получали на кафедре, помогло мне найти клиентов в Китае и Корее. Сегодня 80% моих заказчиков — компании АТР. ВВГУ дал уникальный международный контекст.",
                    achievement: "3 млн ₽ / год фриланс",
                    link: "https://www.vvsu.ru/about/flagship-educational-programs/",
                  },
                  {
                    name: "Дмитрий Волков",
                    year: "Выпуск 2020",
                    role: "Creative Director · Туристическое агентство «Восток»",
                    avatar: "Д",
                    color: "#0891b2",
                    tags: ["Айдентика", "Туризм"],
                    text: "Сочетание дизайна и туристической специфики — моя суперсила. Я разрабатываю айдентику для туристических брендов Приморья. Именно такой синергии учили на ИТКИ — и это работает.",
                    achievement: "30+ брендов в портфолио",
                    link: "https://www.vvsu.ru/about/flagship-educational-programs/",
                  },
                  {
                    name: "Соня Пак",
                    year: "Выпуск 2022",
                    role: "Interior Designer · Hyatt Regency Vladivostok",
                    avatar: "С",
                    color: "#16a34a",
                    tags: ["Интерьер", "Гостиничный дизайн"],
                    text: "Дизайн среды — это направление, которое расцветает во Владивостоке. Я участвовала в реновации трёх номерных фондов отеля. Практика с первого курса и связи кафедры с индустрией — это не просто слова.",
                    achievement: "Проекты в 4 отелях 5★",
                    link: "https://www.vvsu.ru/about/flagship-educational-programs/",
                  },
                  {
                    name: "Иван Морозов",
                    year: "Магистратура 2024",
                    role: "Brand Researcher · Яндекс Маркет",
                    avatar: "И",
                    color: "#b45309",
                    tags: ["Исследования", "Магистратура"],
                    text: "Магистратура по дизайну дала мне методологию UX-исследований на уровне, который ценят крупные IT-компании. Сейчас я изучаю поведение пользователей для одного из крупнейших маркетплейсов страны.",
                    achievement: "ВВГУ → Яндекс за 3 месяца",
                    link: "https://www.vvsu.ru/admission/mag/",
                  },
                ].map((alum, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                    <div className="hover:shadow-lg transition-shadow h-full flex flex-col overflow-hidden"
                      style={{ border: "2px solid var(--border)", borderTop: `4px solid ${alum.color}` }}>
                      <div className="p-4 pb-0 flex items-start gap-3">
                        <div className="h-10 w-10 flex items-center justify-center text-white font-black text-base shrink-0"
                          style={{ background: alum.color }}>
                          {alum.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="font-black text-foreground text-sm">{alum.name}</div>
                          <div className="text-xs text-muted-foreground">{alum.year}</div>
                          <div className="text-xs text-muted-foreground leading-snug mt-0.5">{alum.role}</div>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col gap-3 flex-1">
                        <div className="flex gap-1 flex-wrap">
                          {alum.tags.map(t => (
                            <span key={t} className="text-[10px] px-2 py-0.5 font-black"
                              style={{ background: alum.color, color: alum.color === "#C6FF00" ? "#0A0A0A" : "#fff" }}>{t}</span>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed flex-1">«{alum.text}»</p>
                        <div className="flex items-center justify-between pt-2 border-t border-border/40">
                          <div className="text-[10px] font-black" style={{ color: alum.color }}>
                            ★ {alum.achievement}
                          </div>
                          <a href={alum.link} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                            <ExternalLink className="h-3 w-3" /> →
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6 mb-2">
              <span className="text-accent font-black">◆</span>
              <span className="text-sm font-bold text-foreground">Форум сообщества</span>
            </div>

            {/* Forum posts */}
            {postsLoading ? [1,2,3].map(i => <Skeleton key={i} className="h-36 w-full" />) :
              posts?.map((post, i) => {
                const postId = String(post.id);
                const postReactions = reactions[postId];
                const isExpanded = expandedPostId === post.id;
                const catColor = ["#0057B8","#FF007F","#C6FF00","#EB7124","#0A0A0A"][i % 5];

                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    data-testid={`card-post-${post.id}`}
                  >
                    <div className="border-border/60 hover:shadow-md transition-shadow overflow-hidden"
                      style={{ border: "2px solid var(--border)", borderLeft: `4px solid ${catColor}` }}>
                      {categoryImages[post.category] && (
                        <div className="h-36 overflow-hidden">
                          <img src={categoryImages[post.category]} alt={post.category} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">{post.category}</Badge>
                            {categoryIcons[post.category]}
                          </div>
                          <h3 className="font-bold text-foreground text-base mb-1">{post.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                          <div className="flex items-center gap-4 mt-3 mb-3">
                            <span className="text-xs text-muted-foreground">
                              {post.authorName} · {roleLabels[post.authorRole] ?? post.authorRole}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(post.createdAt).toLocaleDateString("ru-RU")}
                            </span>
                          </div>
                          {/* Reactions + comments toggle */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {REACTION_EMOJIS.map(emoji => {
                              const r = postReactions?.[emoji];
                              const count = r?.count ?? 0;
                              const mine = r?.mine ?? false;
                              return (
                                <button
                                  key={emoji}
                                  onClick={() => toggleReaction(postId, emoji)}
                                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all select-none ${
                                    mine
                                      ? "bg-accent/15 border-accent/50 text-accent"
                                      : "bg-muted/40 border-border/50 text-muted-foreground hover:bg-muted hover:border-border"
                                  }`}
                                >
                                  <span>{emoji}</span>
                                  {count > 0 && <span>{count}</span>}
                                </button>
                              );
                            })}
                            {/* Comments toggle button */}
                            <button
                              onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all select-none ml-1 ${
                                isExpanded
                                  ? "bg-primary/10 border-primary/40 text-primary"
                                  : "bg-muted/40 border-border/50 text-muted-foreground hover:bg-muted hover:border-border"
                              }`}
                            >
                              <span className="text-sm leading-none">◎</span>
                              <span>{post.replies} комм.</span>
                              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </button>
                          </div>

                          {/* Expandable comments */}
                          <AnimatePresence>
                            {isExpanded && (
                              <PostCommentsSection
                                key={post.id}
                                postId={post.id}
                                onRepliesChange={() => {}}
                              />
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            }
        </div>
      </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Новый пост</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Заголовок"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="rounded-xl"
              data-testid="input-post-title"
            />
            <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
              <SelectTrigger className="rounded-xl" data-testid="select-post-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Маркетинг", "Операционная деятельность", "Дизайн", "Фотография"].map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Расскажите о вашем опыте, идеях или вопросах..."
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={4}
              className="rounded-xl"
              data-testid="input-post-content"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Отмена</Button>
            <Button onClick={handleCreate} disabled={createPost.isPending || !form.title || !form.content} data-testid="button-publish-post">
              {createPost.isPending ? "Публикую..." : "Опубликовать"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
