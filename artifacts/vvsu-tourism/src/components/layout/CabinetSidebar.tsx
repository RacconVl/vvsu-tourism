import { Link, useLocation, useSearch } from "wouter";
import { motion } from "framer-motion";
import { LayoutDashboard, BookOpen, Swords, Users, Settings, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useListConversations } from "@workspace/api-client-react";

const sidebarItems = [
  { href: "/cabinet",           label: "Обзор",        icon: LayoutDashboard },
  { href: "/cabinet/courses",   label: "Курсы",        icon: BookOpen },
  { href: "/cabinet/tasks",     label: "Задания",      icon: Swords },
  { href: "/cabinet/community", label: "Сообщество",   icon: Users },
  { href: "/cabinet/messages",  label: "Сообщения",    icon: MessageSquare },
];

function isActive(href: string, location: string, search: string) {
  if (href === "/cabinet") {
    if (location !== "/cabinet" && location !== "/cabinet/") return false;
    const params = new URLSearchParams(search);
    return !params.get("tab") || params.get("tab") === "overview";
  }
  return location.startsWith(href);
}

export function CabinetSidebar() {
  const { user } = useAuth();
  const [location] = useLocation();
  const search = useSearch();

  const { data: conversations } = useListConversations({
    query: { enabled: !!user, refetchInterval: 10000 } as never,
  });
  const totalUnread = conversations?.reduce((sum, c) => sum + c.unreadCount, 0) ?? 0;

  const settingsActive =
    (location === "/cabinet" || location === "/cabinet/") &&
    new URLSearchParams(search).get("tab") === "settings";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-60 shrink-0 hidden md:flex flex-col min-h-full border-r border-border/60 bg-card">
        {/* User card */}
        <div className="p-5 border-b border-border/60">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-accent/30">
              <AvatarImage src={user?.avatarUrl || undefined} />
              <AvatarFallback className="bg-accent text-white text-sm font-bold">
                {user?.name?.split(" ").map(s => s[0]).join("").slice(0, 2) ?? "??"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">{user?.name ?? "..."}</p>
              <p className="text-xs text-muted-foreground">Ур. {user?.level ?? 1} · {user?.xp ?? 0} XP</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map(item => {
            const active = isActive(item.href, location, search);
            const isMsgs = item.href === "/cabinet/messages";
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 2 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {isMsgs && totalUnread > 0 && (
                    <span className="h-5 min-w-5 px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                      {totalUnread > 99 ? "99+" : totalUnread}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}

          {/* Divider + Settings */}
          <div className="pt-2 mt-2 border-t border-border/60">
            <Link href="/cabinet?tab=settings">
              <motion.div
                whileHover={{ x: 2 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all ${
                  settingsActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Settings className="h-4 w-4 shrink-0" />
                Настройки
              </motion.div>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-card/95 backdrop-blur-md border-t border-border/60 flex items-stretch h-16 safe-area-bottom">
        {[...sidebarItems, { href: "/cabinet?tab=settings", label: "Настройки", icon: Settings }].map(item => {
          const active =
            item.href === "/cabinet?tab=settings"
              ? settingsActive
              : isActive(item.href, location, search);
          const isMsgs = item.href === "/cabinet/messages";
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <div className={`relative flex flex-col items-center justify-center h-full gap-1 transition-colors ${active ? "text-accent" : "text-muted-foreground"}`}>
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-accent transition-all duration-200 ${active ? "w-8 opacity-100" : "w-0 opacity-0"}`} />
                <div className="relative">
                  <item.icon className={`h-5 w-5 transition-all duration-200 ${active ? "scale-110" : ""}`} />
                  {isMsgs && totalUnread > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-0.5 rounded-full bg-accent text-white text-[9px] font-bold flex items-center justify-center">
                      {totalUnread > 9 ? "9+" : totalUnread}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-medium leading-none transition-colors ${active ? "text-accent" : ""}`}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
