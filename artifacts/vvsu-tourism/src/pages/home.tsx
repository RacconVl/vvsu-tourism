import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Compass, Map as MapIcon, ArrowRight, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/40 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1600&auto=format&fit=crop"
            alt="Vladivostok" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight text-white mb-6 drop-shadow-lg">
              Морское путешествие <br/><span className="text-accent">к знаниям</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light drop-shadow-md">
              Станьте профессионалом туризма. Исследуйте Владивосток, выполняйте квесты и стройте свою карьеру в индустрии гостеприимства.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white border-none rounded-full px-8 h-14 text-lg" asChild>
                <Link href="/dashboard">
                  Начать экспедицию <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-white/20 bg-black/20 text-white backdrop-blur hover:bg-white/10" asChild>
                <Link href="/courses">Изучить курсы</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Compass className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Интерактивные квесты</h3>
              <p className="text-muted-foreground">Практические задания на реальных локациях Владивостока. Решайте бизнес-кейсы и получайте опыт.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <MapIcon className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Изучение региона</h3>
              <p className="text-muted-foreground">Погрузитесь в историю, культуру и географию Приморского края через нашу интерактивную карту.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="h-20 w-20 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <Shield className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Профессиональные роли</h3>
              <p className="text-muted-foreground">Развивайтесь как экскурсовод, маркетолог, дизайнер или туроператор. Каждая роль уникальна.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
