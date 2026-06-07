import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Compass, Map as MapIcon, ArrowRight, Shield, Anchor, Waves, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-[88vh] overflow-hidden flex items-center justify-center"
        style={{ background: "linear-gradient(160deg, #0a1a2e 0%, #0d2444 30%, #033F7E 70%, #0a2d5c 100%)" }}
      >
        {/* Animated dot grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Decorative anchor */}
        <div className="absolute right-[8%] top-[12%] opacity-[0.06] pointer-events-none">
          <Anchor className="h-72 w-72 text-white" style={{ transform: "rotate(15deg)" }} />
        </div>

        {/* Decorative stars */}
        {[
          { top: "18%", left: "12%", size: 3, delay: 0 },
          { top: "32%", left: "7%", size: 2, delay: 0.8 },
          { top: "55%", left: "15%", size: 2.5, delay: 0.4 },
          { top: "22%", right: "22%", size: 2, delay: 1.2 },
          { top: "68%", right: "10%", size: 3, delay: 0.6 },
          { top: "78%", left: "30%", size: 2, delay: 1.5 },
          { top: "12%", left: "45%", size: 1.5, delay: 0.9 },
          { top: "42%", right: "28%", size: 2.5, delay: 0.3 },
        ].map((s, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white pointer-events-none"
            style={{ top: s.top, left: (s as { left?: string }).left, right: (s as { right?: string }).right, width: s.size, height: s.size }}
            animate={{ opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 3 + i * 0.4, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Orange accent glow */}
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(235,113,36,0.12) 0%, transparent 70%)" }}
        />

        {/* Wave at bottom */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none">
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full">
            <path d="M0,45 C240,90 480,0 720,45 C960,90 1200,10 1440,45 L1440,90 L0,90 Z" fill="hsl(var(--background))" />
          </svg>
        </div>

        <div className="relative z-20 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/8 backdrop-blur text-white/70 text-sm mb-8"
            >
              <Waves className="h-4 w-4 text-accent" />
              ВВГУ · Институт туризма и креативных индустрий
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-tight">
              Морское путешествие <br />
              <span className="text-accent drop-shadow-[0_0_32px_rgba(235,113,36,0.5)]">к знаниям</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Станьте профессионалом туризма. Исследуйте Владивосток, выполняйте квесты и стройте карьеру в индустрии гостеприимства.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white border-none rounded-full px-8 h-14 text-lg shadow-[0_0_32px_rgba(235,113,36,0.35)]" asChild>
                <Link href="/dashboard">
                  Начать экспедицию <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-white/20 bg-white/5 text-white backdrop-blur hover:bg-white/10" asChild>
                <Link href="/courses">Изучить курсы</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-foreground mb-16"
          >
            Платформа нового поколения
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Compass className="h-9 w-9" />,
                color: "#033F7E",
                title: "Интерактивные квесты",
                desc: "Практические задания на реальных локациях Владивостока. Решайте бизнес-кейсы и получайте опыт.",
              },
              {
                icon: <MapIcon className="h-9 w-9" />,
                color: "#EB7124",
                title: "Изучение региона",
                desc: "Погрузитесь в историю, культуру и географию Приморского края через нашу интерактивную карту.",
              },
              {
                icon: <Shield className="h-9 w-9" />,
                color: "#172E46",
                title: "Профессиональные роли",
                desc: "Развивайтесь как экскурсовод, маркетолог, дизайнер или туроператор. Каждая роль уникальна.",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="flex flex-col items-center text-center space-y-4 group"
              >
                <div
                  className="h-20 w-20 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${f.color}cc, ${f.color})` }}
                >
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #172E46 0%, #033F7E 100%)" }}>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="h-5 w-5 text-accent" />
              <span className="text-white/60 text-sm uppercase tracking-widest">Начните прямо сейчас</span>
              <Star className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Готовы к экспедиции?
            </h2>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white rounded-full px-10 h-13" asChild>
              <Link href="/register">Зарегистрироваться бесплатно <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
