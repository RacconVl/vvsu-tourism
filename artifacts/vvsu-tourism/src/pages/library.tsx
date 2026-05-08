import { useState } from "react";
import { motion } from "framer-motion";
import { useListLibraryResources } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Library, PlayCircle, BarChart3, FileText, Database, Zap, ExternalLink, Filter } from "lucide-react";

const typeConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  video: { icon: <PlayCircle className="h-5 w-5" />, color: "text-red-500 bg-red-50", label: "Видео" },
  infographic: { icon: <BarChart3 className="h-5 w-5" />, color: "text-blue-500 bg-blue-50", label: "Инфографика" },
  presentation: { icon: <FileText className="h-5 w-5" />, color: "text-purple-500 bg-purple-50", label: "Презентация" },
  article: { icon: <FileText className="h-5 w-5" />, color: "text-green-500 bg-green-50", label: "Статья" },
  database: { icon: <Database className="h-5 w-5" />, color: "text-amber-500 bg-amber-50", label: "База данных" },
};

export default function LibraryPage() {
  const { data: resources, isLoading } = useListLibraryResources();
  const [selectedType, setSelectedType] = useState<string>("all");

  const types = ["all", ...Object.keys(typeConfig)];
  const filtered = resources?.filter(r => selectedType === "all" || r.type === selectedType);

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Library className="h-6 w-6 text-accent" />
            <span className="text-muted-foreground uppercase tracking-widest text-xs">Ресурсы</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Библиотека</h1>
          <p className="text-muted-foreground mt-2">Учебные материалы, исследования и интерактивные ресурсы</p>
        </motion.div>

        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {types.map(t => (
            <Button
              key={t}
              variant={selectedType === t ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(t)}
              className="rounded-full"
              data-testid={`filter-library-${t}`}
            >
              {t === "all" ? "Все" : typeConfig[t]?.label ?? t}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-60 w-full rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered?.map((resource, i) => {
              const cfg = typeConfig[resource.type] ?? typeConfig.article;
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4 }}
                  data-testid={`card-resource-${resource.id}`}
                >
                  <Card className="overflow-hidden rounded-2xl border-border/60 hover:shadow-xl transition-shadow h-full flex flex-col">
                    <div className="h-40 overflow-hidden">
                      <img src={resource.thumbnailUrl} alt={resource.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`p-1.5 rounded-lg ${cfg.color}`}>{cfg.icon}</div>
                        <Badge variant="outline" className="text-xs">{resource.category}</Badge>
                        {resource.isInteractive && (
                          <Badge className="text-xs bg-accent text-white border-0 flex items-center gap-1">
                            <Zap className="h-3 w-3" /> Интерактив
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-bold text-foreground text-sm leading-tight mb-2 flex-1">{resource.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{resource.description}</p>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="w-full rounded-xl" data-testid={`button-open-resource-${resource.id}`}>
                          <ExternalLink className="h-3.5 w-3.5 mr-2" /> Открыть ресурс
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
