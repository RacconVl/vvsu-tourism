import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  useAdminListUsers,
  useAdminGetStats,
  useAdminCreateCourse,
  useAdminCreateQuest,
  useAdminCreateNotification,
  getAdminListUsersQueryKey,
  getAdminGetStatsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Users, BarChart3, BookOpen, Compass, Plus, Shield, Trophy, Brain,
  Activity, Bell, Zap, AlertTriangle, Megaphone, RefreshCw, Info, Send,
} from "lucide-react";

const NOTIF_CATEGORIES = [
  { value: "urgent",    label: "Срочно",           icon: <Zap className="h-4 w-4 text-red-500" />,    color: "border-red-300 bg-red-50 dark:bg-red-950/30" },
  { value: "important", label: "Важно",             icon: <AlertTriangle className="h-4 w-4 text-orange-500" />, color: "border-orange-300 bg-orange-50 dark:bg-orange-950/30" },
  { value: "notice",    label: "Обратите внимание", icon: <Megaphone className="h-4 w-4 text-yellow-500" />, color: "border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30" },
  { value: "update",    label: "Обновление",        icon: <RefreshCw className="h-4 w-4 text-blue-500" />,   color: "border-blue-300 bg-blue-50 dark:bg-blue-950/30" },
  { value: "info",      label: "Информация",        icon: <Info className="h-4 w-4 text-slate-500" />,       color: "border-slate-300 bg-slate-50 dark:bg-slate-900/30" },
];

export default function AdminPage() {
  const { data: users } = useAdminListUsers();
  const { data: stats } = useAdminGetStats();

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-6 w-6 text-accent" />
            <span className="text-muted-foreground uppercase tracking-widest text-xs">Администратор</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Панель управления</h1>
          <p className="text-muted-foreground mt-2">Статистика платформы, пользователи и контент</p>
        </motion.div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<Users className="h-5 w-5" />} value={stats.totalUsers} label="Пользователей" />
            <StatCard icon={<Shield className="h-5 w-5" />} value={stats.totalAdmins} label="Администраторов" />
            <StatCard icon={<BookOpen className="h-5 w-5" />} value={stats.totalCourses} label="Курсов" />
            <StatCard icon={<Compass className="h-5 w-5" />} value={stats.totalQuests} label="Квестов" />
            <StatCard icon={<Brain className="h-5 w-5" />} value={stats.totalQuizzes} label="Тестов" />
            <StatCard icon={<Activity className="h-5 w-5" />} value={stats.totalCommunityPosts} label="Постов" />
            <StatCard icon={<BarChart3 className="h-5 w-5" />} value={stats.quizAttemptsLast7d} label="Попыток тестов / 7 дн." />
            <StatCard icon={<Trophy className="h-5 w-5" />} value={stats.moduleCompletionsLast7d} label="Модулей закрыто / 7 дн." />
          </div>
        )}

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid grid-cols-4 max-w-lg rounded-2xl">
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="notify" className="flex items-center gap-1">
              <Bell className="h-3.5 w-3.5" /> Уведомления
            </TabsTrigger>
            <TabsTrigger value="course">Новый курс</TabsTrigger>
            <TabsTrigger value="quest">Новый квест</TabsTrigger>
          </TabsList>

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
                            ? <Badge className="bg-accent text-white border-0">админ</Badge>
                            : <Badge variant="outline">{u.studentRole}</Badge>}
                        </td>
                        <td className="p-3">{u.level}</td>
                        <td className="p-3">{u.xp}</td>
                        <td className="p-3">{u.completedQuizzes}</td>
                        <td className="p-3">{u.completedQuests}</td>
                        <td className="p-3 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString("ru-RU")}</td>
                        <td className="p-3"><Link href={`/profile/${u.id}`} className="text-accent hover:underline text-xs">Профиль</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notify" className="mt-5">
            <NotificationForm users={users ?? []} />
          </TabsContent>

          <TabsContent value="course" className="mt-5">
            <NewCourseForm />
          </TabsContent>

          <TabsContent value="quest" className="mt-5">
            <NewQuestForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <Card className="rounded-2xl border-border/60">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">{icon}</div>
        <div>
          <div className="text-2xl font-bold leading-none">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

type UserRow = { id: number; name: string; role: string; email: string };

