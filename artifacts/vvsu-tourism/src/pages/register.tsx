import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useRegister, getGetMeQueryKey, getGetMyProfileQueryKey, getGetDashboardSummaryQueryKey, setAuthTokenGetter } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Compass, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const register = useRegister();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "", studentRole: "guide" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate(
      { data: form },
      {
        onSuccess: (data) => {
          const { token, ...user } = data;
          localStorage.setItem("vvsu_auth_token", token);
          setAuthTokenGetter(() => localStorage.getItem("vvsu_auth_token"));
          qc.setQueryData(getGetMeQueryKey(), { user });
          qc.removeQueries({ queryKey: getGetMyProfileQueryKey() });
          qc.removeQueries({ queryKey: getGetDashboardSummaryQueryKey() });
          toast({ title: "Аккаунт создан!", description: "Добро пожаловать в институт." });
          setLocation("/cabinet");
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : "Не удалось зарегистрироваться";
          toast({ title: "Ошибка регистрации", description: message, variant: "destructive" });
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
                <h1 className="text-2xl font-bold text-foreground">Регистрация</h1>
                <p className="text-sm text-muted-foreground">Начните путешествие в туризме</p>
              </div>
            </div>
            <form onSubmit={submit} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input id="name" required minLength={2} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="rounded-xl" data-testid="input-reg-name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="rounded-xl" data-testid="input-reg-email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль (минимум 6 символов)</Label>
                <Input id="password" type="password" required minLength={6} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="rounded-xl" data-testid="input-reg-password" />
              </div>
              <div className="space-y-2">
                <Label>Специализация</Label>
                <Select value={form.studentRole} onValueChange={(v) => setForm((f) => ({ ...f, studentRole: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guide">Экскурсовод</SelectItem>
                    <SelectItem value="marketer">Маркетолог</SelectItem>
                    <SelectItem value="designer">Дизайнер</SelectItem>
                    <SelectItem value="operator">Туроператор</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full rounded-full" disabled={register.isPending} data-testid="button-submit-register">
                <UserPlus className="h-4 w-4 mr-2" />
                {register.isPending ? "Создание..." : "Создать аккаунт"}
              </Button>
            </form>
            <p className="text-sm text-muted-foreground text-center mt-6">
              Уже есть аккаунт?{" "}
              <Link href="/login" className="text-accent font-semibold hover:underline">
                Войти
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
