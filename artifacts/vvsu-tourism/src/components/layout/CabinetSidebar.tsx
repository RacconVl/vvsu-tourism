import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { LayoutDashboard, BookOpen, Swords, Users, User, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const sidebarItems = [
  { href: "/cabinet",           label: "Обзор",       icon: LayoutDashboard },
  { href: "/cabinet/courses",   label: "Курсы",       icon: BookOpen },
  { href: "/cabinet/tasks",     label: "Задания",     icon: Swords },
  { href: "/cabinet/community", label: "Сообщество",  icon: Users },
  { href: "/cabinet/profile",   label: "Профиль",     icon: User },
];

function isActive(href: string, location: string) {
  if (href === "/cabinet") return location === "/cabinet" || location === "/cabinet/";
  return location.startsWith(href);
}

export function CabinetSidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  return (
    <aside className="w-60 shrink-0 hidden md:flex flex-col min-h-full border-r border-border/60 bg-card">
      {/* User card */}
      <div className="p-5 border-b border-border/60">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-accent/30">
            <AvatarImage src={user?.avatarUrl ?? undefined} />
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
          const active = isActive(item.href, location);
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
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="p-3 border-t border-border/60">
        <Link href="/cabinet/profile">
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all ${
            location.startsWith("/cabinet/profile")
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}>
            <Settings className="h-4 w-4" />
            Настройки
          </div>
        </Link>
      </div>
    </aside>
  );
}
