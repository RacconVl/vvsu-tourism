import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  useListCommunityPosts,
  useListGalleryWorks,
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
import { Users, Heart, MessageCircle, Image, PlusCircle, Palette, Route, Megaphone, ArrowLeft, ExternalLink, HandHeart, Send, ChevronDown, ChevronUp } from "lucide-react";

const roleLabels: Record<string, string> = {
  guide: "Экскурсовод", marketer: "Маркетолог", designer: "Дизайнер", operator: "Туроператор"
};

const categoryImages: Record<string, string> = {
  "Маркетинг": "/post-cat-marketing.png",
  "Операционная деятельность": "/post-cat-operations.png",
  "Фотография": "/post-cat-photo.png",
  "Дизайн": "/post-cat-design.png",
};

const categoryIcons: Record<string, React.ReactNode> = {
  "Фотография": <Image className="h-4 w-4" />,
  "Маркетинг": <Megaphone className="h-4 w-4" />,
  "Операционная деятельность": <Route className="h-4 w-4" />,
  "Дизайн": <Palette className="h-4 w-4" />,
};

const galleryCategories: Record<string, { label: string; color: string }> = {
  design: { label: "Дизайн", color: "bg-rose-100 text-rose-700" },
  marketing: { label: "Маркетинг", color: "bg-purple-100 text-purple-700" },
  route: { label: "Маршрут", color: "bg-teal-100 text-teal-700" },
  concept: { label: "Концепция", color: "bg-blue-100 text-blue-700" },
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
  const { data: gallery, isLoading: galleryLoading } = useListGalleryWorks();
  const createPost = useCreateCommunityPost();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"forum" | "gallery">("forum"); // kept for compat
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

      {/* Photo strip */}
      <div className="w-full overflow-hidden">
        <div className="grid grid-cols-3 md:grid-cols-6 h-48 md:h-64">
          {["/community-1.png","/community-2.png","/community-3.png","/community-4.png","/community-5.png","/community-6.png"].map((src, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }} className="overflow-hidden relative">
              <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-primary/20 hover:bg-transparent transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-6 w-6 text-accent" />
            <span className="text-muted-foreground uppercase tracking-widest text-xs">Студенческая жизнь</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Молодёжка</h1>
          <p className="text-muted-foreground mt-2">Делитесь опытом, обсуждайте проекты и вдохновляйтесь работами коллег</p>
        </motion.div>

        <div className="flex items-center justify-end mb-6">
          {user ? (
            <Button onClick={() => setShowDialog(true)} className="rounded-full" data-testid="button-create-post">
              <PlusCircle className="h-4 w-4 mr-2" /> Новый пост
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="outline" className="rounded-full" data-testid="button-login-to-post">
                <PlusCircle className="h-4 w-4 mr-2" /> Войти, чтобы публиковать
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Left: posts */}
          <div className="lg:col-span-3 space-y-4">
            {/* Pinned posts from ITKI / mc.vvsu.ru */}
            {[
              {
                img: "/post-mascot.png",
                badge: "🏆 Конкурс",
                badgeClass: "bg-accent text-accent-foreground border-0",
                tag: "Творчество",
                title: "Конкурс на создание маскота ИТКИ — подай заявку до 30 июля!",
                body: "Институт туризма и креативных индустрий объявляет открытый конкурс на создание официального маскота кафедры! Нарисуй персонажа, который будет олицетворять дух путешествий, творчества и Владивостока. Победитель получит диплом, мерч ИТКИ и 10 000 рублей. Работы принимаются в любом формате: скетч, цифровая иллюстрация, 3D.",
                source: "Кафедра ИТКИ · ВВГУ",
                link: "https://www.vvsu.ru/miost/",
                pinIcon: "📌",
                delay: 0,
              },
              {
                img: "/post-volunteer.png",
                badge: "📌 Новость ВВГУ",
                badgeClass: "bg-primary/80 text-white border-0",
                tag: "Волонтёрство",
                title: "«Чистые игры на ВЭФ 2024» — ВВГУ снова в числе лидеров",
                body: "Центр волонтёров ВВГУ — единственный на Дальнем Востоке, готовивший добровольцев для Олимпийских игр 2014 в Сочи. С 2021 года координирует международный проект «Чистые игры в Приморье». В акции на ВЭФ 2024 участвовали около 80 человек — студенты ВВГУ и представители бизнеса. Ежегодно Центр задействован в более 300 событиях.",
                source: "mc.vvsu.ru · Центр волонтёров",
                link: "https://www.vvsu.ru/mc/",
                pinIcon: "📌",
                delay: 0.06,
              },
              {
                img: "/post-excursion.png",
                badge: "📌 Стажировки",
                badgeClass: "bg-teal-600 text-white border-0",
                tag: "Практика",
                title: "Туроператор «ВГУЭС-ТРЭВЕЛ» — производственные экскурсии для студентов ИТКИ",
                body: "40% преподавателей ИТКИ — практики отрасли: замминистра туризма Приморского края, директор нацпарка «Земля Леопарда», директор учебного центра «Билетур». Туроператор ВГУЭС-ТРЭВЕЛ организует для студентов образовательные стажировки с участием в конференциях и конкурсах по всей России и миру.",
                source: "vvsu.ru/miost · ИТКИ",
                link: "https://www.vvsu.ru/miost/",
                pinIcon: "📌",
                delay: 0.12,
              },
              {
                img: "/post-festival.png",
                badge: "🎯 Хакатон",
                badgeClass: "bg-purple-600 text-white border-0",
                tag: "Креативные индустрии",
                title: "Creative Generation 2025 — федеральный хакатон для студентов ИТКИ",
                body: "Стартовал федеральный контент-хакатон «Creative Generation» в сфере креативных индустрий. Бесплатное обучение нейросетям и работа на реальных задачах. Сроки: 1 октября — 19 декабря 2025. Участники получат сертификаты и возможность попасть в лучшие креативные агентства страны. Подавай заявку от кафедры ИТКИ!",
                source: "mc.vvsu.ru · Творческие объединения",
                link: "https://www.vvsu.ru/mc/",
                pinIcon: "📌",
                delay: 0.18,
              },
            ].map((post, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: post.delay }}>
                <Card className="rounded-2xl border-2 border-accent/20 hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img src={post.img} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge className={`text-xs ${post.badgeClass}`}>{post.badge}</Badge>
                      <Badge variant="outline" className="text-xs">{post.tag}</Badge>
                    </div>
                    <h3 className="font-bold text-foreground text-base mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{post.body}</p>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs text-muted-foreground">{post.source}</span>
                      <a href={post.link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-medium text-accent hover:underline">
                        Подробнее <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Forum posts */}
            {postsLoading ? [1,2,3].map(i => <Skeleton key={i} className="h-36 w-full rounded-2xl" />) :
              posts?.map((post, i) => {
                const postId = String(post.id);
                const postReactions = reactions[postId];
                const isExpanded = expandedPostId === post.id;

                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    data-testid={`card-post-${post.id}`}
                  >
                    <Card className="rounded-2xl border-border/60 hover:shadow-md transition-shadow overflow-hidden">
                      {categoryImages[post.category] && (
                        <div className="h-36 overflow-hidden">
                          <img src={categoryImages[post.category]} alt={post.category} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <CardContent className="p-5">
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
                              <MessageCircle className="h-3.5 w-3.5" />
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
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            }
          </div>

          {/* Right: gallery */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Image className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold text-foreground">Галерея работ</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {galleryLoading ? [1,2,3].map(i => <Skeleton key={i} className="h-56 w-full rounded-2xl" />) :
                gallery?.map((work, i) => (
                  <motion.div
                    key={work.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ y: -3 }}
                    data-testid={`card-gallery-${work.id}`}
                  >
                    <Card className="overflow-hidden rounded-2xl border-border/60 hover:shadow-xl transition-shadow">
                      <div className="h-40 overflow-hidden">
                        <img src={work.imageUrl || undefined} alt={work.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                      <CardContent className="p-3">
                        <Badge className={`${galleryCategories[work.category]?.color ?? "bg-muted text-muted-foreground"} text-xs border-0 mb-1`}>
                          {galleryCategories[work.category]?.label ?? work.category}
                        </Badge>
                        <h3 className="font-bold text-sm text-foreground mb-0.5">{work.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">{work.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">{work.authorName}</span>
                          <span className="flex items-center gap-1 text-xs text-rose-500">
                            <Heart className="h-3.5 w-3.5" /> {work.likes}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              }
            </div>
          </div>
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
