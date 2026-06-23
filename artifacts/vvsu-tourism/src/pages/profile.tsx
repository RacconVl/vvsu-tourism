import { useState, useRef, type ReactNode } from "react";
import type React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  useGetMyProfile,
  useUpdateMyProfile,
  getGetMyProfileQueryKey,
  getGetMeQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Award, BookOpen, Compass, Brain, Trophy, Settings, Activity, Sparkles, Anchor, MessageCircle, Star, Map as MapIcon, Lock, Camera, Loader2 } from "lucide-react";

const roleLabels: Record<string, string> = {
  guide: "Экскурсовод",
  marketer: "Маркетолог",
  designer: "Дизайнер",
  operator: "Туроператор",
  admin: "Администратор",
};

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

const activityIcon = (type: string) => {
  if (type === "quiz") return <Brain className="h-4 w-4 text-secondary" />;
  if (type === "quest") return <Compass className="h-4 w-4 text-accent" />;
  if (type === "achievement") return <Award className="h-4 w-4 text-yellow-500" />;
  if (type === "community") return <MessageCircle className="h-4 w-4 text-blue-500" />;
  return <Sparkles className="h-4 w-4 text-muted-foreground" />;
};

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useGetMyProfile();
  const update = useUpdateMyProfile();
  const qc = useQueryClient();
  const { toast } = useToast();

  const [edit, setEdit] = useState({
    name: user?.name ?? "",
    bio: user?.bio ?? "",
    avatarUrl: user?.avatarUrl ?? "",
    studentRole: user?.studentRole ?? "guide",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string ?? "");
    reader.readAsDataURL(file);
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-background py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const u = profile.user;
  const totalLevelXp = profile.currentLevelXp + profile.nextLevelXp;
  const xpPercent = Math.round((profile.currentLevelXp / Math.max(totalLevelXp, 1)) * 100);

  const saveProfile = async () => {
    let avatarUrl = edit.avatarUrl;
    if (avatarFile) {
      setAvatarUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", avatarFile);
        const res = await fetch("/api/uploads", { method: "POST", body: fd });
        if (!res.ok) throw new Error("upload failed");
        const json = await res.json() as { url: string };
        avatarUrl = json.url;
      } catch {
        toast({ title: "Ошибка загрузки аватара", variant: "destructive" });
        setAvatarUploading(false);
        return;
      }
      setAvatarUploading(false);
    }
    update.mutate(
      { data: { ...edit, avatarUrl } },
      {
        onSuccess: async () => {
          await Promise.all([
            qc.invalidateQueries({ queryKey: getGetMyProfileQueryKey() }),
            qc.invalidateQueries({ queryKey: getGetMeQueryKey() }),
          ]);
          setAvatarFile(null);
          setAvatarPreview("");
          toast({ title: "Профиль обновлён", description: "Изменения сохранены." });
        },
        onError: () => toast({ title: "Не удалось сохранить", variant: "destructive" }),
      },
    );
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-2xl border-border/60 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
                <Avatar className="h-24 w-24 ring-4 ring-white/20">
                  <AvatarImage src={u.avatarUrl || undefined} />
                  <AvatarFallback className="bg-accent text-white text-xl font-bold">
                    {u.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-3xl font-bold" data-testid="text-profile-name">{u.name}</h1>
                    {u.role === "admin" && (
                      <Badge className="bg-accent text-white border-0">Администратор</Badge>
                    )}
                  </div>
                  <p className="text-primary-foreground/80 mt-1">{u.email}</p>
                  <div className="flex items-center gap-3 mt-3 text-sm">
                    <Badge variant="secondary" className="rounded-full">{roleLabels[u.studentRole] ?? u.studentRole}</Badge>
                    <span className="flex items-center gap-1.5"><Trophy className="h-4 w-4 text-accent" /> Уровень {u.level}</span>
                    <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-accent" /> {u.xp} XP</span>
                  </div>
                  {u.bio && <p className="text-primary-foreground/90 mt-3 max-w-2xl">{u.bio}</p>}
                </div>
              </div>
              <div className="mt-5">
                <div className="flex justify-between text-xs text-primary-foreground/80 mb-1">
                  <span>До следующего уровня</span>
                  <span>{profile.currentLevelXp} / {totalLevelXp} XP</span>
                </div>
                <Progress value={xpPercent} className="h-2 bg-white/20" />
              </div>
            </div>
            <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat icon={<Award className="h-5 w-5 text-yellow-500" />} value={profile.unlockedAchievements.length} label="Достижений" />
              <Stat icon={<Brain className="h-5 w-5 text-secondary" />} value={profile.completedQuizzes} label="Тестов пройдено" />
              <Stat icon={<Compass className="h-5 w-5 text-accent" />} value={profile.completedQuests} label="Квестов выполнено" />
              <Stat icon={<BookOpen className="h-5 w-5 text-primary" />} value={profile.completedModules} label="Модулей закрыто" />
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="achievements" className="w-full">
          <TabsList className="grid grid-cols-4 max-w-2xl rounded-2xl">
            <TabsTrigger value="achievements" data-testid="tab-achievements">
              <Award className="h-4 w-4 mr-1.5" /> Достижения
            </TabsTrigger>
            <TabsTrigger value="activity" data-testid="tab-activity">
              <Activity className="h-4 w-4 mr-1.5" /> Активность
            </TabsTrigger>
            <TabsTrigger value="results" data-testid="tab-results">
              <Brain className="h-4 w-4 mr-1.5" /> Результаты
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">
              <Settings className="h-4 w-4 mr-1.5" /> Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="mt-5">
            {profile.unlockedAchievements.length === 0 ? (
              <Card className="rounded-2xl border-dashed">
                <CardContent className="p-10 text-center text-muted-foreground">
                  <Lock className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  Пока нет открытых достижений. Проходите тесты и квесты, чтобы получить первые!
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.unlockedAchievements.map((a, i) => (
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
                            <span className="text-muted-foreground">
                              {new Date(a.unlockedAt).toLocaleDateString("ru-RU")}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-5">
            <Card className="rounded-2xl border-border/60">
              <CardContent className="p-5">
                {profile.recentActivity.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">История активности пуста.</p>
                ) : (
                  <ul className="space-y-3">
                    {profile.recentActivity.map((a) => (
                      <li key={a.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/40">
                        <div className="h-9 w-9 rounded-full bg-background flex items-center justify-center shrink-0">
                          {activityIcon(a.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">{a.description}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(a.createdAt).toLocaleString("ru-RU")}
                          </p>
                        </div>
                        {a.xpEarned > 0 && (
                          <Badge variant="outline" className="text-accent border-accent/30 shrink-0">+{a.xpEarned} XP</Badge>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="mt-5 space-y-5">
            <Card className="rounded-2xl border-border/60">
              <CardContent className="p-5">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Brain className="h-5 w-5 text-secondary" /> История тестов</h3>
                {profile.quizHistory.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Вы ещё не проходили тесты. <Link href="/quizzes" className="text-accent hover:underline">Начать сейчас</Link></p>
                ) : (
                  <ul className="space-y-2">
                    {profile.quizHistory.map((h) => (
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
                )}
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-border/60">
              <CardContent className="p-5">
                <h3 className="font-bold mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Прогресс по курсам</h3>
                {profile.completedCourses.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Вы ещё не открывали модули курсов.</p>
                ) : (
                  <ul className="space-y-3">
                    {profile.completedCourses.map((c) => (
                      <li key={c.courseId}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-semibold">{c.title}</span>
                          <span className="text-muted-foreground">{c.completedModules} / {c.totalModules}</span>
                        </div>
                        <Progress value={c.totalModules > 0 ? (c.completedModules / c.totalModules) * 100 : 0} className="h-2" />
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="rounded-2xl border-border/60 lg:col-span-2">
                <CardContent className="p-6 space-y-5">
                  <h3 className="font-bold text-base flex items-center gap-2"><Settings className="h-4 w-4 text-muted-foreground" /> Настройки профиля</h3>

                  {/* Avatar upload */}
                  <div className="space-y-2">
                    <Label>Фото профиля</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        <Avatar className="h-20 w-20 ring-2 ring-border">
                          <AvatarImage src={avatarPreview || edit.avatarUrl || undefined} />
                          <AvatarFallback className="bg-accent text-white text-xl font-bold">
                            {(edit.name || u.name).split(" ").map((s) => s[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <button
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow hover:opacity-90 transition-opacity"
                        >
                          <Camera className="h-3.5 w-3.5" />
                        </button>
                        <input
                          ref={avatarInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          data-testid="input-edit-avatar"
                          onChange={handleAvatarFileChange}
                        />
                      </div>
                      <div className="flex-1">
                        <button
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Загрузить новое фото
                        </button>
                        <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG, WebP — до 10 МБ</p>
                        {avatarFile && (
                          <p className="text-xs text-accent mt-1 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent inline-block" />
                            {avatarFile.name} — готово к сохранению
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Имя</Label>
                    <Input value={edit.name} onChange={(e) => setEdit((s) => ({ ...s, name: e.target.value }))} className="rounded-xl" data-testid="input-edit-name" />
                  </div>
                  <div className="space-y-2">
                    <Label>О себе</Label>
                    <Textarea rows={3} value={edit.bio} onChange={(e) => setEdit((s) => ({ ...s, bio: e.target.value }))} className="rounded-xl resize-none" data-testid="input-edit-bio" placeholder="Расскажите немного о себе..." />
                  </div>
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
                  <Button onClick={saveProfile} disabled={update.isPending || avatarUploading} className="rounded-full gap-2" data-testid="button-save-profile">
                    {avatarUploading
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> Загрузка фото...</>
                      : update.isPending
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> Сохранение...</>
                      : "Сохранить изменения"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/60 h-fit">
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-semibold text-sm">Предварительный вид</h3>
                  <div className="flex flex-col items-center text-center gap-3 py-4">
                    <Avatar className="h-20 w-20 ring-2 ring-border">
                      <AvatarImage src={avatarPreview || edit.avatarUrl || undefined} />
                      <AvatarFallback className="bg-accent text-white text-xl font-bold">
                        {(edit.name || u.name).split(" ").map((s) => s[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold">{edit.name || u.name}</p>
                      <p className="text-sm text-muted-foreground">{u.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">{roleLabels[edit.studentRole] ?? edit.studentRole}</p>
                    </div>
                    {edit.bio && <p className="text-xs text-muted-foreground px-2 line-clamp-3">{edit.bio}</p>}
                  </div>
                  <div className="text-xs text-center text-muted-foreground border-t pt-3">
                    Так вас видят другие студенты
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
      <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center">{icon}</div>
      <div>
        <div className="text-2xl font-bold leading-none">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  );
}
