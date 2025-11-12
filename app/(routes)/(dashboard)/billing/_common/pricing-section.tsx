"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { PaidPlanEnumType, PLANS } from "@/lib/constant";
import PlanCard, { PlanFeature } from "./plan-card";
import {
  useCheckGenerations,
  useUpgradeSubscription,
} from "@/features/use-subscription";

const PricingSection = () => {
  const {
    isPending,
    isError,
    error,
    data: subscription,
  } = useCheckGenerations();

  const { mutate, isPending: isUpgrading } = useUpgradeSubscription();

  const [upgradingPlan, setUpgradingPlan] = useState<PaidPlanEnumType | null>(
    null
  );

  const handleUpgrade = (plan: PaidPlanEnumType) => {
    if (isUpgrading) return;

    setUpgradingPlan(plan);

    mutate(
      {
        plan,
        callbackUrl: `${window.location.origin}/billing`,
      },
      {
        onSettled: () => {
          setUpgradingPlan(null);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <h2 className="flex items-center gap-1 font-medium text-lg lg:text-xl">
          All plans
          <Info className="size-4 text-muted-foreground" />
        </h2>
      </div>
      <div className="border rounded-lg">
        <div className="grid grid-cols-4 gap-2 border-b pb-2">
          <div className="p-6"></div>
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              subscription={subscription}
              loading={isPending}
              error={isError ? error.message ?? "Failed to load" : null}
              isUpgrading={upgradingPlan === plan.name && isUpgrading}
              onUpgrade={handleUpgrade}
            />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2 pb-5 bg-gray-50/80 dark:bg-secondary/40">
          <h4 className="p-6 font-medium">Highlights</h4>
          {PLANS.map((plan) => (
            <PlanFeature key={plan.id} features={plan.features} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
