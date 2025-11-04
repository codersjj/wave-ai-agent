import { useQuery } from "@tanstack/react-query";
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
