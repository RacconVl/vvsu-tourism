import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import {
  Map as MapIcon, Trophy, GraduationCap, Users,
  Sun, Moon, Menu, X, LogIn, LogOut, UserPlus, LayoutDashboard, Palette,
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
  { href: "/admission",   label: "Поступление",  icon: GraduationCap },
  { href: "/design",      label: "Дизайн & арт", icon: Palette },
  { href: "/community",   label: "Молодёжка",    icon: Users },
  { href: "/map",         label: "Карта",         icon: MapIcon },
  { href: "/leaderboard", label: "Рейтинг",       icon: Trophy },
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

  const navBg = theme === "dark" ? "#0A1220" : "#ffffff";
  const navBorder = theme === "dark" ? "3px solid rgba(255,255,255,0.1)" : "3px solid #0A0A0A";
  const textColor = theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.55)";
  const textActive = "#FF007F";
  const dividerColor = theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)";
  const logoText = theme === "dark" ? "#ffffff" : "#0A0A0A";

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{ background: navBg, borderBottom: navBorder }}
    >
      <div className="flex h-[68px] max-w-screen-2xl items-center px-8 mx-auto gap-0">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 shrink-0 mr-8" style={{ textDecoration: "none" }}>
          <img
            src="/vvsu-logo-official.png"
            alt="ВВГУ"
            style={{ height: 38, width: "auto", filter: theme === "dark" ? "brightness(0) invert(1)" : "none" }}
          />
          <div style={{ width: 1, height: 24, background: dividerColor }} />
          <span className="hidden md:block" style={{ fontWeight: 600, fontSize: 11, letterSpacing: 0.5, color: textColor, textTransform: "uppercase", maxWidth: 200, lineHeight: 1.35 }}>
            Институт туризма<br />и креативных индустрий
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center flex-1">
          {publicNavItems.map((item, i) => {
            const active = location.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`nav-${item.href.replace("/", "")}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "0 20px",
                  height: 68,
                  fontSize: 13,
                  fontWeight: active ? 700 : 600,
                  color: active ? textActive : textColor,
                  borderLeft: i > 0 ? `1px solid ${dividerColor}` : "none",
                  borderBottom: active ? `3px solid #FF007F` : "3px solid transparent",
                  textDecoration: "none",
                  transition: "color 0.15s, border-color 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                <item.icon style={{ width: 15, height: 15 }} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1 ml-auto">
          {user ? (
            <>
              <Link href="/cabinet">
                <Button
                  variant="ghost"
                  size="sm"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: location.startsWith("/cabinet") ? textActive : textColor,
                    borderRadius: 0,
                  }}
                  className="hidden md:flex"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Кабинет
                </Button>
              </Link>
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-none h-9 px-2 gap-2"
                    style={{ color: textColor }}
                    data-testid="button-user-menu"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.avatarUrl || undefined} />
                      <AvatarFallback className="text-white text-xs" style={{ background: "#FF007F" }}>
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
            <div className="flex items-center">
              <Link href="/login" style={{ display: "flex" }}>
                <Button
                  variant="ghost"
                  style={{ borderRadius: 0, fontWeight: 700, fontSize: 13, color: textColor, padding: "0 20px", height: 44, borderLeft: `1px solid ${dividerColor}` }}
                  data-testid="button-nav-login"
                >
                  <LogIn className="h-4 w-4 mr-1.5" />
                  <span className="hidden md:inline">Войти</span>
                </Button>
              </Link>
              <Link href="/register" style={{ display: "flex" }}>
                <Button
                  style={{ background: "#FF007F", color: "#ffffff", borderRadius: 0, fontWeight: 800, fontSize: 13, padding: "0 24px", height: 44, letterSpacing: 0.5 }}
                  className="hover:opacity-90 transition-opacity"
                  data-testid="button-nav-register"
                >
                  <UserPlus className="h-4 w-4 mr-1.5" />
                  <span className="hidden md:inline">Регистрация</span>
                </Button>
              </Link>
            </div>
          )}

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            style={{ borderRadius: 0, color: textColor, marginLeft: 4 }}
            data-testid="button-theme-toggle"
            aria-label="Переключить тему"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Mobile burger */}
          <Button
            variant="ghost"
            size="icon"
            style={{ borderRadius: 0, color: textColor }}
            className="lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Меню"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden"
          style={{ background: navBg, borderTop: `1px solid ${dividerColor}`, padding: "12px 24px 20px" }}
        >
          <nav className="flex flex-col">
            {publicNavItems.map((item) => {
              const active = location.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 0",
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                    color: active ? textActive : textColor,
                    borderBottom: `1px solid ${dividerColor}`,
                    textDecoration: "none",
                  }}
                >
                  <item.icon style={{ width: 16, height: 16 }} />
                  {item.label}
                </Link>
              );
            })}
            {user ? (
              <>
                <Link href="/cabinet" onClick={() => setMobileOpen(false)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", fontSize: 14, fontWeight: 500, color: textColor, borderBottom: `1px solid ${dividerColor}`, textDecoration: "none" }}
                >
                  <LayoutDashboard style={{ width: 16, height: 16 }} /> Кабинет
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", fontSize: 14, fontWeight: 500, color: textColor, background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
                >
                  <LogOut style={{ width: 16, height: 16 }} /> Выйти
                </button>
              </>
            ) : (
              <div style={{ display: "flex", gap: 12, paddingTop: 16 }}>
                <Link href="/login" onClick={() => setMobileOpen(false)} style={{ flex: 1 }}>
                  <button style={{ width: "100%", padding: "10px 0", fontWeight: 700, fontSize: 13, border: `2px solid ${dividerColor}`, background: "transparent", cursor: "pointer", color: textColor }}>
                    Войти
                  </button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} style={{ flex: 1 }}>
                  <button style={{ width: "100%", padding: "10px 0", fontWeight: 800, fontSize: 13, background: "#FF007F", border: "none", color: "#fff", cursor: "pointer" }}>
                    Регистрация
                  </button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
