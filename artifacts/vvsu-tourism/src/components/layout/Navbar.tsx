import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import {
  Map as MapIcon, Trophy, GraduationCap, Users,
  Sun, Moon, Menu, X, LogIn, LogOut, UserPlus, LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { useLogout, getGetMeQueryKey, getGetMyProfileQueryKey, getGetDashboardSummaryQueryKey, setAuthTokenGetter } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationBell } from "@/components/notifications/NotificationBell";

const publicNavItems = [
  { href: "/admission",        label: "Поступление", icon: GraduationCap },
  { href: "/community",         label: "Молодёжка",   icon: Users },
  { href: "/map",              label: "Карта",        icon: MapIcon },
  { href: "/leaderboard",      label: "Рейтинг",      icon: Trophy },
];

export function Navbar() {
  const [location] = useLocation();
  const { theme, toggle } = useTheme();
  const { user, isAdmin } = useAuth();
  const logout = useLogout();
  const qc = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("vvsu_auth_token");
    setAuthTokenGetter(null);
    qc.removeQueries({ queryKey: getGetMyProfileQueryKey() });
    qc.removeQueries({ queryKey: getGetDashboardSummaryQueryKey() });
    logout.mutate(undefined, {
      onSettled: () => {
        qc.setQueryData(getGetMeQueryKey(), { user: null });
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-primary text-primary-foreground shadow-md">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 mx-auto gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 mr-4">
          <img src="/vvsu-logo-real.png" className="h-8 w-auto brightness-0 invert" alt="ВВГУ" />
          <div className="hidden md:flex flex-col leading-tight">
            <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">ВВГУ</span>
            <span className="text-[11px] font-bold text-white uppercase leading-tight max-w-[200px]">
              Институт туризма и<br/>креативных индустрий
            </span>
          </div>
        </Link>

        {/* Desktop public nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {publicNavItems.map((item) => {
            const active = location.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-white/15 text-accent font-semibold"
                    : "text-primary-foreground/80 hover:bg-white/10 hover:text-white"
                }`}
                data-testid={`nav-${item.href.replace("/", "")}`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1 ml-auto">
          {user ? (
            <>
              {/* Cabinet shortcut */}
              <Link href="/cabinet">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`hidden md:flex items-center gap-1.5 rounded-full text-sm transition-all ${
                    location.startsWith("/cabinet")
                      ? "bg-white/15 text-accent font-semibold"
                      : "text-primary-foreground/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Кабинет
                </Button>
              </Link>

              {/* Notification bell */}
              <NotificationBell />

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full h-9 px-2 gap-2 text-primary-foreground hover:bg-white/10"
                    data-testid="button-user-menu"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.avatarUrl || undefined} />
                      <AvatarFallback className="bg-accent text-white text-xs">
                        {user.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm">{user.name.split(" ")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-xs text-muted-foreground font-normal">{user.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/cabinet" data-testid="menu-cabinet">
                      <LayoutDashboard className="h-4 w-4 mr-2" /> Мой кабинет
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">
                    <LogOut className="h-4 w-4 mr-2" /> Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-primary-foreground hover:bg-white/10 rounded-full px-3 md:px-5 py-2.5 text-sm font-medium"
                  data-testid="button-nav-login"
                >
                  <LogIn className="h-4 w-4 md:mr-1.5" /> <span className="hidden md:inline">Войти</span>
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  className="bg-accent hover:bg-accent/90 text-white rounded-full px-3 md:px-5 py-2.5 text-sm font-medium"
                  data-testid="button-nav-register"
                >
                  <UserPlus className="h-4 w-4 md:mr-1.5" /> <span className="hidden md:inline">Регистрация</span>
                </Button>
              </Link>
            </div>
          )}

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="text-primary-foreground/80 hover:text-white hover:bg-white/10 rounded-lg"
            data-testid="button-theme-toggle"
            aria-label="Переключить тему"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Mobile burger */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-primary-foreground/80 hover:text-white hover:bg-white/10 rounded-lg"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Меню"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-primary px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-3">
            {publicNavItems.map((item) => {
              const active = location.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    active
                      ? "bg-white/15 text-accent font-semibold"
                      : "text-primary-foreground/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            {user ? (
              <>
                <Link href="/cabinet" onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    location.startsWith("/cabinet")
                      ? "bg-white/15 text-accent font-semibold"
                      : "text-primary-foreground/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" /> Кабинет
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-primary-foreground/80 hover:bg-white/10 hover:text-white transition-all w-full text-left"
                >
                  <LogOut className="h-4 w-4" /> Выйти
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-3 mt-2 border-t border-white/10">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full rounded-full bg-white/10 border-white/20 text-white">
                    <LogIn className="h-4 w-4 mr-1" /> Войти
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button size="sm" className="w-full bg-accent hover:bg-accent/90 text-white rounded-full">
                    <UserPlus className="h-4 w-4 mr-1" /> Регистрация
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
