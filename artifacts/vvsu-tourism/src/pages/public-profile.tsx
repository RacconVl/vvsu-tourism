import type React from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import {
  useGetPublicProfile,
  useGetFriendStatus,
  useAddFriend,
  useRemoveFriend,
  useAcceptFriend,
  getGetFriendStatusQueryKey,
  getListFriendsQueryKey,
  getListFriendRequestsQueryKey,
} from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Award, Brain, Compass, BookOpen, Trophy, Sparkles, Anchor, MessageCircle,
  Star, Map as MapIcon, UserPlus, UserCheck, UserX, Clock,
} from "lucide-react";

const roleLabels: Record<string, string> = {
  guide: "Экскурсовод", marketer: "Маркетолог",
  designer: "Дизайнер", operator: "Туроператор", admin: "Администратор",
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

function FriendButton({ userId, status, onUpdate }: { userId: number; status: string; onUpdate: () => void }) {
  const add = useAddFriend();
  const remove = useRemoveFriend();
  const accept = useAcceptFriend();

  const busy = add.isPending || remove.isPending || accept.isPending;

  if (status === "friends") {
    return (
      <Button
        variant="outline"
        className="rounded-xl gap-2 bg-green-500/10 border-green-500/30 text-green-700 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-600 group"
        onClick={() => remove.mutate({ userId }, { onSuccess: onUpdate })}
        disabled={busy}
      >
        <UserCheck className="h-4 w-4 group-hover:hidden" />
        <UserX className="h-4 w-4 hidden group-hover:block" />
        <span className="group-hover:hidden">В друзьях</span>
        <span className="hidden group-hover:inline">Удалить</span>
      </Button>
    );
  }
  if (status === "pending_sent") {
    return (
      <Button
        variant="outline"
        className="rounded-xl gap-2 text-muted-foreground"
        onClick={() => remove.mutate({ userId }, { onSuccess: onUpdate })}
        disabled={busy}
      >
        <Clock className="h-4 w-4" /> Запрос отправлен
      </Button>
    );
  }
  if (status === "pending_received") {
    return (
      <Button
        className="rounded-xl gap-2 bg-green-600 hover:bg-green-700"
        onClick={() => accept.mutate({ userId }, { onSuccess: onUpdate })}
        disabled={busy}
      >
        <UserCheck className="h-4 w-4" /> Принять запрос
      </Button>
    );
  }
  return (
    <Button
      variant="outline"
      className="rounded-xl gap-2"
      onClick={() => add.mutate({ userId }, { onSuccess: onUpdate })}
      disabled={busy}
    >
      <UserPlus className="h-4 w-4" /> Добавить в друзья
    </Button>
  );
}

export default function PublicProfile() {
  const [, params] = useRoute("/profile/:id");
  const id = Number(params?.id);
  const { user } = useAuth();
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: profile, isLoading, error } = useGetPublicProfile(id, {
    query: { enabled: Number.isFinite(id) } as never,
  });

  const { data: friendStatus, refetch: refetchStatus } = useGetFriendStatus(id, {
    query: { enabled: !!user && Number.isFinite(id) && id !== user?.id } as never,
  });

  const onFriendUpdate = () => {
    refetchStatus();
    qc.invalidateQueries({ queryKey: getGetFriendStatusQueryKey(id) });
    qc.invalidateQueries({ queryKey: getListFriendsQueryKey() });
    qc.invalidateQueries({ queryKey: getListFriendRequestsQueryKey() });
    const status = friendStatus?.status;
    if (status === "none") toast({ title: "Запрос в друзья отправлен!" });
    if (status === "pending_received") toast({ title: "Запрос принят!" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-48 w-full rounded-2xl" />
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
  const online = friendStatus?.isOnline;
  const status = friendStatus?.status ?? "none";

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-2xl border-border/60 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground">
              <div className="flex items-start gap-5 flex-wrap">
                {/* Avatar with online indicator */}
                <div className="relative shrink-0">
                  <Avatar className="h-20 w-20 ring-4 ring-white/20">
                    <AvatarImage src={u.avatarUrl || undefined} />
                    <AvatarFallback className="bg-accent text-white text-xl font-bold">
                      {u.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {!isOwnProfile && user && (
                    <span
                      title={online ? "Онлайн" : "Оффлайн"}
                      className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-primary ${online ? "bg-green-400" : "bg-white/30"}`}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h1 className="text-2xl font-bold">{u.name}</h1>
                    {u.role === "admin" && <Badge className="bg-accent text-white border-0">Администратор</Badge>}
                    {!isOwnProfile && user && online !== undefined && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${online ? "bg-green-400/20 text-green-300" : "bg-white/10 text-white/60"}`}>
                        {online ? "● онлайн" : "○ не в сети"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm flex-wrap">
                    <Badge variant="secondary" className="rounded-full">{roleLabels[u.studentRole] ?? u.studentRole}</Badge>
                    <span className="flex items-center gap-1.5"><Trophy className="h-4 w-4 text-accent" /> Уровень {u.level}</span>
                    <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-accent" /> {u.xp} XP</span>
                  </div>
                  {u.bio && <p className="text-primary-foreground/90 mt-2 max-w-xl text-sm">{u.bio}</p>}
                </div>

                {/* Action buttons */}
                {!isOwnProfile && (
                  <div className="flex flex-col gap-2 shrink-0 mt-1">
                    {user ? (
                      <>
                        <FriendButton userId={u.id} status={status} onUpdate={onFriendUpdate} />
                        <Link href={`/cabinet/messages/${u.id}`}>
                          <Button variant="secondary" className="rounded-xl gap-2 w-full">
                            <MessageCircle className="h-4 w-4" /> Написать
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <Link href="/login">
                        <Button variant="secondary" className="rounded-xl gap-2">
                          <MessageCircle className="h-4 w-4" /> Написать сообщение
                        </Button>
                      </Link>
                    )}
                  </div>
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
              <CardContent className="p-8 text-center text-muted-foreground">
                У пользователя пока нет открытых достижений
              </CardContent>
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