function NotificationForm({ users }: { users: UserRow[] }) {
  const create = useAdminCreateNotification();
  const { toast } = useToast();

  const [f, setF] = useState({
    type: "info",
    title: "",
    body: "",
    link: "",
  });
  const [broadcast, setBroadcast] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const toggleUser = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const students = users.filter(u => u.role !== "admin");
  const selectedCategory = NOTIF_CATEGORIES.find(c => c.value === f.type);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const userIds = broadcast ? null : Array.from(selectedIds);
    if (!broadcast && selectedIds.size === 0) {
      toast({ title: "Выберите получателей", variant: "destructive" });
      return;
    }
    create.mutate({
      data: {
        type: f.type,
        title: f.title,
        body: f.body,
        link: f.link || undefined,
        userIds,
      },
    }, {
      onSuccess: (result) => {
        toast({ title: `Отправлено ${result.count} получателям!` });
        setF({ type: "info", title: "", body: "", link: "" });
        setSelectedIds(new Set());
        setBroadcast(true);
      },
      onError: () => toast({ title: "Ошибка отправки", variant: "destructive" }),
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <Card className="rounded-2xl border-border/60">
        <CardContent className="p-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-accent" /> Создать уведомление
          </h2>
          <form onSubmit={submit} className="space-y-4">
            {/* Category picker */}
            <div className="space-y-2">
              <Label>Категория</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {NOTIF_CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setF(s => ({ ...s, type: cat.value }))}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                      f.type === cat.value
                        ? `${cat.color} border-current`
                        : "border-border/50 hover:border-border bg-card"
                    }`}
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Заголовок</Label>
              <Input
                required
                value={f.title}
                onChange={e => setF(s => ({ ...s, title: e.target.value }))}
                placeholder="Краткое и понятное название..."
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Текст уведомления</Label>
              <Textarea
                required
                rows={4}
                value={f.body}
                onChange={e => setF(s => ({ ...s, body: e.target.value }))}
                placeholder="Подробное описание или инструкция..."
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Ссылка (опционально)</Label>
              <Input
                value={f.link}
                onChange={e => setF(s => ({ ...s, link: e.target.value }))}
                placeholder="/cabinet/tasks или /cabinet/courses"
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">Пользователь перейдёт по ссылке при клике на уведомление</p>
            </div>

            {/* Preview */}
            {f.title && (
              <div className={`rounded-xl border p-3 ${selectedCategory?.color ?? ""}`}>
                <div className="flex items-start gap-2">
                  {selectedCategory?.icon}
                  <div>
                    <p className="font-medium text-sm">{f.title}</p>
                    {f.body && <p className="text-xs text-muted-foreground mt-0.5">{f.body.slice(0, 100)}{f.body.length > 100 ? "..." : ""}</p>}
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-xl gap-2"
              disabled={create.isPending}
            >
              <Send className="h-4 w-4" />
              {create.isPending ? "Отправка..." : broadcast ? `Отправить всем студентам (${students.length})` : `Отправить выбранным (${selectedIds.size})`}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recipients picker */}
      <Card className="rounded-2xl border-border/60">
        <CardContent className="p-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" /> Получатели
          </h2>

          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
            <Checkbox
              id="broadcast"
              checked={broadcast}
              onCheckedChange={(v) => { setBroadcast(!!v); setSelectedIds(new Set()); }}
            />
            <Label htmlFor="broadcast" className="cursor-pointer font-medium">
              Всем студентам ({students.length})
            </Label>
          </div>

          {!broadcast && (
            <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
              {students.map(u => (
                <label
                  key={u.id}
                  className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                    selectedIds.has(u.id) ? "bg-primary/8 border border-primary/20" : "hover:bg-muted/50"
                  }`}
                >
                  <Checkbox
                    checked={selectedIds.has(u.id)}
                    onCheckedChange={() => toggleUser(u.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{u.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {broadcast && (
            <div className="text-sm text-muted-foreground text-center py-8">
              Уведомление получат все студенты платформы
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function NewCourseForm() {
  const create = useAdminCreateCourse();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [f, setF] = useState({
    title: "", description: "", role: "guide", stage: "Бухта открытий",
    category: "tourism", xpReward: 100, imageUrl: "",
  });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    create.mutate({ data: { ...f, xpReward: Number(f.xpReward) } }, {
      onSuccess: () => {
        toast({ title: "Курс создан" });
        qc.invalidateQueries({ queryKey: getAdminGetStatsQueryKey() });
        setF({ title: "", description: "", role: "guide", stage: "Бухта открытий", category: "tourism", xpReward: 100, imageUrl: "" });
      },
      onError: () => toast({ title: "Ошибка", variant: "destructive" }),
    });
  };
  return (
    <Card className="rounded-2xl border-border/60">
      <CardContent className="p-6">
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2"><Label>Название</Label><Input value={f.title} required onChange={(e) => setF((s) => ({ ...s, title: e.target.value }))} className="rounded-xl" data-testid="input-course-title" /></div>
          <div className="space-y-2 md:col-span-2"><Label>Описание</Label><Textarea rows={3} required value={f.description} onChange={(e) => setF((s) => ({ ...s, description: e.target.value }))} className="rounded-xl" /></div>
          <div className="space-y-2"><Label>Специализация</Label>
            <Select value={f.role} onValueChange={(v) => setF((s) => ({ ...s, role: v }))}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="guide">Экскурсовод</SelectItem>
                <SelectItem value="marketer">Маркетолог</SelectItem>
                <SelectItem value="designer">Дизайнер</SelectItem>
                <SelectItem value="operator">Туроператор</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Этап</Label><Input value={f.stage} onChange={(e) => setF((s) => ({ ...s, stage: e.target.value }))} className="rounded-xl" /></div>
          <div className="space-y-2"><Label>Категория</Label><Input value={f.category} onChange={(e) => setF((s) => ({ ...s, category: e.target.value }))} className="rounded-xl" /></div>
          <div className="space-y-2"><Label>XP награда</Label><Input type="number" value={f.xpReward} onChange={(e) => setF((s) => ({ ...s, xpReward: Number(e.target.value) }))} className="rounded-xl" /></div>
          <div className="space-y-2 md:col-span-2"><Label>Картинка (URL, опционально)</Label><Input value={f.imageUrl} onChange={(e) => setF((s) => ({ ...s, imageUrl: e.target.value }))} className="rounded-xl" placeholder="https://..." /></div>
          <Button type="submit" className="md:col-span-2 rounded-full" disabled={create.isPending} data-testid="button-create-course">
            <Plus className="h-4 w-4 mr-1" /> {create.isPending ? "Создание..." : "Создать курс"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function NewQuestForm() {
  const create = useAdminCreateQuest();
  const { toast } = useToast();
  const [f, setF] = useState({
    title: "", description: "", type: "exploration", difficulty: "medium",
    location: "", xpReward: 150,
  });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    create.mutate({ data: { ...f, xpReward: Number(f.xpReward) } }, {
      onSuccess: () => {
        toast({ title: "Квест создан" });
        setF({ title: "", description: "", type: "exploration", difficulty: "medium", location: "", xpReward: 150 });
      },
      onError: () => toast({ title: "Ошибка", variant: "destructive" }),
    });
  };
  return (
    <Card className="rounded-2xl border-border/60">
      <CardContent className="p-6">
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2"><Label>Название</Label><Input required value={f.title} onChange={(e) => setF((s) => ({ ...s, title: e.target.value }))} className="rounded-xl" data-testid="input-quest-title" /></div>
          <div className="space-y-2 md:col-span-2"><Label>Описание</Label><Textarea rows={3} required value={f.description} onChange={(e) => setF((s) => ({ ...s, description: e.target.value }))} className="rounded-xl" /></div>
          <div className="space-y-2"><Label>Тип</Label>
            <Select value={f.type} onValueChange={(v) => setF((s) => ({ ...s, type: v }))}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="exploration">Исследование</SelectItem>
                <SelectItem value="creative">Творческое</SelectItem>
                <SelectItem value="research">Аналитика</SelectItem>
                <SelectItem value="practice">Практика</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Сложность</Label>
            <Select value={f.difficulty} onValueChange={(v) => setF((s) => ({ ...s, difficulty: v }))}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Лёгкий</SelectItem>
                <SelectItem value="medium">Средний</SelectItem>
                <SelectItem value="hard">Сложный</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2"><Label>Место (Владивосток)</Label><Input required value={f.location} onChange={(e) => setF((s) => ({ ...s, location: e.target.value }))} className="rounded-xl" placeholder="Например: Золотой мост" /></div>
          <div className="space-y-2"><Label>XP награда</Label><Input type="number" value={f.xpReward} onChange={(e) => setF((s) => ({ ...s, xpReward: Number(e.target.value) }))} className="rounded-xl" /></div>
          <Button type="submit" className="md:col-span-2 rounded-full" disabled={create.isPending} data-testid="button-create-quest">
            <Plus className="h-4 w-4 mr-1" /> {create.isPending ? "Создание..." : "Создать квест"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
