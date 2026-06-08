import { useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellRing, Check, UserPlus, MessageSquare, Trophy, Info, AlertTriangle, Zap, Megaphone, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useListNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  getListNotificationsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

const TYPE_META: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  urgent:         { icon: <Zap className="h-3.5 w-3.5" />,       color: "bg-red-500",    label: "Срочно" },
  important:      { icon: <AlertTriangle className="h-3.5 w-3.5" />, color: "bg-orange-500", label: "Важно" },
  notice:         { icon: <Megaphone className="h-3.5 w-3.5" />,  color: "bg-yellow-500", label: "Внимание" },
  update:         { icon: <RefreshCw className="h-3.5 w-3.5" />,  color: "bg-blue-500",   label: "Обновление" },
  info:           { icon: <Info className="h-3.5 w-3.5" />,       color: "bg-slate-500",  label: "Информация" },
  friend_request: { icon: <UserPlus className="h-3.5 w-3.5" />,   color: "bg-green-500",  label: "Друзья" },
  message:        { icon: <MessageSquare className="h-3.5 w-3.5" />, color: "bg-primary",  label: "Сообщение" },
  achievement:    { icon: <Trophy className="h-3.5 w-3.5" />,     color: "bg-yellow-600", label: "Достижение" },
};

function NotifMeta(type: string) {
  return TYPE_META[type] ?? { icon: <Info className="h-3.5 w-3.5" />, color: "bg-slate-500", label: "Уведомление" };
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "только что";
  if (min < 60) return `${min} мин назад`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} ч назад`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} дн назад`;
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();
  const ref = useRef<HTMLDivElement>(null);
  const qc = useQueryClient();

  useOnClickOutside(ref, () => setOpen(false));

  const { data: notifications = [] } = useListNotifications({
    query: { refetchInterval: 15_000 } as never,
  });

  const markAllRead = useMarkAllNotificationsRead();
  const markOneRead = useMarkNotificationRead();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAll = () => {
    markAllRead.mutate(undefined, {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListNotificationsQueryKey() }),
    });
  };

  const handleClick = (n: typeof notifications[0]) => {
    if (!n.isRead) {
      markOneRead.mutate({ id: n.id }, {
        onSuccess: () => qc.invalidateQueries({ queryKey: getListNotificationsQueryKey() }),
      });
    }
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(o => !o)}
        className="relative text-primary-foreground/80 hover:text-white hover:bg-white/10 rounded-lg"
        aria-label="Уведомления"
      >
        {unreadCount > 0 ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
        {unreadCount > 0 && (
          <motion.span
            key={unreadCount}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-0.5 rounded-full bg-accent text-white text-[9px] font-bold flex items-center justify-center border border-primary"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="fixed sm:absolute inset-x-2 sm:inset-auto top-[4.5rem] sm:top-full sm:mt-2 sm:right-0 sm:w-80 md:w-96 rounded-2xl border border-border shadow-xl bg-card z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/30">
              <span className="font-semibold text-sm text-foreground">
                Уведомления {unreadCount > 0 && <span className="text-accent">({unreadCount})</span>}
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <Check className="h-3 w-3" /> Прочитать все
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">Нет уведомлений</p>
              </div>
            ) : (
              <ScrollArea className="max-h-[400px]">
                <div className="divide-y divide-border/40">
                  {notifications.map(n => {
                    const meta = NotifMeta(n.type);
                    const isClickable = !!n.link;
                    return (
                      <div
                        key={n.id}
                        onClick={() => handleClick(n)}
                        className={`flex gap-3 px-4 py-3 transition-colors ${
                          n.isRead ? "bg-card" : "bg-primary/5"
                        } ${isClickable ? "cursor-pointer hover:bg-muted/50" : ""}`}
                      >
                        {/* Icon badge */}
                        <div className={`mt-0.5 shrink-0 h-7 w-7 rounded-full ${meta.color} text-white flex items-center justify-center`}>
                          {meta.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <p className={`text-sm leading-snug ${n.isRead ? "text-foreground/80" : "text-foreground font-medium"}`}>
                              {n.title}
                            </p>
                            {!n.isRead && <span className="mt-1.5 shrink-0 h-1.5 w-1.5 rounded-full bg-accent" />}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {n.sender && (
                              <Avatar className="h-4 w-4 inline-flex">
                                <AvatarImage src={n.sender.avatarUrl ?? undefined} />
                                <AvatarFallback className="text-[8px] bg-muted">{n.sender.name[0]}</AvatarFallback>
                              </Avatar>
                            )}
                            <span className="text-[10px] text-muted-foreground">{timeAgo(n.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}

            {notifications.length > 0 && (
              <div className="px-4 py-2.5 border-t border-border/60 bg-muted/20">
                <Link href="/cabinet/friends" onClick={() => setOpen(false)}>
                  <button className="text-xs text-accent hover:underline w-full text-center">
                    Посмотреть все →
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
