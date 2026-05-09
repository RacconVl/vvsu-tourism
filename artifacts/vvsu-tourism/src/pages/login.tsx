import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useLogin, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Compass, LogIn } from "lucide-react";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const login = useLogin();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { data: { email, password } },
      {
        onSuccess: async () => {
          await qc.invalidateQueries({ queryKey: getGetMeQueryKey() });
          toast({ title: "Добро пожаловать!", description: "Вы вошли в личный кабинет." });
          setLocation("/dashboard");
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : "Не удалось войти";
          toast({ title: "Ошибка входа", description: message, variant: "destructive" });
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 flex items-start justify-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="rounded-2xl border-border/60 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Вход в кабинет</h1>
                <p className="text-sm text-muted-foreground">Институт туризма ВВГУ</p>
              </div>
            </div>
            <form onSubmit={submit} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl" data-testid="input-login-email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl" data-testid="input-login-password" />
              </div>
              <Button type="submit" className="w-full rounded-full" disabled={login.isPending} data-testid="button-submit-login">
                <LogIn className="h-4 w-4 mr-2" />
                {login.isPending ? "Вход..." : "Войти"}
              </Button>
            </form>
            <p className="text-sm text-muted-foreground text-center mt-6">
              Нет аккаунта?{" "}
              <Link href="/register" className="text-accent font-semibold hover:underline">
                Зарегистрироваться
              </Link>
            </p>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Демо-админ: <span className="font-mono">admin@vvsu.ru</span> / <span className="font-mono">admin123</span>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
