import { api } from "@/lib/hono/rpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestUpgradeSubscriptionType = InferRequestType<
  typeof api.subscription.upgrade.$post
>["json"];

type ResponseUpgradeSubscriptionType = InferResponseType<
  typeof api.subscription.upgrade.$post
>;

export const useUpgradeSubscription = () => {
  return useMutation<
    ResponseUpgradeSubscriptionType,
    Error,
    RequestUpgradeSubscriptionType
  >({
    mutationFn: async (json) => {
      const res = await api.subscription.upgrade.$post({ json });

      return res.json();
    },
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to upgrade subscription");
    },
  });
};

export const useCheckGenerations = () => {
  return useQuery({
    queryKey: ["generations"],
    queryFn: async () => {
      const res = await api.subscription.generations.$get();
      if (!res.ok) throw new Error("Failed to fetch generations");
      const { data } = await res.json();

      return data;
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};
