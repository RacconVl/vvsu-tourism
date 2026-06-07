import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListCourses, useAdminCreateCourse, getListCoursesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Lock, Star, ChevronRight, BookOpen, Plus } from "lucide-react";

const roleColors: Record<string, string> = {
  guide: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  marketer: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  designer: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  operator: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
};

const roleLabels: Record<string, string> = {
  guide: "Экскурсовод", marketer: "Маркетолог", designer: "Дизайнер", operator: "Туроператор",
};

const stageOptions = [
  "Порт отправления", "Бухта открытий", "Морские пути", "Горизонт знаний", "Тихоокеанский горизонт",
];

type CourseForm = {
  title: string;
  description: string;
  role: string;
  stage: string;
  category: string;
  xpReward: string;
  imageUrl: string;
};

const emptyForm: CourseForm = {
  title: "", description: "", role: "guide", stage: stageOptions[0],
  category: "general", xpReward: "100", imageUrl: "",
};

export default function Courses() {
  const { data: courses, isLoading } = useListCourses();
  const { isAdmin } = useAuth();
  const create = useAdminCreateCourse();
  const qc = useQueryClient();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CourseForm>(emptyForm);

  const handleCreate = () => {
    const { title, description, role, stage, category, xpReward, imageUrl } = form;
    if (!title.trim() || !description.trim()) return;
    create.mutate(
      { data: { title, description, role, stage, category, xpReward: Number(xpReward) || 100, imageUrl: imageUrl || undefined } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListCoursesQueryKey() });
          toast({ title: "Курс создан", description: `«${title}» добавлен в список курсов.` });
          setOpen(false);
          setForm(emptyForm);
        },
        onError: () => toast({ title: "Ошибка", description: "Не удалось создать курс.", variant: "destructive" }),
      },
    );
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-6 w-6 text-accent" />
                <span className="text-muted-foreground uppercase tracking-widest text-xs">Учебный план</span>
              </div>
              <h1 className="text-4xl font-bold text-foreground">Курсы обучения</h1>
              <p className="text-muted-foreground mt-2 text-lg">Каждый курс — это этап вашего путешествия к профессионализму</p>
            </div>
            {isAdmin && (
              <Button onClick={() => setOpen(true)} className="rounded-full gap-2 shrink-0">
                <Plus className="h-4 w-4" /> Добавить курс
              </Button>
            )}
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-80 w-full rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses?.map((course, i) => {
              const progress = course.totalModules > 0
                ? Math.round((course.completedModules / course.totalModules) * 100)
                : 0;
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  data-testid={`card-course-${course.id}`}
                >
                  <Link href={course.isLocked ? "#" : `/cabinet/courses/${course.id}`}>
                    <Card className={`overflow-hidden rounded-2xl border-border/60 h-full cursor-pointer transition-shadow hover:shadow-xl ${course.isLocked ? "opacity-60" : ""}`}>
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={course.imageUrl ?? "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600"}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {course.isLocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <Lock className="h-12 w-12 text-white/80" />
                          </div>
                        )}
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                          <Badge className={`${roleColors[course.role] ?? "bg-muted text-muted-foreground"} text-xs border-0`}>
                            {roleLabels[course.role] ?? course.role}
                          </Badge>
                          <span className="text-white/80 text-xs font-medium">{course.stage}</span>
                        </div>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <h3 className="font-bold text-foreground text-base leading-tight line-clamp-2">{course.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>{course.completedModules}/{course.totalModules} модулей</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-1.5" />
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1 text-accent text-xs font-semibold">
                            <Star className="h-3.5 w-3.5" />
                            <span>{course.xpReward} XP</span>
                          </div>
                          {!course.isLocked && (
                            <span className="text-xs text-primary flex items-center gap-1 font-medium">
                              {progress === 100 ? "Завершён" : progress > 0 ? "Продолжить" : "Начать"}
                              <ChevronRight className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Admin: Create Course Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-accent" /> Новый курс
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Название *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="rounded-xl" placeholder="Введение в туризм" />
            </div>
            <div className="space-y-1.5">
              <Label>Описание *</Label>
              <Textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="rounded-xl" placeholder="Краткое описание курса..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Специализация</Label>
                <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guide">Экскурсовод</SelectItem>
                    <SelectItem value="marketer">Маркетолог</SelectItem>
                    <SelectItem value="designer">Дизайнер</SelectItem>
                    <SelectItem value="operator">Туроператор</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Этап</Label>
                <Select value={form.stage} onValueChange={v => setForm(f => ({ ...f, stage: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {stageOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Категория</Label>
                <Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="rounded-xl" placeholder="general" />
              </div>
              <div className="space-y-1.5">
                <Label>XP за курс</Label>
                <Input type="number" value={form.xpReward} onChange={e => setForm(f => ({ ...f, xpReward: e.target.value }))} className="rounded-xl" min={0} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Изображение (URL)</Label>
              <Input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} className="rounded-xl" placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
            <Button
              onClick={handleCreate}
              disabled={create.isPending || !form.title.trim() || !form.description.trim()}
            >
              {create.isPending ? "Создание..." : "Создать курс"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
