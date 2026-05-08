import { motion } from "framer-motion";
import { useListAchievements } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Lock, Star, Anchor, Compass, Map, BookOpen, MessageCircle } from "lucide-react";

const categoryConfig: Record<string, { label: string; color: string; bg: string }> = {
  exploration: { label: "Исследование", color: "text-teal-600", bg: "bg-teal-50" },
  learning: { label: "Обучение", color: "text-blue-600", bg: "bg-blue-50" },
  social: { label: "Общение", color: "text-purple-600", bg: "bg-purple-50" },
  mastery: { label: "Мастерство", color: "text-amber-600", bg: "bg-amber-50" },
};

const iconMap: Record<string, React.ReactNode> = {
  anchor: <Anchor className="h-8 w-8" />,
  compass: <Compass className="h-8 w-8" />,
  ship: <Anchor className="h-8 w-8" />,
  "message-circle": <MessageCircle className="h-8 w-8" />,
  map: <Map className="h-8 w-8" />,
  star: <Star className="h-8 w-8" />,
  award: <Award className="h-8 w-8" />,
  "book-open": <BookOpen className="h-8 w-8" />,
};

export default function Achievements() {
  const { data: achievements, isLoading } = useListAchievements();

  const unlocked = achievements?.filter(a => a.isUnlocked) ?? [];
  const locked = achievements?.filter(a => !a.isUnlocked) ?? [];

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Award className="h-6 w-6 text-accent" />
            <span className="text-muted-foreground uppercase tracking-widest text-xs">Коллекция</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Достижения</h1>
          <p className="text-muted-foreground mt-2">
            {isLoading ? "..." : `${unlocked.length} из ${achievements?.length ?? 0} разблокировано`}
          </p>
        </motion.div>

        {/* Unlocked */}
        {unlocked.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" /> Разблокированные
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {unlocked.map((ach, i) => {
                const catCfg = categoryConfig[ach.category] ?? categoryConfig.learning;
                return (
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ y: -4 }}
                    data-testid={`card-achievement-${ach.id}`}
                  >
                    <Card className="rounded-2xl border-border/60 hover:shadow-xl transition-shadow text-center">
                      <CardContent className="p-5">
                        <div className={`h-16 w-16 rounded-2xl ${catCfg.bg} ${catCfg.color} flex items-center justify-center mx-auto mb-3`}>
                          {iconMap[ach.icon] ?? <Award className="h-8 w-8" />}
                        </div>
                        <h3 className="font-bold text-sm text-foreground mb-1">{ach.title}</h3>
                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{ach.description}</p>
                        <div className="flex items-center justify-center gap-2">
                          <Badge className="text-xs bg-accent text-white border-0">+{ach.xpValue} XP</Badge>
                          <Badge variant="outline" className={`text-xs ${catCfg.color} border-current`}>
                            {catCfg.label}
                          </Badge>
                        </div>
                        {ach.unlockedAt && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(ach.unlockedAt).toLocaleDateString("ru-RU")}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Locked */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
          </div>
        ) : locked.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-muted-foreground mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5" /> Ещё предстоит открыть
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {locked.map((ach, i) => (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.07 }}
                  data-testid={`card-achievement-locked-${ach.id}`}
                >
                  <Card className="rounded-2xl border-border/60 text-center opacity-50">
                    <CardContent className="p-5">
                      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                        <Lock className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-bold text-sm text-foreground mb-1">{ach.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{ach.description}</p>
                      <Badge variant="outline" className="text-xs">{ach.xpValue} XP</Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
