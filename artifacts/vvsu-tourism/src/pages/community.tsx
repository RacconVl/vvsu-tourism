import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListCommunityPosts, useListGalleryWorks, useCreateCommunityPost, getListCommunityPostsQueryKey } from "@workspace/api-client-react";
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
import { Users, Heart, MessageCircle, Image, PlusCircle, Palette, Route, Megaphone, ArrowLeft, ExternalLink, HandHeart } from "lucide-react";

const roleLabels: Record<string, string> = {
  guide: "Экскурсовод", marketer: "Маркетолог", designer: "Дизайнер", operator: "Туроператор"
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
  } catch {
    return {};
  }
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

export default function Community() {
  const { user } = useAuth();
  const { data: posts, isLoading: postsLoading } = useListCommunityPosts();
  const { data: gallery, isLoading: galleryLoading } = useListGalleryWorks();
  const createPost = useCreateCommunityPost();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"forum" | "gallery">("forum");
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", category: "Маркетинг" });
  const [reactions, setReactions] = useState<ReactionsState>(loadReactions);

  useEffect(() => {
    if (!posts) return;
    setReactions(prev => {
      let next = { ...prev };
      posts.forEach(p => {
        next = initPostReactions(next, String(p.id), p.likes);
      });
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
        <span className="text-muted-foreground text-sm">Сообщество</span>
      </div>

      <div className="py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-6 w-6 text-accent" />
            <span className="text-muted-foreground uppercase tracking-widest text-xs">Сообщество</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Студенческое сообщество</h1>
          <p className="text-muted-foreground mt-2">Делитесь опытом, обсуждайте проекты и вдохновляйтесь работами коллег</p>
        </motion.div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <Button variant={activeTab === "forum" ? "default" : "outline"} onClick={() => setActiveTab("forum")} className="rounded-full">
              <MessageCircle className="h-4 w-4 mr-2" /> Форум
            </Button>
            <Button variant={activeTab === "gallery" ? "default" : "outline"} onClick={() => setActiveTab("gallery")} className="rounded-full">
              <Image className="h-4 w-4 mr-2" /> Галерея работ
            </Button>
          </div>
          {activeTab === "forum" && (
            user ? (
              <Button onClick={() => setShowDialog(true)} className="rounded-full" data-testid="button-create-post">
                <PlusCircle className="h-4 w-4 mr-2" /> Новый пост
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="rounded-full" data-testid="button-login-to-post">
                  <PlusCircle className="h-4 w-4 mr-2" /> Войти, чтобы публиковать
                </Button>
              </Link>
            )
          )}
        </div>

        {activeTab === "forum" && (
          <div className="space-y-4">
            {/* Pinned volunteer news */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="rounded-2xl border-2 border-accent/30 bg-accent/5 hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                      <HandHeart className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge className="bg-accent text-accent-foreground border-0 text-xs">📌 Новость ВВГУ</Badge>
                        <Badge variant="outline" className="text-xs">Волонтёрство</Badge>
                      </div>
                      <h3 className="font-bold text-foreground text-base mb-2">
                        Студенты ВВГУ познакомились с работой добровольцев «ЛизаАлерт» в Приморье
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Центр волонтёров ВВГУ — первый в Приморье с 1998 года. Наши студенты участвовали в подготовке 
                        добровольцев для Олимпийских игр в Сочи, чемпионата мира по водным видам спорта, Восточного 
                        экономического форума. Ежегодно Центр задействован в более чем 300 событиях — от городского 
                        до международного уровня. Волонтёры ВВГУ — первые лица добровольчества в Приморье.
                      </p>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs text-muted-foreground">vvsu.ru/mc · Центр молодёжных коммуникаций</span>
                        <a
                          href="https://www.vvsu.ru/mc/volunteering/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                        >
                          Подробнее <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Forum posts */}
            {postsLoading ? [1,2,3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />) :
              posts?.map((post, i) => {
                const postId = String(post.id);
                const postReactions = reactions[postId];
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    data-testid={`card-post-${post.id}`}
                  >
                    <Card className="rounded-2xl border-border/60 hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">{post.category}</Badge>
                              {categoryIcons[post.category]}
                            </div>
                            <h3 className="font-bold text-foreground text-base mb-1">{post.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                            <div className="flex items-center gap-4 mt-3 mb-4">
                              <span className="text-xs text-muted-foreground">
                                {post.authorName} · {roleLabels[post.authorRole] ?? post.authorRole}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(post.createdAt).toLocaleDateString("ru-RU")}
                              </span>
                            </div>
                            {/* Emoji reactions */}
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
                              <span className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                                <MessageCircle className="h-3.5 w-3.5" /> {post.replies}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            }
          </div>
        )}

        {activeTab === "gallery" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryLoading ? [1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-72 w-full rounded-2xl" />) :
              gallery?.map((work, i) => (
                <motion.div
                  key={work.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4 }}
                  data-testid={`card-gallery-${work.id}`}
                >
                  <Card className="overflow-hidden rounded-2xl border-border/60 hover:shadow-xl transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img src={work.imageUrl || undefined} alt={work.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <CardContent className="p-4">
                      <Badge className={`${galleryCategories[work.category]?.color ?? "bg-muted text-muted-foreground"} text-xs border-0 mb-2`}>
                        {galleryCategories[work.category]?.label ?? work.category}
                      </Badge>
                      <h3 className="font-bold text-sm text-foreground mb-1">{work.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{work.description}</p>
                      <div className="flex items-center justify-between mt-3">
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
        )}
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
