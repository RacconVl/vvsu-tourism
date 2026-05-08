import { motion } from "framer-motion";
import { useGetLeaderboard } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Star, Compass, Flame } from "lucide-react";

const roleLabels: Record<string, string> = {
  guide: "Экскурсовод",
  marketer: "Маркетолог",
  designer: "Дизайнер",
  operator: "Туроператор",
};

const rankStyle = (rank: number) => {
  if (rank === 1) return { bg: "from-yellow-400 to-amber-500", text: "text-yellow-600", medal: "🥇" };
  if (rank === 2) return { bg: "from-gray-300 to-gray-400", text: "text-gray-500", medal: "🥈" };
  if (rank === 3) return { bg: "from-amber-600 to-amber-700", text: "text-amber-600", medal: "🥉" };
  return { bg: "", text: "text-muted-foreground", medal: `#${rank}` };
};

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useGetLeaderboard();

  const top3 = leaderboard?.slice(0, 3) ?? [];
  const rest = leaderboard?.slice(3) ?? [];

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="h-6 w-6 text-accent" />
            <span className="text-muted-foreground uppercase tracking-widest text-xs">Рейтинг</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Зал славы</h1>
          <p className="text-muted-foreground mt-2">Лучшие студенты института туризма и креативных индустрий</p>
        </motion.div>

        {/* Top 3 Podium */}
        {!isLoading && top3.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-center gap-4 mb-10"
          >
            {[top3[1], top3[0], top3[2]].map((entry, idx) => {
              const actualRank = entry.rank;
              const styles = rankStyle(actualRank);
              const heights = [idx === 1 ? "h-36" : "h-28"];
              return (
                <div key={entry.rank} className="flex flex-col items-center gap-2">
                  <img src={entry.avatarUrl} alt={entry.studentName} className="h-14 w-14 rounded-full object-cover ring-4 ring-white shadow-lg" />
                  <p className="text-sm font-semibold text-foreground text-center max-w-20 line-clamp-2">{entry.studentName}</p>
                  <p className="text-xs text-muted-foreground">{entry.xp.toLocaleString()} XP</p>
                  <div className={`w-24 ${heights[0] ?? "h-28"} rounded-t-2xl bg-gradient-to-t ${styles.bg || "from-muted to-muted-foreground/30"} flex items-start justify-center pt-3`}>
                    <span className="text-2xl">{actualRank <= 3 ? ["🥇","🥈","🥉"][actualRank-1] : `#${actualRank}`}</span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Full List */}
        <Card className="rounded-2xl border-border/60">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {leaderboard?.map((entry, i) => {
                  const styles = rankStyle(entry.rank);
                  const isMe = entry.studentName === "Александра Морозова";
                  return (
                    <motion.div
                      key={entry.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-4 p-4 transition-colors ${isMe ? "bg-accent/5" : "hover:bg-muted/30"}`}
                      data-testid={`row-leaderboard-${entry.rank}`}
                    >
                      <div className={`w-8 text-center font-bold text-sm ${styles.text}`}>
                        {entry.rank <= 3 ? ["🥇","🥈","🥉"][entry.rank-1] : entry.rank}
                      </div>
                      <img src={entry.avatarUrl} alt={entry.studentName} className="h-10 w-10 rounded-full object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`font-semibold text-sm ${isMe ? "text-accent" : "text-foreground"}`}>{entry.studentName}</p>
                          {isMe && <Badge className="bg-accent text-white border-0 text-xs">Вы</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{roleLabels[entry.role] ?? entry.role}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-1 justify-end">
                          <Badge variant="outline" className="text-xs">Ур. {entry.level}</Badge>
                        </div>
                        <p className="text-sm font-bold text-accent mt-1 flex items-center gap-1 justify-end">
                          <Flame className="h-3.5 w-3.5" /> {entry.xp.toLocaleString()} XP
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-0.5">
                          <Compass className="h-3 w-3" /> {entry.completedQuests} квест.
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
