import { type ReactNode } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, LogIn, UserPlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function RequireAuth({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const { user, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-12 w-1/2 rounded-xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-16 px-4 flex items-start justify-center">
        <Card className="max-w-lg w-full rounded-2xl border-border/60">
          <CardContent className="p-8 text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-4">
              <Lock className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Требуется вход</h2>
            <p className="text-muted-foreground mb-6">
              Этот раздел доступен только зарегистрированным студентам Института туризма и креативных индустрий.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/login">
                <Button className="rounded-full" data-testid="button-go-login">
                  <LogIn className="h-4 w-4 mr-2" /> Войти
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="rounded-full" data-testid="button-go-register">
                  <UserPlus className="h-4 w-4 mr-2" /> Регистрация
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen bg-background py-16 px-4 flex items-start justify-center">
        <Card className="max-w-lg w-full rounded-2xl border-border/60">
          <CardContent className="p-8 text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-4">
              <Lock className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Доступ ограничен</h2>
            <p className="text-muted-foreground">Эта страница доступна только администратору.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
