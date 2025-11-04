import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { api } from "@/lib/hono/rpc";

export const useChatById = (id: string) => {
  return useQuery({
    queryKey: ["chat", id],
    queryFn: async () => {
      const res = await api.chat[":id"].$get({ param: { id } });
      if (!res.ok) throw new Error("Failed to fetch chat");
      const { data } = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data as any;
    },
    enabled: !!id,
  });
};

export const useChats = () => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await api.chat.$get();
      if (!res.ok) throw new Error("Failed to fetch chats");
      const { data } = await res.json();
      return data;
    },
  });
};

// 流结束后一次性写入最终 parts 的 finalize 接口
type RequestFinalizeMessageType = InferRequestType<
  (typeof api.chat.message)[":messageId"]["finalize"]["$post"]
>["json"];

type ResponseFinalizeMessageType = InferResponseType<
  (typeof api.chat.message)[":messageId"]["finalize"]["$post"]
>;

export const useFinalizeMessageParts = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseFinalizeMessageType,
    Error,
    { param: { messageId: string }; json: RequestFinalizeMessageType }
  >({
    mutationFn: async ({ param, json }) => {
      console.log("~~~ begin to send finalize request");
      const res = await api.chat.message[":messageId"].finalize.$post({
        param: { messageId: param.messageId },
        json,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Finalize failed: ${res.status} ${text}`);
      }
      return await res.json();
    },
    onSuccess: async () => {
      // 可按需刷新当前 chat
      // await queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });
};
