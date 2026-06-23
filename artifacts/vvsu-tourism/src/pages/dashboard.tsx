import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { motion } from "framer-motion";
import {
  useGetDashboardSummary, useGetProgressMap, useGetLeaderboard,
  useGetMyProfile, useUpdateMyProfile, getGetMyProfileQueryKey, getGetMeQueryKey,
  useAdminListUsers, useAdminGetStats, useAdminCreateCourse, useAdminCreateQuest,
  useAdminCreateNotification, getAdminGetStatsQueryKey,
  useAdminCreateQuiz, getListQuizzesQueryKey,
  getListCoursesQueryKey, getListQuestsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  BookOpen, Compass, Award, Star, Clock, ChevronRight, Trophy, Flame,
  Anchor, MapPin, Waves, Brain, Activity, Settings, MessageCircle,
  Sparkles, Lock, Map as MapIcon, Zap, Users, BarChart3, Shield, Plus,
  Bell, Send, AlertTriangle, Megaphone, RefreshCw, Info,
  X, Loader2, ImageIcon,
} from "lucide-react";

function ImageUploadField({ preview, label, onFile }: {
  preview: string;
  label: string;
  onFile: (file: File | null, preview: string) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onFile(file, ev.target?.result as string ?? "");
    reader.readAsDataURL(file);
  };
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="border-2 border-dashed border-border/60 rounded-xl overflow-hidden hover:border-primary/50 transition-colors">
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Превью" className="w-full max-h-44 object-cover" />
            <button type="button" onClick={() => onFile(null, "")} className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-destructive transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-2 p-6 cursor-pointer">
            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Выберите изображение</p>
              <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG, WebP, GIF — до 10 МБ</p>
            </div>
            <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
          </label>
        )}
      </div>
    </div>
  );
}

const roleLabels: Record<string, string> = {
  guide: "Экскурсовод", marketer: "Маркетолог", designer: "Дизайнер",
  operator: "Туроператор", admin: "Администратор",
};

type ActivityType = "module_complete" | "quest_complete" | "achievement" | "quiz" | "quest" | "community";
const activityConfig: Record<ActivityType | string, { icon: React.ReactNode; color: string; bg: string }> = {
  module_complete: { icon: <BookOpen className="h-3.5 w-3.5" />, color: "#033F7E", bg: "rgba(3,63,126,0.12)" },
  quest_complete:  { icon: <Compass className="h-3.5 w-3.5" />,  color: "#EB7124", bg: "rgba(235,113,36,0.12)" },
  quest:           { icon: <Compass className="h-3.5 w-3.5" />,  color: "#EB7124", bg: "rgba(235,113,36,0.12)" },
  achievement:     { icon: <Award className="h-3.5 w-3.5" />,    color: "#d97706", bg: "rgba(217,119,6,0.12)" },
  quiz:            { icon: <Brain className="h-3.5 w-3.5" />,    color: "#7c3aed", bg: "rgba(124,58,237,0.12)" },
  community:       { icon: <MessageCircle className="h-3.5 w-3.5" />, color: "#0891b2", bg: "rgba(8,145,178,0.12)" },
};
const defaultActivity = { icon: <Zap className="h-3.5 w-3.5" />, color: "#EB7124", bg: "rgba(235,113,36,0.12)" };

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "только что";
  if (mins < 60) return `${mins} мин. назад`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ч. назад`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} дн. назад`;
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

const iconMap: Record<string, React.ReactNode> = {
  anchor: <Anchor className="h-6 w-6" />,
  compass: <Compass className="h-6 w-6" />,
  ship: <Anchor className="h-6 w-6" />,
  "message-circle": <MessageCircle className="h-6 w-6" />,
  map: <MapIcon className="h-6 w-6" />,
  star: <Star className="h-6 w-6" />,
  award: <Award className="h-6 w-6" />,
  "book-open": <BookOpen className="h-6 w-6" />,
};

type Tab = "overview" | "achievements" | "activity" | "results" | "settings";
const VALID_TABS: Tab[] = ["overview", "achievements", "activity", "results", "settings"];

/* ─── Admin: notification categories ───────────────────────── */
const NOTIF_CATEGORIES = [
  { value: "urgent",    label: "Срочно",           icon: <Zap className="h-4 w-4 text-red-500" />,             color: "border-red-300 bg-red-50 dark:bg-red-950/30" },
  { value: "important", label: "Важно",             icon: <AlertTriangle className="h-4 w-4 text-orange-500" />, color: "border-orange-300 bg-orange-50 dark:bg-orange-950/30" },
  { value: "notice",    label: "Обратите внимание", icon: <Megaphone className="h-4 w-4 text-yellow-500" />,     color: "border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30" },
  { value: "update",    label: "Обновление",        icon: <RefreshCw className="h-4 w-4 text-blue-500" />,       color: "border-blue-300 bg-blue-50 dark:bg-blue-950/30" },
  { value: "info",      label: "Информация",        icon: <Info className="h-4 w-4 text-slate-500" />,           color: "border-slate-300 bg-slate-50 dark:bg-slate-900/30" },
];

