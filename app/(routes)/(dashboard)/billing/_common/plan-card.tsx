import React, { useEffect, useState } from "react";
import {
  PaidPlanEnumType,
  PLAN_ENUM,
  PlanEnumType,
  PLANS,
  UPGRADEABLE_PLANS,
} from "@/lib/constant";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Loader } from "lucide-react";

interface PlanCardProps {
  plan: (typeof PLANS)[number];
  subscription?: {
    plan: PlanEnumType;
    isAllowed: boolean;
    hasPaidSubscription: boolean;
    totalGenerationLimit: number | string;
    usedGeneration: number;
    remainingGeneration: number | string;
  };
  loading: boolean;
  error: string | null;
  isUpgrading: boolean;
  onUpgrade: (plan: PaidPlanEnumType) => void;
}

const PlanCard = React.memo(
  ({
    plan,
    subscription,
    loading,
    error,
    isUpgrading,
    onUpgrade,
  }: PlanCardProps) => {
    const isPopular = plan.name === PLAN_ENUM.PREMIUM;
    const isCurrent = plan.name === subscription?.plan;

    const action = subscription?.hasPaidSubscription
      ? "Switch plan"
      : "Upgrade";

    const totalGenerationLimit = isCurrent
      ? subscription.totalGenerationLimit
      : null;
    const usedGeneration = isCurrent ? subscription.usedGeneration : null;
    const remainingGeneration = isCurrent
      ? subscription.remainingGeneration
      : null;
    const usedPercent =
      usedGeneration && typeof totalGenerationLimit === "number"
        ? Math.min((usedGeneration / totalGenerationLimit) * 100, 100)
        : 0;

    // 添加动画控制
    const [displayUsedPercent, setDisplayUsedPercent] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => {
        setDisplayUsedPercent(usedPercent);
      }, 100);

      return () => clearTimeout(timer);
    }, [usedPercent]);

    return (
      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-center gap-1">
          <h3 className="capitalize font-medium text-lg lg:text-xl">
            {plan.name}
          </h3>
          {isCurrent && (
            <Badge className="text-xs text-gray-700 bg-gray-200">Current</Badge>
          )}
          {!isCurrent && isPopular && (
            <Badge className="text-xs text-primary bg-primary/10">
              Popular
            </Badge>
          )}
        </div>
        <p className="text-base font-normal">
          ${plan.price}
          <span className="ml-1 text-xs sm:text-sm text-muted-foreground">
            per month billed
          </span>
        </p>
        {loading && (
          <>
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-full h-3" />
          </>
        )}
        {error && (
          <p className="text-xs sm:text-sm text-destructive">{error}</p>
        )}
        {isCurrent && (
          <div className="text-sm text-muted-foreground">
            {typeof totalGenerationLimit === "string" ? (
              "Unlimited generations"
            ) : (
              <div className="space-y-1">
                <p className="text-xs sm:text-sm">
                  {remainingGeneration} / {totalGenerationLimit} generations
                  left
                </p>
                <div className="rounded-full w-full h-2 bg-gray-300">
                  <div
                    className="rounded-full h-full bg-orange-500 transition-all duration-300"
                    style={{
                      width: `${displayUsedPercent}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}
        {isCurrent && plan.name !== PLAN_ENUM.FREE ? (
          <Button variant="outline" className="cursor-pointer">
            Manage
          </Button>
        ) : UPGRADEABLE_PLANS.includes(plan.name as PaidPlanEnumType) ? (
          <Button
            variant={isPopular ? "default" : "outline"}
            className={cn(
              "cursor-pointer",
              isPopular &&
                "text-white dark:text-black bg-primary hover:opacity-80"
            )}
            disabled={isUpgrading}
            onClick={() => onUpgrade(plan.name as PaidPlanEnumType)}
          >
            {isUpgrading ? <Loader className="size-4 animate-spin" /> : action}
          </Button>
        ) : null}
      </div>
    );
  }
);

PlanCard.displayName = "PlanCard";

export default PlanCard;

export const PlanFeature = React.memo(
  ({ features }: { features: string[] }) => {
    return (
      <ul className="flex flex-col gap-2 p-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <Check className="shrink-0 size-4 text-muted-foreground" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    );
  }
);

PlanFeature.displayName = "PlanFeature";
