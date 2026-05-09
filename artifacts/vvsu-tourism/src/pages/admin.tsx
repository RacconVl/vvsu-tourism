import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  useAdminListUsers,
  useAdminGetStats,
  useAdminCreateCourse,
  useAdminCreateQuest,
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
import { useToast } from "@/hooks/use-toast";
import { Users, BarChart3, BookOpen, Compass, Plus, Shield, Trophy, Brain, Activity } from "lucide-react";

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
          <TabsList className="grid grid-cols-3 max-w-md rounded-2xl">
            <TabsTrigger value="users">Пользователи</TabsTrigger>
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
