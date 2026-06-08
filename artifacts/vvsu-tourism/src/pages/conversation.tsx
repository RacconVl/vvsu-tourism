import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  useGetMessages,
  useSendMessage,
  useMarkMessagesRead,
  useGetPublicProfile,
  getGetMessagesQueryKey,
  getListConversationsQueryKey,
} from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ExternalLink, Send } from "lucide-react";

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

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

function isSameDay(a: string, b: string) {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

export default function Conversation({ partnerId }: { partnerId: number }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading: profileLoading } = useGetPublicProfile(partnerId, {
    query: { enabled: partnerId > 0 } as never,
  });

  const { data: messages, isLoading: msgsLoading } = useGetMessages(partnerId, {
    query: { enabled: partnerId > 0, refetchInterval: 3000 } as never,
  });

  const sendMsg = useSendMessage();
  const markRead = useMarkMessagesRead();

  // Auto-scroll to bottom when messages load/update
  useEffect(() => {
    if (messages) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages?.length]);

  // Mark messages as read when conversation opens / new messages arrive
  useEffect(() => {
    if (!user || !messages || messages.length === 0) return;
    const hasUnread = messages.some(m => m.senderId === partnerId && !m.isRead);
    if (!hasUnread) return;
    markRead.mutate(
      { userId: partnerId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey() });
        },
      }
    );
  }, [messages]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || sendMsg.isPending) return;
    setText("");
    sendMsg.mutate(
      { userId: partnerId, data: { content: trimmed } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMessagesQueryKey(partnerId) });
          queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey() });
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        },
        onError: () => {
          toast({ title: "Ошибка", description: "Не удалось отправить сообщение.", variant: "destructive" });
          setText(trimmed);
        },
      }
    );
    inputRef.current?.focus();
  };

  const partner = profile?.user;

  return (
    <div className="flex flex-col h-full min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/cabinet/messages" className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          {profileLoading ? (
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ) : partner ? (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-9 w-9 shrink-0 ring-2 ring-accent/20">
                <AvatarImage src={partner.avatarUrl ?? undefined} />
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                  {initials(partner.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-foreground truncate">{partner.name}</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                    Ур. {partner.level}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {roleLabels[partner.studentRole] ?? partner.studentRole}
                </p>
              </div>
              <Link href={`/profile/${partnerId}`}>
                <button className="shrink-0 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <ExternalLink className="h-4 w-4" />
                </button>
              </Link>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Пользователь не найден</span>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {msgsLoading ? (
          <div className="space-y-3 pt-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                <Skeleton className={`h-10 rounded-2xl ${i % 2 === 0 ? "w-48" : "w-60"}`} />
              </div>
            ))}
          </div>
        ) : !messages || messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            {partner && (
              <Avatar className="h-16 w-16 mb-4 ring-4 ring-accent/20">
                <AvatarImage src={partner.avatarUrl ?? undefined} />
                <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                  {initials(partner.name)}
                </AvatarFallback>
              </Avatar>
            )}
            <h3 className="font-bold text-foreground mb-1">{partner?.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {partner ? `${roleLabels[partner.studentRole] ?? partner.studentRole} · Ур. ${partner.level}` : ""}
            </p>
            <p className="text-xs text-muted-foreground">Напишите первое сообщение</p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => {
              const isMine = msg.senderId === user?.id;
              const showDateSep = i === 0 || !isSameDay(messages[i - 1].createdAt, msg.createdAt);

              return (
                <div key={msg.id}>
                  {showDateSep && (
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px bg-border/50" />
                      <span className="text-xs text-muted-foreground shrink-0 bg-background px-2">
                        {formatDate(msg.createdAt)}
                      </span>
                      <div className="flex-1 h-px bg-border/50" />
                    </div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.15 }}
                    className={`flex mb-1 ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[75%] group ${isMine ? "items-end" : "items-start"} flex flex-col`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                          isMine
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-card border border-border/60 text-foreground rounded-bl-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {formatTime(msg.createdAt)}
                        {isMine && <span className="ml-1">{msg.isRead ? "✓✓" : "✓"}</span>}
                      </span>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="sticky bottom-0 bg-card/95 backdrop-blur-md border-t border-border/50 px-4 py-3 pb-safe">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <Input
            ref={inputRef}
            placeholder="Напишите сообщение..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            className="flex-1 rounded-xl"
            disabled={sendMsg.isPending}
          />
          <Button
            onClick={handleSend}
            disabled={!text.trim() || sendMsg.isPending}
            className="rounded-xl px-4 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
