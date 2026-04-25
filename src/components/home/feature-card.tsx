import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-6 space-y-3">
      <div className="w-9 h-9 rounded-lg bg-purple/10 border border-purple/20 flex items-center justify-center">
        <Icon size={18} className="text-purple-light" />
      </div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-silver-dim text-sm leading-relaxed">{description}</p>
    </div>
  );
}