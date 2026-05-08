import { useState } from "react";
import { motion } from "framer-motion";
import { useListQuests, useSubmitQuest, getListQuestsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Compass, CheckCircle, MapPin, Star, Swords, Filter } from "lucide-react";

const typeColors: Record<string, string> = {
  route: "bg-teal-100 text-teal-700",
  budget: "bg-amber-100 text-amber-700",
  marketing: "bg-purple-100 text-purple-700",
  design: "bg-rose-100 text-rose-700",
};
const typeLabels: Record<string, string> = {
  route: "Маршрут",
  budget: "Бюджет",
  marketing: "Маркетинг",
  design: "Дизайн",
};
const difficultyColors: Record<string, string> = {
  easy: "text-green-600",
  medium: "text-amber-600",
  hard: "text-red-600",
};
const difficultyLabels: Record<string, string> = {
  easy: "Лёгкий",
  medium: "Средний",
  hard: "Сложный",
};

export default function Quests() {
  const { data: quests, isLoading } = useListQuests();
  const submitQuest = useSubmitQuest();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");

  const types = ["all", "route", "budget", "marketing", "design"];

  const filtered = quests?.filter(q => selectedType === "all" || q.type === selectedType);

  const handleSubmit = () => {
    if (!submittingId || !answer.trim()) return;
    submitQuest.mutate({ id: submittingId, data: { answer } }, {
      onSuccess: (result) => {
        toast({ title: result.success ? "Квест выполнен!" : "Попробуйте ещё раз", description: result.feedback });
        queryClient.invalidateQueries({ queryKey: getListQuestsQueryKey() });
        setSubmittingId(null);
        setAnswer("");
      }
    });
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Compass className="h-6 w-6 text-accent" />
            <span className="text-muted-foreground uppercase tracking-widest text-xs">Задания</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Квесты</h1>
          <p className="text-muted-foreground mt-2">Решайте реальные задачи туристической индустрии Владивостока</p>
        </motion.div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {types.map(t => (
            <Button
              key={t}
              variant={selectedType === t ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(t)}
              className="rounded-full"
              data-testid={`filter-${t}`}
            >
              {t === "all" ? "Все" : typeLabels[t]}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-72 w-full rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered?.map((quest, i) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={!quest.isCompleted ? { y: -4 } : {}}
                data-testid={`card-quest-${quest.id}`}
              >
                <Card className={`overflow-hidden rounded-2xl border-border/60 h-full ${quest.isCompleted ? "opacity-70" : "hover:shadow-xl transition-shadow"}`}>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={quest.imageUrl ?? "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600"}
                      alt={quest.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {quest.isCompleted && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <CheckCircle className="h-12 w-12 text-green-400" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className={`${typeColors[quest.type] ?? ""} text-xs border-0`}>
                        {typeLabels[quest.type] ?? quest.type}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-bold text-foreground leading-tight">{quest.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{quest.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-medium flex items-center gap-1 ${difficultyColors[quest.difficulty] ?? ""}`}>
                          <Swords className="h-3.5 w-3.5" /> {difficultyLabels[quest.difficulty]}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {quest.locationName}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-accent flex items-center gap-1">
                        <Star className="h-3.5 w-3.5" /> {quest.xpReward} XP
                      </span>
                    </div>
                    {!quest.isCompleted && (
                      <Button
                        className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                        size="sm"
                        onClick={() => { setSubmittingId(quest.id); setAnswer(""); }}
                        data-testid={`button-start-quest-${quest.id}`}
                      >
                        Выполнить квест
                      </Button>
                    )}
                    {quest.isCompleted && (
                      <Button className="w-full rounded-xl" size="sm" variant="outline" disabled>
                        Выполнен
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!submittingId} onOpenChange={() => setSubmittingId(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Отправить ответ на квест</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Опишите ваше решение задания..."
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            rows={5}
            className="rounded-xl"
            data-testid="input-quest-answer"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmittingId(null)}>Отмена</Button>
            <Button
              onClick={handleSubmit}
              disabled={submitQuest.isPending || !answer.trim()}
              data-testid="button-submit-quest"
            >
              {submitQuest.isPending ? "Отправляю..." : "Отправить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
