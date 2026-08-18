import { useMemo, useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";

import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { cn } from "lib/utils";

type Billing = "monthly" | "yearly";

interface Plan {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  cta: string;
  badge?: string;
  featured?: boolean;
  popular?: boolean;
  features: string[];
}

const plans: Plan[] = [
  {
    name: "Starter",
    description: "For individuals publishing their first ideas.",
    monthlyPrice: 12,
    yearlyPrice: 9,
    cta: "Try free",
    features: [
      "Unlimited drafts",
      "2 team spaces",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    name: "Growth",
    description: "For small teams shipping faster every week.",
    monthlyPrice: 29,
    yearlyPrice: 22,
    cta: "Start plan",
    badge: "Popular",
    featured: true,
    popular: true,
    features: [
      "Everything in Starter",
      "Unlimited projects",
      "Shared design reviews",
      "Priority support",
      "Custom permissions",
    ],
  },
  {
    name: "Scale",
    description: "For companies coordinating product across many teams.",
    monthlyPrice: 79,
    yearlyPrice: 59,
    cta: "Talk to sales",
    features: [
      "Everything in Growth",
      "Advanced security",
      "SSO and audit logs",
      "Dedicated onboarding",
      "Slack concierge",
    ],
  },
];

export const PricingTable = () => {
  const [billing, setBilling] = useState<Billing>("monthly");

  const billingLabel = billing === "monthly" ? "Monthly" : "Yearly";
  const billedPlans = useMemo(
    () =>
      plans.map((plan) => ({
        ...plan,
        price: billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice,
      })),
    [billing]
  );

  return (
    <section className="w-full bg-background px-4 py-16 text-foreground md:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
              <Sparkles className="size-3.5" />
              Simple pricing
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              Choose a plan that grows with your workflow.
            </h2>
          </div>

          <div className="inline-flex items-center rounded-full border border-border bg-card p-1 shadow-sm">
            {(["monthly", "yearly"] as Billing[]).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={billing === option}
                onClick={() => setBilling(option)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  billing === option
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option === "monthly" ? "Monthly" : "Yearly"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {billedPlans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative overflow-hidden border border-border bg-card text-card-foreground shadow-sm transition-all duration-200",
                plan.featured && "border-primary/60 bg-primary/5 ring-1 ring-primary/25"
              )}
            >
              {plan.badge ? (
                <div className="absolute right-5 top-5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary-foreground">
                  {plan.badge}
                </div>
              ) : null}

              <CardHeader className="space-y-4 pb-4">
                <div>
                  <CardTitle className="text-2xl font-semibold text-foreground">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                </div>

                <div className="flex items-end gap-2">
                  <span className="text-4xl font-semibold tracking-tight text-foreground">
                    ${plan.price}
                  </span>
                  <span className="pb-1 text-sm text-muted-foreground">
                    /{billing === "monthly" ? "mo" : "mo billed yearly"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <Button
                  type="button"
                  variant={plan.featured ? "default" : "secondary"}
                  className={cn(
                    "w-full justify-center rounded-xl",
                    !plan.featured && "bg-secondary text-foreground hover:bg-secondary/90"
                  )}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 size-4" />
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm text-foreground/90">
                      <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="size-3.5" />
                      </span>
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {billingLabel} billing available. No setup fees. Cancel anytime.
        </p>
      </div>
    </section>
  );
};

export default PricingTable;
