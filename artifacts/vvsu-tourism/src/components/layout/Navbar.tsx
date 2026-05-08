import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Compass, BookOpen, Map as MapIcon, Award, Users, Library, Trophy, LayoutDashboard, Brain, Sun, Moon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function Navbar() {
  const [location] = useLocation();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Кабинет", icon: LayoutDashboard },
    { href: "/courses", label: "Курсы", icon: BookOpen },
    { href: "/quizzes", label: "Тесты", icon: Brain },
    { href: "/quests", label: "Квесты", icon: Compass },
    { href: "/map", label: "Карта", icon: MapIcon },
    { href: "/achievements", label: "Достижения", icon: Award },
    { href: "/community", label: "Сообщество", icon: Users },
    { href: "/library", label: "Библиотека", icon: Library },
    { href: "/leaderboard", label: "Рейтинг", icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-primary text-primary-foreground shadow-md">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 mx-auto gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight shrink-0 mr-4">
          <Compass className="h-6 w-6 text-accent" />
          <span className="hidden sm:inline">ВВГУ Туризм</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = location.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-white/15 text-accent font-semibold"
                    : "text-primary-foreground/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
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

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-primary-foreground/80 hover:text-white hover:bg-white/10 rounded-lg"
            onClick={() => setMobileOpen(o => !o)}
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
            {navItems.map((item) => {
              const isActive = location.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    isActive
                      ? "bg-white/15 text-accent font-semibold"
                      : "text-primary-foreground/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
