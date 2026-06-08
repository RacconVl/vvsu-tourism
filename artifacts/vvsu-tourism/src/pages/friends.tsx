import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  useListFriends,
  useListFriendRequests,
  useAcceptFriend,
  useRemoveFriend,
  getListFriendsQueryKey,
  getListFriendRequestsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, Users, UserCheck, UserPlus, MessageSquare,
  ExternalLink, Check, X, Trophy,
} from "lucide-react";

const roleLabels: Record<string, string> = {
  guide: "Экскурсовод", marketer: "Маркетолог",
  designer: "Дизайнер", operator: "Туроператор", admin: "Администратор",
};

function initials(name: string) {
  return name.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase();
}

function OnlineDot({ online }: { online: boolean }) {
  return (
    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${online ? "bg-green-500" : "bg-muted-foreground/40"}`} />
  );
}

export default function Friends() {
  const [tab, setTab] = useState<"friends" | "requests">("friends");
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: friends, isLoading: friendsLoading } = useListFriends({
    query: { refetchInterval: 30_000 } as never,
  });

  const { data: requests, isLoading: reqLoading } = useListFriendRequests({
    query: { refetchInterval: 15_000 } as never,
  });

  const accept = useAcceptFriend();
  const remove = useRemoveFriend();

  const handleAccept = (userId: number) => {
    accept.mutate({ userId }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListFriendsQueryKey() });
        qc.invalidateQueries({ queryKey: getListFriendRequestsQueryKey() });
        toast({ title: "Запрос принят!", description: "Теперь вы друзья." });
      },
    });
  };

  const handleDecline = (userId: number) => {
    remove.mutate({ userId }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListFriendRequestsQueryKey() });
        toast({ title: "Запрос отклонён." });
      },
    });
  };

  const handleRemove = (userId: number, name: string) => {
    remove.mutate({ userId }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListFriendsQueryKey() });
        toast({ title: `${name} удалён из друзей.` });
      },
    });
  };

  const pendingCount = requests?.length ?? 0;
  const onlineFriends = (friends ?? []).filter(f => f.isOnline).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/cabinet" className="flex items-center gap-2 text-sm font-semibold text-foreground shrink-0">
          <ArrowLeft className="h-5 w-5" /> Обзор
        </Link>
        <span className="text-muted-foreground text-sm">Друзья</span>
      </div>

      <div className="max-w-2xl mx-auto py-8 px-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <Users className="h-6 w-6 text-accent" />
            <h1 className="text-2xl font-bold text-foreground">Друзья</h1>
            {onlineFriends > 0 && (
              <Badge className="bg-green-500/15 text-green-600 border-green-500/30 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 inline-block" />
                {onlineFriends} онлайн
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">Находите одногруппников на страницах их профилей</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={tab === "friends" ? "default" : "outline"}
            onClick={() => setTab("friends")}
            className="rounded-full gap-2"
          >
            <UserCheck className="h-4 w-4" />
            Друзья {friends ? `(${friends.length})` : ""}
          </Button>
          <Button
            variant={tab === "requests" ? "default" : "outline"}
            onClick={() => setTab("requests")}
            className="rounded-full gap-2 relative"
          >
            <UserPlus className="h-4 w-4" />
            Запросы
            {pendingCount > 0 && (
              <span className="ml-1 h-5 min-w-5 px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {tab === "friends" && (
            <motion.div key="friends" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {friendsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
                </div>
              ) : !friends || friends.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Список друзей пуст</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Посетите профиль одногруппника и нажмите «Добавить в друзья»
                  </p>
                  <Link href="/leaderboard">
                    <Button variant="outline" className="rounded-full">
                      <Trophy className="h-4 w-4 mr-2" /> Посмотреть рейтинг
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {friends.map((friend, i) => (
                    <motion.div
                      key={friend.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="rounded-2xl border-border/60 hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="relative shrink-0">
                            <Avatar className="h-12 w-12 ring-2 ring-accent/20">
                              <AvatarImage src={friend.avatarUrl ?? undefined} />
                              <AvatarFallback className="bg-primary/20 text-primary font-bold">
                                {initials(friend.name)}
                              </AvatarFallback>
                            </Avatar>
                            <OnlineDot online={friend.isOnline} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm text-foreground">{friend.name}</span>
                              {friend.isOnline && (
                                <span className="text-[10px] font-medium text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-full">
                                  онлайн
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {roleLabels[friend.studentRole] ?? friend.studentRole} · Ур. {friend.level}
                            </p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Link href={`/cabinet/messages/${friend.id}`}>
                              <Button size="sm" variant="outline" className="rounded-xl h-8 w-8 p-0">
                                <MessageSquare className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                            <Link href={`/profile/${friend.id}`}>
                              <Button size="sm" variant="outline" className="rounded-xl h-8 w-8 p-0">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="rounded-xl h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() => handleRemove(friend.id, friend.name)}
                              disabled={remove.isPending}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === "requests" && (
            <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {reqLoading ? (
                <div className="space-y-3">
                  {[1, 2].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
                </div>
              ) : !requests || requests.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Нет входящих запросов</h3>
                  <p className="text-sm text-muted-foreground">Здесь появятся запросы в друзья</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {requests.map((req, i) => (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="rounded-2xl border-primary/20 bg-primary/3">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="relative shrink-0">
                            <Avatar className="h-12 w-12 ring-2 ring-primary/30">
                              <AvatarImage src={req.requester.avatarUrl ?? undefined} />
                              <AvatarFallback className="bg-primary/20 text-primary font-bold">
                                {initials(req.requester.name)}
                              </AvatarFallback>
                            </Avatar>
                            <OnlineDot online={req.requester.isOnline} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-foreground">{req.requester.name}</span>
                              {req.requester.isOnline && (
                                <span className="text-[10px] font-medium text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-full">
                                  онлайн
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {roleLabels[req.requester.studentRole] ?? req.requester.studentRole} · Ур. {req.requester.level}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(req.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
                            </p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Button
                              size="sm"
                              className="rounded-xl h-8 gap-1.5 bg-green-600 hover:bg-green-700"
                              onClick={() => handleAccept(req.requester.id)}
                              disabled={accept.isPending}
                            >
                              <Check className="h-3.5 w-3.5" /> Принять
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-xl h-8 gap-1.5"
                              onClick={() => handleDecline(req.requester.id)}
                              disabled={remove.isPending}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
