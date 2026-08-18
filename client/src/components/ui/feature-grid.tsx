import {
  ArrowUpRight,
  BarChart3,
  Cloud,
  Layers3,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Button } from "components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { cn } from "lib/utils";

interface FeatureItem {
  title: string;
  description: string;
  eyebrow: string;
  icon: LucideIcon;
}

const features: FeatureItem[] = [
  {
    eyebrow: "Workflow",
    title: "Built for product teams",
    description:
      "Coordinate launches, reviews, and approvals in one place with less context switching and more momentum.",
    icon: Layers3,
  },
  {
    eyebrow: "Insights",
    title: "Signal over noise",
    description:
      "Track the metrics that matter with live dashboards, clear trendlines, and alerts you can act on quickly.",
    icon: BarChart3,
  },
  {
    eyebrow: "Automation",
    title: "Turn manual work into flow",
    description:
      "Reduce repetitive tasks with workflow automation, smarter routing, and reusable templates for every sprint.",
    icon: Zap,
  },
  {
    eyebrow: "Security",
    title: "Protect every release",
    description:
      "Ship with confidence through role controls, audit history, and enterprise-level safeguards for your data.",
    icon: ShieldCheck,
  },
  {
    eyebrow: "Collaboration",
    title: "Comment without friction",
    description:
      "Keep product, design, and engineering aligned with contextual feedback attached to the work that matters.",
    icon: MessageSquareText,
  },
  {
    eyebrow: "Scale",
    title: "Ready for growth",
    description:
      "From early prototypes to global rollouts, scale reliably while keeping your team focused on customer value.",
    icon: Cloud,
  },
];

export const FeatureGrid = () => {
  return (
    <section className="w-full bg-background px-4 py-16 text-foreground md:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
              <Sparkles className="size-3.5" />
              Product overview
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              Everything your launch pipeline needs.
            </h2>
          </div>

          <Button variant="secondary" className="w-fit rounded-full px-5">
            Explore platform
            <ArrowUpRight className="ml-2 size-4" />
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map(({ title, description, eyebrow, icon: Icon }) => (
            <Card
              key={title}
              className="group flex h-full flex-col border border-border bg-card text-card-foreground transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
            >
              <CardHeader className="space-y-5 pb-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {eyebrow}
                  </span>
                </div>

                <CardTitle className="text-xl font-semibold text-foreground">
                  {title}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col justify-between pt-0">
                <CardDescription className="text-sm leading-6 text-muted-foreground">
                  {description}
                </CardDescription>

                <div className="mt-6 h-px w-full bg-border" />
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Ready to use</span>
                  <ArrowUpRight className={cn("size-4 text-primary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5")} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
