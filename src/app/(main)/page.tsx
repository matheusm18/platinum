import { getSession } from "@/lib/session";
import { Trophy, BookOpen, Users } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { FeatureCard } from "@/components/home/feature-card";

const features = [
  {
    icon: Trophy,
    title: "Avalia jogos",
    description:
      "Dá uma nota de 0 a 10 a cada jogo que terminaste. O teu gosto, a tua escala.",
  },
  {
    icon: BookOpen,
    title: "Mantém um diário",
    description:
      "Regista quando jogaste e o que achaste. O teu histórico pessoal, sempre acessível.",
  },
  {
    icon: Users,
    title: "Segue jogadores",
    description:
      "Descobre o que outros estão a jogar e compara opiniões com quem percebe.",
  },
];

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-bg">
      <Hero session={session} />

      <section className="max-w-5xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} description={feature.description} />
          ))}
        </div>
      </section>
    </div>
  );
}