import type React from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { useGetPublicProfile } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Brain, Compass, BookOpen, Trophy, Sparkles, Anchor, MessageCircle, Star, Map as MapIcon } from "lucide-react";

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

export default function PublicProfile() {
  const [, params] = useRoute("/profile/:id");
  const id = Number(params?.id);
  const { user } = useAuth();
  const { data: profile, isLoading, error } = useGetPublicProfile(id, {
    query: { enabled: Number.isFinite(id) } as never,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background py-16 px-4 text-center">
        <p className="text-muted-foreground">Пользователь не найден</p>
      </div>
    );
  }

  const u = profile.user;
  const isOwnProfile = user?.id === u.id;

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-2xl border-border/60 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground">
              <div className="flex items-start gap-5 flex-wrap">
                <Avatar className="h-20 w-20 ring-4 ring-white/20 shrink-0">
                  <AvatarImage src={u.avatarUrl || undefined} />
                  <AvatarFallback className="bg-accent text-white text-xl font-bold">
                    {u.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold flex items-center gap-2 flex-wrap">
                    {u.name}
                    {u.role === "admin" && <Badge className="bg-accent text-white border-0">Администратор</Badge>}
                  </h1>
                  <div className="flex items-center gap-3 mt-2 text-sm flex-wrap">
                    <Badge variant="secondary" className="rounded-full">{roleLabels[u.studentRole] ?? u.studentRole}</Badge>
                    <span className="flex items-center gap-1.5"><Trophy className="h-4 w-4 text-accent" /> Уровень {u.level}</span>
                    <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-accent" /> {u.xp} XP</span>
                  </div>
                  {u.bio && <p className="text-primary-foreground/90 mt-2 max-w-xl text-sm">{u.bio}</p>}
                </div>
                {/* Action button */}
                {!isOwnProfile && (
                  user ? (
                    <Link href={`/cabinet/messages/${u.id}`}>
                      <Button variant="secondary" className="rounded-xl gap-2 mt-1 shrink-0">
                        <MessageCircle className="h-4 w-4" />
                        Написать сообщение
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <Button variant="secondary" className="rounded-xl gap-2 mt-1 shrink-0">
                        <MessageCircle className="h-4 w-4" />
                        Написать сообщение
                      </Button>
                    </Link>
                  )
                )}
              </div>
            </div>
            <CardContent className="p-6 grid grid-cols-3 gap-4">
              <Stat icon={<Brain className="h-5 w-5 text-secondary" />} value={profile.completedQuizzes} label="Тестов пройдено" />
              <Stat icon={<Compass className="h-5 w-5 text-accent" />} value={profile.completedQuests} label="Квестов выполнено" />
              <Stat icon={<BookOpen className="h-5 w-5 text-primary" />} value={profile.completedModules} label="Модулей закрыто" />
            </CardContent>
          </Card>
        </motion.div>

        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" /> Открытые достижения ({profile.unlockedAchievements.length})
          </h2>
          {profile.unlockedAchievements.length === 0 ? (
            <Card className="rounded-2xl border-dashed">
              <CardContent className="p-8 text-center text-muted-foreground">У пользователя пока нет открытых достижений</CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.unlockedAchievements.map((a) => (
                <Card key={a.id} className="rounded-2xl border-border/60">
                  <CardContent className="p-5 flex gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                      {iconMap[a.iconType] ?? <Award className="h-6 w-6" />}
                    </div>
                    <div>
                      <h3 className="font-bold">{a.name}</h3>
                      <p className="text-sm text-muted-foreground">{a.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
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