function AdminOverview() {
  const { data: stats } = useAdminGetStats();
  const { data: users } = useAdminListUsers();
  const qc = useQueryClient();
  const { toast } = useToast();

  const statCards = stats ? [
    { icon: <Users className="h-5 w-5" />,     value: stats.totalUsers,              label: "Пользователей",          color: "#033F7E" },
    { icon: <Shield className="h-5 w-5" />,    value: stats.totalAdmins,             label: "Администраторов",        color: "#172E46" },
    { icon: <BookOpen className="h-5 w-5" />,  value: stats.totalCourses,            label: "Курсов",                 color: "#EB7124" },
    { icon: <Compass className="h-5 w-5" />,   value: stats.totalQuests,             label: "Квестов",                color: "#d97706" },
    { icon: <Brain className="h-5 w-5" />,     value: stats.totalQuizzes,            label: "Тестов",                 color: "#7c3aed" },
    { icon: <Activity className="h-5 w-5" />,  value: stats.totalCommunityPosts,     label: "Постов в сообществе",    color: "#0891b2" },
    { icon: <BarChart3 className="h-5 w-5" />, value: stats.quizAttemptsLast7d,      label: "Попыток тестов / 7 дн", color: "#059669" },
    { icon: <Trophy className="h-5 w-5" />,    value: stats.moduleCompletionsLast7d, label: "Модулей закрыто / 7 дн", color: "#ca8a04" },
  ] : [];

  const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/uploads", { method: "POST", body: fd });
    if (!res.ok) throw new Error("upload failed");
    const json = await res.json() as { url: string };
    return json.url;
  };

  /* ── Course form state ── */
  const [course, setCourse] = useState({ title: "", description: "", role: "guide", stage: "Бухта открытий", category: "tourism", xpReward: 100, imageUrl: "" });
  const [courseImageFile, setCourseImageFile] = useState<File | null>(null);
  const [courseImagePreview, setCourseImagePreview] = useState("");
  const [courseUploading, setCourseUploading] = useState(false);
  const createCourse = useAdminCreateCourse();
  const submitCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = course.imageUrl;
    if (courseImageFile) {
      setCourseUploading(true);
      try { imageUrl = await uploadFile(courseImageFile); }
      catch { toast({ title: "Ошибка загрузки изображения", variant: "destructive" }); setCourseUploading(false); return; }
      setCourseUploading(false);
    }
    createCourse.mutate({ data: { ...course, imageUrl, xpReward: Number(course.xpReward) } }, {
      onSuccess: () => {
        toast({ title: "Курс создан" });
        qc.invalidateQueries({ queryKey: getAdminGetStatsQueryKey() });
        qc.invalidateQueries({ queryKey: getListCoursesQueryKey() });
        setCourse({ title: "", description: "", role: "guide", stage: "Бухта открытий", category: "tourism", xpReward: 100, imageUrl: "" });
        setCourseImageFile(null); setCourseImagePreview("");
      },
      onError: () => toast({ title: "Ошибка при создании курса", variant: "destructive" }),
    });
  };

  /* ── Quest form state ── */
  const [quest, setQuest] = useState({ title: "", description: "", type: "exploration", difficulty: "medium", location: "", xpReward: 150, imageUrl: "" });
  const [questImageFile, setQuestImageFile] = useState<File | null>(null);
  const [questImagePreview, setQuestImagePreview] = useState("");
  const [questUploading, setQuestUploading] = useState(false);
  const createQuest = useAdminCreateQuest();
  const submitQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = quest.imageUrl;
    if (questImageFile) {
      setQuestUploading(true);
      try { imageUrl = await uploadFile(questImageFile); }
      catch { toast({ title: "Ошибка загрузки изображения", variant: "destructive" }); setQuestUploading(false); return; }
      setQuestUploading(false);
    }
    createQuest.mutate({ data: { ...quest, imageUrl, xpReward: Number(quest.xpReward) } }, {
      onSuccess: () => {
        toast({ title: "Квест создан" });
        qc.invalidateQueries({ queryKey: getAdminGetStatsQueryKey() });
        qc.invalidateQueries({ queryKey: getListQuestsQueryKey() });
        setQuest({ title: "", description: "", type: "exploration", difficulty: "medium", location: "", xpReward: 150, imageUrl: "" });
        setQuestImageFile(null); setQuestImagePreview("");
      },
      onError: () => toast({ title: "Ошибка при создании квеста", variant: "destructive" }),
    });
  };

  /* ── Quiz form state ── */
  type QuizQuestionForm = { question: string; options: [string, string, string, string]; correctIndex: number; explanation: string };
  const emptyQ = (): QuizQuestionForm => ({ question: "", options: ["", "", "", ""], correctIndex: 0, explanation: "" });
  const [quiz, setQuiz] = useState({ title: "", description: "", category: "history", difficulty: "easy", xpReward: 150, estimatedMinutes: 10, imageUrl: "" });
  const [quizImageFile, setQuizImageFile] = useState<File | null>(null);
  const [quizImagePreview, setQuizImagePreview] = useState("");
  const [quizUploading, setQuizUploading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestionForm[]>([emptyQ()]);
  const createQuiz = useAdminCreateQuiz();

  const addQuizQuestion = () => setQuizQuestions((prev) => [...prev, emptyQ()]);
  const removeQuizQuestion = (i: number) => setQuizQuestions((prev) => prev.filter((_, idx) => idx !== i));
  const updateQuizQ = (i: number, updates: Partial<QuizQuestionForm>) =>
    setQuizQuestions((prev) => prev.map((q, idx) => idx === i ? { ...q, ...updates } : q));
  const updateQuizOption = (qi: number, oi: number, value: string) =>
    setQuizQuestions((prev) => prev.map((q, idx) => {
      if (idx !== qi) return q;
      const options = [...q.options] as [string, string, string, string];
      options[oi] = value;
      return { ...q, options };
    }));

  const submitQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz.title.trim() || !quiz.description.trim()) return;
    const incomplete = quizQuestions.find((q) => !q.question.trim() || q.options.some((o) => !o.trim()));
    if (incomplete) { toast({ title: "Заполните все поля вопросов", variant: "destructive" }); return; }
    let imageUrl = quiz.imageUrl;
    if (quizImageFile) {
      setQuizUploading(true);
      try { imageUrl = await uploadFile(quizImageFile); }
      catch { toast({ title: "Ошибка загрузки изображения", variant: "destructive" }); setQuizUploading(false); return; }
      setQuizUploading(false);
    }
    createQuiz.mutate({
      data: {
        ...quiz,
        imageUrl,
        xpReward: Number(quiz.xpReward),
        estimatedMinutes: Number(quiz.estimatedMinutes),
        questions: quizQuestions.map((q) => ({ question: q.question, options: Array.from(q.options), correctIndex: q.correctIndex, explanation: q.explanation })),
      },
    }, {
      onSuccess: () => {
        toast({ title: "Тест создан", description: `«${quiz.title}» добавлен в список тестов.` });
        qc.invalidateQueries({ queryKey: getAdminGetStatsQueryKey() });
        qc.invalidateQueries({ queryKey: getListQuizzesQueryKey() });
        setQuiz({ title: "", description: "", category: "history", difficulty: "easy", xpReward: 150, estimatedMinutes: 10, imageUrl: "" });
        setQuizQuestions([emptyQ()]);
        setQuizImageFile(null); setQuizImagePreview("");
      },
      onError: () => toast({ title: "Ошибка при создании теста", variant: "destructive" }),
    });
  };

  /* ── Notification form state ── */
  const [notif, setNotif] = useState({ type: "info", title: "", body: "", link: "" });
  const [broadcast, setBroadcast] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const createNotif = useAdminCreateNotification();
  const students = users?.filter((u) => u.role !== "admin") ?? [];
  const selectedCategory = NOTIF_CATEGORIES.find((c) => c.value === notif.type);

  const toggleUser = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const submitNotif = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcast && selectedIds.size === 0) {
      toast({ title: "Выберите получателей", variant: "destructive" });
      return;
    }
    createNotif.mutate({
      data: { type: notif.type, title: notif.title, body: notif.body, link: notif.link || undefined, userIds: broadcast ? null : Array.from(selectedIds) },
    }, {
      onSuccess: (result) => {
        toast({ title: `Отправлено ${result.count} получателям!` });
        setNotif({ type: "info", title: "", body: "", link: "" });
        setSelectedIds(new Set());
        setBroadcast(true);
      },
      onError: () => toast({ title: "Ошибка отправки", variant: "destructive" }),
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Stats grid */}
      {stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statCards.map((s, i) => (
            <Card key={i} className="rounded-2xl border-border/60 overflow-hidden">
              <div className="h-1" style={{ background: s.color }} />
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-white" style={{ background: s.color }}>
                  {s.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold leading-none">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        </div>
      )}

      {/* 5-tab admin panel */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid grid-cols-5 max-w-2xl rounded-2xl">
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="notify" className="flex items-center gap-1">
            <Bell className="h-3.5 w-3.5" /> Уведомления
          </TabsTrigger>
          <TabsTrigger value="course">Новый курс</TabsTrigger>
          <TabsTrigger value="quest">Новый квест</TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-1">
            <Brain className="h-3.5 w-3.5" /> Новый тест
          </TabsTrigger>
        </TabsList>

        {/* ── Users tab ── */}
        <TabsContent value="users" className="mt-5">
          <Card className="rounded-2xl border-border/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="p-3 font-semibold">Имя</th>
                    <th className="p-3 font-semibold">Email</th>
                    <th className="p-3 font-semibold">Роль</th>
                    <th className="p-3 font-semibold">Уровень</th>
                    <th className="p-3 font-semibold">XP</th>
                    <th className="p-3 font-semibold">Тесты</th>
                    <th className="p-3 font-semibold">Квесты</th>
                    <th className="p-3 font-semibold">Регистрация</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((u) => (
                    <tr key={u.id} className="border-t border-border/50 hover:bg-muted/30">
                      <td className="p-3 font-medium">{u.name}</td>
                      <td className="p-3 text-muted-foreground">{u.email}</td>
                      <td className="p-3">
                        {u.role === "admin"
                          ? <Badge className="bg-accent text-white border-0">Админ</Badge>
                          : <Badge variant="outline">{roleLabels[u.studentRole] ?? u.studentRole}</Badge>}
                      </td>
                      <td className="p-3">{u.level}</td>
                      <td className="p-3 font-semibold" style={{ color: "#EB7124" }}>{u.xp}</td>
                      <td className="p-3">{u.completedQuizzes}</td>
                      <td className="p-3">{u.completedQuests}</td>
                      <td className="p-3 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString("ru-RU")}</td>
                      <td className="p-3">
                        <Link href={`/profile/${u.id}`} className="text-accent hover:underline text-xs">Профиль</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!users && <div className="p-6"><Skeleton className="h-32 rounded-xl" /></div>}
            </div>
          </Card>
        </TabsContent>

        {/* ── Notifications tab ── */}
        <TabsContent value="notify" className="mt-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-2xl border-border/60">
              <CardContent className="p-6">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-accent" /> Создать уведомление
                </h2>
                <form onSubmit={submitNotif} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Категория</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {NOTIF_CATEGORIES.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setNotif((s) => ({ ...s, type: cat.value }))}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                            notif.type === cat.value ? `${cat.color} border-current` : "border-border/50 hover:border-border bg-card"
                          }`}
                        >
                          {cat.icon} {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Заголовок</Label>
                    <Input required value={notif.title} onChange={(e) => setNotif((s) => ({ ...s, title: e.target.value }))} placeholder="Краткое и понятное название..." className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Текст уведомления</Label>
                    <Textarea required rows={4} value={notif.body} onChange={(e) => setNotif((s) => ({ ...s, body: e.target.value }))} placeholder="Подробное описание или инструкция..." className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Ссылка (опционально)</Label>
                    <Input value={notif.link} onChange={(e) => setNotif((s) => ({ ...s, link: e.target.value }))} placeholder="/cabinet/tasks или /cabinet/courses" className="rounded-xl" />
                    <p className="text-xs text-muted-foreground">Пользователь перейдёт по ссылке при клике на уведомление</p>
                  </div>
                  {notif.title && (
                    <div className={`rounded-xl border p-3 ${selectedCategory?.color ?? ""}`}>
                      <div className="flex items-start gap-2">
                        {selectedCategory?.icon}
                        <div>
                          <p className="font-medium text-sm">{notif.title}</p>
                          {notif.body && <p className="text-xs text-muted-foreground mt-0.5">{notif.body.slice(0, 100)}{notif.body.length > 100 ? "..." : ""}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                  <Button type="submit" className="w-full rounded-xl gap-2" disabled={createNotif.isPending}>
                    <Send className="h-4 w-4" />
                    {createNotif.isPending ? "Отправка..." : broadcast ? `Отправить всем студентам (${students.length})` : `Отправить выбранным (${selectedIds.size})`}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60">
              <CardContent className="p-6">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent" /> Получатели
                </h2>
                <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
                  <Checkbox id="broadcast" checked={broadcast} onCheckedChange={(v) => { setBroadcast(!!v); setSelectedIds(new Set()); }} />
                  <Label htmlFor="broadcast" className="cursor-pointer font-medium">Всем студентам ({students.length})</Label>
                </div>
                {!broadcast ? (
                  <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                    {students.map((u) => (
                      <label key={u.id} className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${selectedIds.has(u.id) ? "bg-primary/8 border border-primary/20" : "hover:bg-muted/50"}`}>
                        <Checkbox checked={selectedIds.has(u.id)} onCheckedChange={() => toggleUser(u.id)} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{u.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-8">Уведомление получат все студенты платформы</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── New Course tab ── */}
        <TabsContent value="course" className="mt-5">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="rounded-2xl border-border/60 lg:col-span-3">
              <CardContent className="p-6">
                <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-accent" /> Создать курс
                </h2>
                <form onSubmit={submitCourse} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Название курса <span className="text-destructive">*</span></Label>
                    <Input required value={course.title} onChange={(e) => setCourse((s) => ({ ...s, title: e.target.value }))} placeholder="Введите название..." className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Описание <span className="text-destructive">*</span></Label>
                    <Textarea rows={4} required value={course.description} onChange={(e) => setCourse((s) => ({ ...s, description: e.target.value }))} placeholder="Опишите содержание и цели курса..." className="rounded-xl resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Специализация</Label>
                      <Select value={course.role} onValueChange={(v) => setCourse((s) => ({ ...s, role: v }))}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="guide">Экскурсовод</SelectItem>
                          <SelectItem value="marketer">Маркетолог</SelectItem>
                          <SelectItem value="designer">Дизайнер</SelectItem>
                          <SelectItem value="operator">Туроператор</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Категория</Label>
                      <Select value={course.category} onValueChange={(v) => setCourse((s) => ({ ...s, category: v }))}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tourism">Туризм</SelectItem>
                          <SelectItem value="marketing">Маркетинг</SelectItem>
                          <SelectItem value="design">Дизайн</SelectItem>
                          <SelectItem value="ecology">Экология</SelectItem>
                          <SelectItem value="gastronomy">Гастрономия</SelectItem>
                          <SelectItem value="culture">Культура</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Этап пути</Label>
                      <Select value={course.stage} onValueChange={(v) => setCourse((s) => ({ ...s, stage: v }))}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Бухта открытий">Бухта открытий</SelectItem>
                          <SelectItem value="Мыс знаний">Мыс знаний</SelectItem>
                          <SelectItem value="Архипелаг практики">Архипелаг практики</SelectItem>
                          <SelectItem value="Пролив испытаний">Пролив испытаний</SelectItem>
                          <SelectItem value="Тихоокеанский горизонт">Тихоокеанский горизонт</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>XP награда</Label>
                      <Input type="number" min={10} max={2000} value={course.xpReward} onChange={(e) => setCourse((s) => ({ ...s, xpReward: Number(e.target.value) }))} className="rounded-xl" />
                    </div>
                  </div>
                  <ImageUploadField
                    label="Обложка курса"
                    preview={courseImagePreview}
                    onFile={(file, prev) => { setCourseImageFile(file); setCourseImagePreview(prev); }}
                  />
                  <Button type="submit" className="w-full rounded-full gap-2" disabled={createCourse.isPending || courseUploading}>
                    {courseUploading
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> Загрузка изображения...</>
                      : createCourse.isPending
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> Создание курса...</>
                      : <><Plus className="h-4 w-4" /> Создать курс</>}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Preview */}
            <div className="lg:col-span-2 space-y-3">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"><Sparkles className="h-4 w-4" /> Предварительный вид</p>
              <Card className="rounded-2xl border-border/60 overflow-hidden">
                {courseImagePreview
                  ? <img src={courseImagePreview} alt="" className="w-full h-40 object-cover" />
                  : <div className="h-40 bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center"><BookOpen className="h-14 w-14 text-primary/20" /></div>
                }
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">{roleLabels[course.role] ?? course.role}</Badge>
                    <Badge variant="secondary" className="text-xs">{course.stage}</Badge>
                  </div>
                  <h3 className="font-bold leading-snug">{course.title || <span className="text-muted-foreground font-normal italic">Название курса</span>}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{course.description || "Описание появится здесь"}</p>
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-muted-foreground">{course.category}</span>
                    <span className="text-accent font-bold">+{course.xpReward} XP</span>
                  </div>
                </CardContent>
              </Card>
              <div className="rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-medium">Подсказка</p>
                <p>После создания курса добавьте модули через страницу управления курсами. Каждый модуль может быть видео, интерактивом или тестом.</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── New Quiz tab ── */}
        <TabsContent value="quiz" className="mt-5">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="rounded-2xl border-border/60 lg:col-span-3">
              <CardContent className="p-6">
                <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-accent" /> Создать тест
                </h2>
                <form onSubmit={submitQuiz} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Название теста <span className="text-destructive">*</span></Label>
                    <Input required value={quiz.title} onChange={(e) => setQuiz((s) => ({ ...s, title: e.target.value }))} placeholder="Например: История Владивостока" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Описание <span className="text-destructive">*</span></Label>
                    <Textarea rows={3} required value={quiz.description} onChange={(e) => setQuiz((s) => ({ ...s, description: e.target.value }))} placeholder="Кратко опишите тему теста..." className="rounded-xl resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Категория</Label>
                      <Select value={quiz.category} onValueChange={(v) => setQuiz((s) => ({ ...s, category: v }))}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="history">🏛 История</SelectItem>
                          <SelectItem value="geography">🗺 География</SelectItem>
                          <SelectItem value="nature">🌿 Природа</SelectItem>
                          <SelectItem value="culture">🎭 Культура</SelectItem>
                          <SelectItem value="tourism">✈️ Туризм</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Сложность</Label>
                      <Select value={quiz.difficulty} onValueChange={(v) => setQuiz((s) => ({ ...s, difficulty: v }))}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">🟢 Лёгкий</SelectItem>
                          <SelectItem value="medium">🟡 Средний</SelectItem>
                          <SelectItem value="hard">🔴 Сложный</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>XP награда</Label>
                      <Input type="number" min={10} max={2000} value={quiz.xpReward} onChange={(e) => setQuiz((s) => ({ ...s, xpReward: Number(e.target.value) }))} className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Время (мин)</Label>
                      <Input type="number" min={1} max={120} value={quiz.estimatedMinutes} onChange={(e) => setQuiz((s) => ({ ...s, estimatedMinutes: Number(e.target.value) }))} className="rounded-xl" />
                    </div>
                  </div>
                  <ImageUploadField
                    label="Обложка теста"
                    preview={quizImagePreview}
                    onFile={(file, prev) => { setQuizImageFile(file); setQuizImagePreview(prev); }}
                  />

                  {/* Questions */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Вопросы ({quizQuestions.length})</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addQuizQuestion} className="rounded-xl gap-1.5 text-xs">
                        <Plus className="h-3.5 w-3.5" /> Добавить вопрос
                      </Button>
                    </div>
                    {quizQuestions.map((q, qi) => (
                      <div key={qi} className="rounded-xl border border-border/60 p-4 space-y-3 bg-muted/20">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-muted-foreground">Вопрос {qi + 1}</span>
                          {quizQuestions.length > 1 && (
                            <button type="button" onClick={() => removeQuizQuestion(qi)} className="h-6 w-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors">
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Текст вопроса <span className="text-destructive">*</span></Label>
                          <Textarea rows={2} value={q.question} onChange={(e) => updateQuizQ(qi, { question: e.target.value })} placeholder="Введите вопрос..." className="rounded-lg resize-none text-sm" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Варианты ответов (отметьте правильный)</Label>
                          <div className="space-y-2">
                            {q.options.map((opt, oi) => (
                              <div key={oi} className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateQuizQ(qi, { correctIndex: oi })}
                                  className={`h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                                    q.correctIndex === oi
                                      ? "border-green-500 bg-green-500"
                                      : "border-border hover:border-green-400"
                                  }`}
                                >
                                  {q.correctIndex === oi && <div className="h-2 w-2 rounded-full bg-white" />}
                                </button>
                                <Input
                                  value={opt}
                                  onChange={(e) => updateQuizOption(qi, oi, e.target.value)}
                                  placeholder={`Вариант ${oi + 1}`}
                                  className={`rounded-lg text-sm h-8 flex-1 ${q.correctIndex === oi ? "border-green-500/50 bg-green-50/50 dark:bg-green-950/20" : ""}`}
                                />
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">Нажмите на кружок слева чтобы отметить правильный ответ</p>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Объяснение (показывается после ответа)</Label>
                          <Input value={q.explanation} onChange={(e) => updateQuizQ(qi, { explanation: e.target.value })} placeholder="Почему этот ответ правильный..." className="rounded-lg text-sm" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button type="submit" className="w-full rounded-full gap-2" disabled={createQuiz.isPending || quizUploading}>
                    {quizUploading
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> Загрузка изображения...</>
                      : createQuiz.isPending
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> Создание теста...</>
                      : <><Plus className="h-4 w-4" /> Создать тест</>}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Preview */}
            <div className="lg:col-span-2 space-y-3">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"><Sparkles className="h-4 w-4" /> Предварительный вид</p>
              <Card className="rounded-2xl border-border/60 overflow-hidden">
                {quizImagePreview
                  ? <img src={quizImagePreview} alt="" className="w-full h-40 object-cover" />
                  : <div className="h-40 bg-gradient-to-br from-violet-500/10 to-purple-600/10 flex items-center justify-center"><Brain className="h-14 w-14 text-violet-400/30" /></div>
                }
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs capitalize">{quiz.category}</Badge>
                    <Badge variant={quiz.difficulty === "hard" ? "destructive" : quiz.difficulty === "medium" ? "secondary" : "outline"} className="text-xs">
                      {quiz.difficulty === "easy" ? "Лёгкий" : quiz.difficulty === "medium" ? "Средний" : "Сложный"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{quiz.estimatedMinutes} мин</span>
                  </div>
                  <h3 className="font-bold leading-snug">{quiz.title || <span className="text-muted-foreground font-normal italic">Название теста</span>}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{quiz.description || "Описание теста появится здесь"}</p>
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-muted-foreground">{quizQuestions.length} {quizQuestions.length === 1 ? "вопрос" : quizQuestions.length < 5 ? "вопроса" : "вопросов"}</span>
                    <span className="text-accent font-bold">+{quiz.xpReward} XP</span>
                  </div>
                </CardContent>
              </Card>
              <div className="rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-medium">Подсказка</p>
                <p>Добавьте минимум 1 вопрос с 4 вариантами ответа. Зелёный кружок означает правильный ответ. Объяснение показывается студенту после прохождения теста.</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── New Quest tab ── */}
        <TabsContent value="quest" className="mt-5">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="rounded-2xl border-border/60 lg:col-span-3">
              <CardContent className="p-6">
                <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
                  <Compass className="h-5 w-5 text-accent" /> Создать квест
                </h2>
                <form onSubmit={submitQuest} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Название квеста <span className="text-destructive">*</span></Label>
                    <Input required value={quest.title} onChange={(e) => setQuest((s) => ({ ...s, title: e.target.value }))} placeholder="Введите название..." className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Описание задания <span className="text-destructive">*</span></Label>
                    <Textarea rows={4} required value={quest.description} onChange={(e) => setQuest((s) => ({ ...s, description: e.target.value }))} placeholder="Опишите задание, что нужно сделать студенту..." className="rounded-xl resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Тип</Label>
                      <Select value={quest.type} onValueChange={(v) => setQuest((s) => ({ ...s, type: v }))}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="exploration">🗺 Исследование</SelectItem>
                          <SelectItem value="creative">🎨 Творческое</SelectItem>
                          <SelectItem value="research">🔬 Аналитика</SelectItem>
                          <SelectItem value="practice">⚙️ Практика</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Сложность</Label>
                      <Select value={quest.difficulty} onValueChange={(v) => setQuest((s) => ({ ...s, difficulty: v }))}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">🟢 Лёгкий</SelectItem>
                          <SelectItem value="medium">🟡 Средний</SelectItem>
                          <SelectItem value="hard">🔴 Сложный</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2 col-span-2">
                      <Label>Место во Владивостоке <span className="text-destructive">*</span></Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input required value={quest.location} onChange={(e) => setQuest((s) => ({ ...s, location: e.target.value }))} className="rounded-xl pl-9" placeholder="Напр.: Золотой мост, Маяк Эгершельд..." />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>XP награда</Label>
                    <Input type="number" min={10} max={2000} value={quest.xpReward} onChange={(e) => setQuest((s) => ({ ...s, xpReward: Number(e.target.value) }))} className="rounded-xl" />
                  </div>
                  <ImageUploadField
                    label="Изображение квеста"
                    preview={questImagePreview}
                    onFile={(file, prev) => { setQuestImageFile(file); setQuestImagePreview(prev); }}
                  />
                  <Button type="submit" className="w-full rounded-full gap-2" disabled={createQuest.isPending || questUploading}>
                    {questUploading
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> Загрузка изображения...</>
                      : createQuest.isPending
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> Создание квеста...</>
                      : <><Plus className="h-4 w-4" /> Создать квест</>}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Preview */}
            <div className="lg:col-span-2 space-y-3">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"><Sparkles className="h-4 w-4" /> Предварительный вид</p>
              <Card className="rounded-2xl border-border/60 overflow-hidden">
                {questImagePreview
                  ? <img src={questImagePreview} alt="" className="w-full h-40 object-cover" />
                  : <div className="h-40 bg-gradient-to-br from-accent/10 to-orange-400/10 flex items-center justify-center"><Compass className="h-14 w-14 text-accent/20" /></div>
                }
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs capitalize">{quest.type}</Badge>
                    <Badge variant={quest.difficulty === "hard" ? "destructive" : quest.difficulty === "medium" ? "secondary" : "outline"} className="text-xs">
                      {quest.difficulty === "easy" ? "Лёгкий" : quest.difficulty === "medium" ? "Средний" : "Сложный"}
                    </Badge>
                  </div>
                  <h3 className="font-bold leading-snug">{quest.title || <span className="text-muted-foreground font-normal italic">Название квеста</span>}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{quest.description || "Описание задания появится здесь"}</p>
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" /> {quest.location || "Место не задано"}</span>
                    <span className="text-accent font-bold">+{quest.xpReward} XP</span>
                  </div>
                </CardContent>
              </Card>
              <div className="rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-medium">Подсказка</p>
                <p>Студент загружает фото или текстовый ответ. Привязывайте квесты к реальным местам Владивостока для лучшей вовлечённости.</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

/* ─── Main Dashboard ────────────────────────────────────────── */
export default function Dashboard() {
  const search = useSearch();
  const tabParam = (new URLSearchParams(search).get("tab") ?? "overview") as Tab;
  const initialTab = VALID_TABS.includes(tabParam) ? tabParam : "overview";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  useEffect(() => {
    const t = (new URLSearchParams(search).get("tab") ?? "overview") as Tab;
    if (VALID_TABS.includes(t)) setActiveTab(t);
  }, [search]);

  const { user, isAdmin } = useAuth();
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary();
  const { data: progressMap, isLoading: mapLoading } = useGetProgressMap();
  const { data: leaderboard, isLoading: lbLoading } = useGetLeaderboard();
  const { data: profile, isLoading: profileLoading } = useGetMyProfile();
  const update = useUpdateMyProfile();
  const qc = useQueryClient();
  const { toast } = useToast();

  const [edit, setEdit] = useState({
    name: user?.name ?? "",
    bio: user?.bio ?? "",
    avatarUrl: user?.avatarUrl ?? "",
    studentRole: user?.studentRole ?? "guide",
  });

  const profileXpPercent = profile
    ? Math.round((profile.currentLevelXp / Math.max(profile.currentLevelXp + profile.nextLevelXp, 1)) * 100)
    : 0;

  const saveProfile = () => {
    update.mutate({ data: edit }, {
      onSuccess: async () => {
        await Promise.all([
          qc.invalidateQueries({ queryKey: getGetMyProfileQueryKey() }),
          qc.invalidateQueries({ queryKey: getGetMeQueryKey() }),
        ]);
        toast({ title: "Профиль обновлён", description: "Изменения сохранены." });
      },
      onError: () => toast({ title: "Не удалось сохранить", variant: "destructive" }),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Hero */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #172E46 0%, #033F7E 55%, #0a2d5c 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="hsl(var(--background))" />
          </svg>
          <div className="absolute top-6 right-12 opacity-10">
            <Waves className="h-40 w-40 text-white" />
          </div>
          <div className="absolute -top-4 -left-4 opacity-5">
            <Anchor className="h-56 w-56 text-white" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-10 pb-16">
          {profileLoading ? (
            <div className="flex gap-5 items-center">
              <Skeleton className="h-24 w-24 rounded-full bg-white/10" />
              <div className="space-y-3">
                <Skeleton className="h-8 w-48 bg-white/10" />
                <Skeleton className="h-4 w-64 bg-white/10" />
                <Skeleton className="h-3 w-56 bg-white/10" />
              </div>
            </div>
          ) : profile ? (
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <Avatar className="h-24 w-24 ring-4 ring-white/20 shrink-0">
                    <AvatarImage src={profile.user.avatarUrl || undefined} />
                    <AvatarFallback className="bg-accent text-white text-xl font-bold">
                      {profile.user.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {isAdmin
                        ? <><Shield className="h-4 w-4 text-accent" /><span className="text-white/50 text-xs uppercase tracking-widest font-medium">Панель администратора</span></>
                        : <><Anchor className="h-4 w-4 text-accent" /><span className="text-white/50 text-xs uppercase tracking-widest font-medium">Личный кабинет</span></>
                      }
                    </div>
                    <h1 className="text-3xl font-bold text-white leading-tight">{profile.user.name}</h1>
                    <p className="text-white/60 mt-1 text-sm">
                      {profile.user.email}
                      {isAdmin && (
                        <Badge className="ml-2 bg-accent text-white border-0 text-xs">Администратор</Badge>
                      )}
                    </p>
                    {!isAdmin && (
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <Badge variant="secondary" className="rounded-full text-xs">
                          {roleLabels[profile.user.studentRole] ?? profile.user.studentRole}
                        </Badge>
                        <span className="text-white/70 text-xs flex items-center gap-1">
                          <Trophy className="h-3.5 w-3.5 text-accent" /> Уровень {profile.user.level}
                        </span>
                        <span className="text-white/70 text-xs flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5 text-accent" /> {profile.user.xp} XP
                        </span>
                      </div>
                    )}
                    {profile.user.bio && (
                      <p className="text-white/70 text-sm mt-2 max-w-lg">{profile.user.bio}</p>
                    )}
                  </div>
                </div>

                {/* XP progress block — students only */}
                {!isAdmin && (
                  <div
                    className="flex flex-col gap-3 rounded-2xl p-5 min-w-[240px]"
                    style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.10)" }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-accent" />
                        <span className="text-2xl font-bold text-white">
                          {profile.user.xp.toLocaleString()}
                          <span className="text-base font-normal text-white/50 ml-1">XP</span>
                        </span>
                      </div>
                      <Badge className="text-xs font-bold border-0 px-3" style={{ background: "#EB7124", color: "#fff" }}>
                        Уровень {profile.user.level}
                      </Badge>
                    </div>
                    <div>
                      <div className="relative h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.12)" }}>
                        <div
                          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                          style={{ width: `${profileXpPercent}%`, background: "linear-gradient(90deg, #EB7124, #f59e0b)" }}
                        />
                      </div>
                      <p className="text-xs text-white/40 mt-1.5 text-right">
                        Ещё {profile.nextLevelXp} XP до уровня {profile.user.level + 1}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                      <div className="text-center">
                        <p className="text-white text-lg font-bold">{profile.unlockedAchievements.length}</p>
                        <p className="text-white/50 text-xs">Достижений</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white text-lg font-bold">{profile.completedQuests}</p>
                        <p className="text-white/50 text-xs">Квестов</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-10 mt-8">
        {/* ── ОБЗОР АДМИНА ──────────────────────────────────── */}
        {activeTab === "overview" && isAdmin && <AdminOverview />}

        {/* ── ОБЗОР СТУДЕНТА ────────────────────────────────── */}
        {activeTab === "overview" && !isAdmin && (
          <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Journey Map */}
              <div className="lg:col-span-2">
                <Card className="rounded-2xl border-border/60 overflow-hidden">
                  <div className="h-1" style={{ background: "linear-gradient(90deg, #172E46, #033F7E, #EB7124)" }} />
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="flex items-center gap-2 text-primary text-base">
                      <MapPin className="h-4 w-4 text-accent" /> Карта путешествия
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {mapLoading ? (
                      <div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
                    ) : progressMap ? (
                      <div className="relative">
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                        <div className="space-y-4">
                          {progressMap.stages.map((stage, i) => (
                            <div key={stage.id} className="flex gap-4 items-start pl-2">
                              <div className={`relative z-10 flex-shrink-0 h-10 w-10 rounded-full border-2 flex items-center justify-center text-sm font-bold shadow-sm ${
                                stage.isCompleted ? "text-white border-[#033F7E]"
                                  : stage.isCurrent ? "text-white border-[#EB7124] animate-pulse"
                                  : stage.isLocked ? "bg-muted border-muted text-muted-foreground"
                                  : "bg-background border-border text-foreground"
                              }`} style={stage.isCompleted ? { background: "#033F7E" } : stage.isCurrent ? { background: "#EB7124" } : {}}>
                                {stage.isCompleted ? "✓" : i + 1}
                              </div>
                              <div className={`flex-1 p-3 rounded-xl border transition-all ${
                                stage.isCurrent ? "border-[#EB7124]/30 bg-[#EB7124]/5"
                                  : stage.isCompleted ? "border-[#033F7E]/20 bg-[#033F7E]/5"
                                  : "border-border/40 bg-muted/20"
                              }`}>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className={`font-semibold text-sm ${stage.isLocked ? "text-muted-foreground" : "text-foreground"}`}>{stage.name}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                      <MapPin className="h-3 w-3" /> {stage.location}
                                    </p>
                                  </div>
                                  {stage.isCurrent && <Badge className="border-0 text-white text-xs" style={{ background: "#EB7124" }}>Текущий</Badge>}
                                  {stage.isLocked && <span className="text-xs text-muted-foreground">{stage.xpRequired} XP</span>}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                {/* Recent Activity */}
                <Card className="rounded-2xl border-border/60 overflow-hidden">
                  <div className="h-1" style={{ background: "linear-gradient(90deg, #EB7124, #d97706)" }} />
                  <CardHeader className="pb-3 pt-4">
                    <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Activity className="h-4 w-4 text-accent" /> Последняя активность
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 space-y-2">
                    {summaryLoading ? (
                      [1,2,3].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />)
                    ) : summary?.recentActivity.length ? (
                      summary.recentActivity.map((item) => {
                        const cfg = activityConfig[item.type] ?? defaultActivity;
                        return (
                          <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:bg-muted/30 transition-colors">
                            <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: cfg.bg, color: cfg.color }}>
                              {cfg.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-foreground line-clamp-2 leading-snug font-medium">{item.description}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{relativeTime(item.timestamp)}</p>
                            </div>
                            {item.xpEarned > 0 && (
                              <span className="text-xs font-bold shrink-0 px-2 py-0.5 rounded-full" style={{ background: "rgba(235,113,36,0.1)", color: "#EB7124" }}>
                                +{item.xpEarned}
                              </span>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-6 text-center">
                        <Activity className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                        <p className="text-xs text-muted-foreground">Активность пока отсутствует</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Проходите курсы и квесты</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Deadlines */}
                <Card className="rounded-2xl border-border/60 overflow-hidden">
                  <div className="h-1" style={{ background: "#033F7E" }} />
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" /> Ближайшие дедлайны
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {summaryLoading ? [1,2].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />) :
                      summary?.upcomingDeadlines.length ? summary.upcomingDeadlines.map((d) => (
                        <div key={d.id} className="p-3 rounded-xl border border-border/60 bg-background">
                          <p className="text-sm font-medium text-foreground line-clamp-1">{d.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{d.courseTitle}</p>
                          <p className="text-xs font-medium mt-1" style={{ color: "#EB7124" }}>
                            {new Date(d.dueDate).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
                          </p>
                        </div>
                      )) : <p className="text-xs text-muted-foreground py-2 text-center">Дедлайнов нет</p>
                    }
                  </CardContent>
                </Card>

                {/* Mini Leaderboard */}
                <Card className="rounded-2xl border-border/60 overflow-hidden">
                  <div className="h-1" style={{ background: "linear-gradient(90deg, #172E46, #033F7E)" }} />
                  <CardHeader className="pb-2 pt-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Trophy className="h-3.5 w-3.5 text-yellow-500" /> Топ студентов
                    </CardTitle>
                    <Button variant="ghost" size="sm" asChild className="text-xs h-7 px-2">
                      <Link href="/leaderboard">Все <ChevronRight className="h-3 w-3 ml-0.5" /></Link>
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-1.5">
                    {lbLoading ? [1,2,3].map(i => <Skeleton key={i} className="h-10 w-full rounded-xl" />) :
                      leaderboard?.length ? leaderboard.slice(0, 4).map((entry) => (
                        <div key={entry.rank} className="flex items-center gap-3 p-2 rounded-xl transition-colors hover:bg-muted/40" style={entry.rank <= 3 ? { background: "rgba(235,113,36,0.05)" } : {}}>
                          <span className={`text-sm font-bold w-5 text-center shrink-0 ${entry.rank === 1 ? "text-yellow-500" : entry.rank === 2 ? "text-gray-400" : entry.rank === 3 ? "text-amber-600" : "text-muted-foreground"}`}>{entry.rank}</span>
                          <img src={entry.avatarUrl || undefined} alt={entry.studentName} className="h-7 w-7 rounded-full object-cover ring-1 ring-border" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{entry.studentName}</p>
                            <p className="text-xs text-muted-foreground">Ур. {entry.level}</p>
                          </div>
                          <span className="text-xs font-bold" style={{ color: "#EB7124" }}>{entry.xp.toLocaleString()}</span>
                        </div>
                      )) : <p className="text-xs text-muted-foreground py-2 text-center">Пока нет студентов</p>
                    }
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── ДОСТИЖЕНИЯ (только студенты) ─────────────────── */}
        {activeTab === "achievements" && !isAdmin && (
          <motion.div key="achievements" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            {profileLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
              </div>
            ) : profile?.unlockedAchievements.length === 0 ? (
              <Card className="rounded-2xl border-dashed">
                <CardContent className="p-10 text-center text-muted-foreground">
                  <Lock className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  Пока нет открытых достижений. Проходите тесты и квесты, чтобы получить первые!
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile?.unlockedAchievements.map((a, i) => (
                  <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="rounded-2xl border-border/60 hover:shadow-md transition-shadow">
                      <CardContent className="p-5 flex gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                          {iconMap[a.iconType] ?? <Award className="h-6 w-6" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold">{a.name}</h3>
                          <p className="text-sm text-muted-foreground">{a.description}</p>
                          <div className="flex items-center justify-between mt-2 text-xs">
                            <span className="text-accent font-semibold">+{a.xpReward} XP</span>
                            <span className="text-muted-foreground">{new Date(a.unlockedAt).toLocaleDateString("ru-RU")}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── АКТИВНОСТЬ (только студенты) ─────────────────── */}
        {activeTab === "activity" && !isAdmin && (
          <motion.div key="activity" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="rounded-2xl border-border/60">
              <CardContent className="p-5">
                {profileLoading ? (
                  <div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
                ) : profile?.recentActivity.length === 0 ? (
                  <div className="py-10 text-center">
                    <Activity className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
                    <p className="text-muted-foreground">История активности пуста.</p>
                    <p className="text-sm text-muted-foreground/60 mt-1">Проходите курсы и квесты, чтобы увидеть активность здесь.</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {profile?.recentActivity.map((a) => {
                      const cfg = activityConfig[a.type] ?? defaultActivity;
                      return (
                        <li key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:bg-muted/30 transition-colors">
                          <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: cfg.bg, color: cfg.color }}>
                            {cfg.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground font-medium">{a.description}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(a.createdAt).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                          {a.xpEarned > 0 && (
                            <span className="text-xs font-bold shrink-0 px-2.5 py-1 rounded-full" style={{ background: "rgba(235,113,36,0.1)", color: "#EB7124" }}>
                              +{a.xpEarned} XP
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── РЕЗУЛЬТАТЫ (только студенты) ─────────────────── */}
        {activeTab === "results" && !isAdmin && (
          <motion.div key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <Card className="rounded-2xl border-border/60">
              <CardContent className="p-5">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Brain className="h-5 w-5 text-secondary" /> История тестов</h3>
                {profileLoading ? <Skeleton className="h-32 rounded-xl" /> :
                  profile?.quizHistory.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Вы ещё не проходили тесты. <Link href="/cabinet/tasks" className="text-accent hover:underline">Начать сейчас</Link></p>
                  ) : (
                    <ul className="space-y-2">
                      {profile?.quizHistory.map((h) => (
                        <li key={h.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                          <div>
                            <p className="font-semibold text-sm">{h.quizTitle}</p>
                            <p className="text-xs text-muted-foreground">{new Date(h.createdAt).toLocaleString("ru-RU")}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={h.passed ? "default" : "outline"}>{h.score}/{h.total}</Badge>
                            <span className="text-sm text-accent font-semibold">+{h.xpEarned} XP</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )
                }
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-border/60">
              <CardContent className="p-5">
                <h3 className="font-bold mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Прогресс по курсам</h3>
                {profileLoading ? <Skeleton className="h-32 rounded-xl" /> :
                  profile?.completedCourses.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Вы ещё не открывали модули курсов.</p>
                  ) : (
                    <ul className="space-y-3">
                      {profile?.completedCourses.map((c) => (
                        <li key={c.courseId}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-semibold">{c.title}</span>
                            <span className="text-muted-foreground">{c.completedModules} / {c.totalModules}</span>
                          </div>
                          <Progress value={c.totalModules > 0 ? (c.completedModules / c.totalModules) * 100 : 0} className="h-2" />
                        </li>
                      ))}
                    </ul>
                  )
                }
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── НАСТРОЙКИ ────────────────────────────────────────── */}
        {activeTab === "settings" && (
          <motion.div key="settings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="rounded-2xl border-border/60 max-w-2xl">
              <CardContent className="p-6 space-y-5">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Settings className="h-5 w-5 text-accent" /> Настройки профиля
                </h2>
                <div className="space-y-2">
                  <Label>Имя</Label>
                  <Input value={edit.name} onChange={(e) => setEdit((s) => ({ ...s, name: e.target.value }))} className="rounded-xl" placeholder="Ваше полное имя" data-testid="input-edit-name" />
                </div>
                <div className="space-y-2">
                  <Label>О себе</Label>
                  <Textarea rows={3} value={edit.bio} onChange={(e) => setEdit((s) => ({ ...s, bio: e.target.value }))} className="rounded-xl" placeholder="Расскажите о себе..." data-testid="input-edit-bio" />
                </div>
                <div className="space-y-2">
                  <Label>Ссылка на аватар (URL)</Label>
                  <Input value={edit.avatarUrl} onChange={(e) => setEdit((s) => ({ ...s, avatarUrl: e.target.value }))} className="rounded-xl" placeholder="https://..." data-testid="input-edit-avatar" />
                  {edit.avatarUrl && (
                    <img src={edit.avatarUrl} alt="preview" className="h-16 w-16 rounded-full object-cover ring-2 ring-border mt-2" />
                  )}
                </div>
                {!isAdmin && (
                  <div className="space-y-2">
                    <Label>Специализация</Label>
                    <Select value={edit.studentRole} onValueChange={(v) => setEdit((s) => ({ ...s, studentRole: v }))}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guide">Экскурсовод</SelectItem>
                        <SelectItem value="marketer">Маркетолог</SelectItem>
                        <SelectItem value="designer">Дизайнер</SelectItem>
                        <SelectItem value="operator">Туроператор</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button onClick={saveProfile} disabled={update.isPending} className="rounded-full" data-testid="button-save-profile">
                  {update.isPending ? "Сохранение..." : "Сохранить изменения"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
