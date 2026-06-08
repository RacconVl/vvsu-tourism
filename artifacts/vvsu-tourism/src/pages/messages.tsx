import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  useListConversations,
  useListUsers,
  getListConversationsQueryKey,
} from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, MessageSquare, PlusCircle, Search, ChevronRight } from "lucide-react";

const roleLabels: Record<string, string> = {
  guide: "Экскурсовод",
  marketer: "Маркетолог",
  designer: "Дизайнер",
  operator: "Туроператор",
  admin: "Администратор",
};

function initials(name: string) {
  return name.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase();
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "только что";
  if (mins < 60) return `${mins} мин`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ч`;
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

export default function Messages() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [search, setSearch] = useState("");

  const { data: conversations, isLoading } = useListConversations({
    query: { refetchInterval: 5000, enabled: !!user } as never,
  });

  const { data: users, isLoading: usersLoading } = useListUsers({
    query: { enabled: showNewDialog } as never,
  });

  const filtered = (users ?? []).filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    (roleLabels[u.studentRole] ?? u.studentRole).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/cabinet" className="flex items-center gap-2 text-sm font-semibold text-foreground shrink-0">
            <ArrowLeft className="h-5 w-5" /> Обзор
          </Link>
          <span className="text-muted-foreground text-sm">Сообщения</span>
        </div>
        <Button size="sm" onClick={() => setShowNewDialog(true)} className="rounded-full gap-2">
          <PlusCircle className="h-4 w-4" /> Новый диалог
        </Button>
      </div>

      <div className="max-w-2xl mx-auto py-8 px-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <MessageSquare className="h-6 w-6 text-accent" />
            <h1 className="text-2xl font-bold text-foreground">Сообщения</h1>
          </div>
          <p className="text-muted-foreground text-sm">Переписка с другими студентами</p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
          </div>
        ) : !conversations || conversations.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Нет сообщений</h3>
            <p className="text-muted-foreground text-sm mb-6">Начните переписку с одногруппниками</p>
            <Button onClick={() => setShowNewDialog(true)} className="rounded-full">
              <PlusCircle className="h-4 w-4 mr-2" /> Написать первым
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv, i) => (
              <motion.div
                key={conv.partner.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/cabinet/messages/${conv.partner.id}`}>
                  <Card className={`rounded-2xl border-border/60 hover:shadow-md transition-all cursor-pointer ${conv.unreadCount > 0 ? "border-primary/30 bg-primary/3" : ""}`}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="relative shrink-0">
                        <Avatar className="h-12 w-12 ring-2 ring-accent/20">
                          <AvatarImage src={conv.partner.avatarUrl ?? undefined} />
                          <AvatarFallback className="bg-primary/20 text-primary font-bold">
                            {initials(conv.partner.name)}
                          </AvatarFallback>
                        </Avatar>
                        {conv.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                            {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-semibold text-sm truncate ${conv.unreadCount > 0 ? "text-foreground" : "text-foreground/80"}`}>
                            {conv.partner.name}
                          </span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {relativeTime(conv.lastMessage.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {roleLabels[conv.partner.studentRole] ?? conv.partner.studentRole}
                          {" · Ур. "}{conv.partner.level}
                        </p>
                        <p className={`text-sm mt-1 truncate ${conv.unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                          {conv.lastMessage.senderId === user?.id ? "Вы: " : ""}
                          {conv.lastMessage.content}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* New conversation dialog */}
      <Dialog open={showNewDialog} onOpenChange={open => { setShowNewDialog(open); setSearch(""); }}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>Новый диалог</DialogTitle>
          </DialogHeader>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по имени или специализации..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 rounded-xl"
              autoFocus
            />
          </div>
          <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
            {usersLoading ? (
              [1, 2, 3].map(i => <Skeleton key={i} className="h-14 rounded-xl" />)
            ) : filtered.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-8">Пользователи не найдены</p>
            ) : filtered.map(u => (
              <button
                key={u.id}
                onClick={() => { setShowNewDialog(false); navigate(`/cabinet/messages/${u.id}`); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-colors text-left"
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={u.avatarUrl ?? undefined} />
                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                    {initials(u.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{u.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {roleLabels[u.studentRole] ?? u.studentRole} · Ур. {u.level}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs shrink-0">Написать</Badge>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
