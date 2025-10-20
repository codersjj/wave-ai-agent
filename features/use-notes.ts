import { api } from "@/lib/hono/rpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestCreateNoteType = InferRequestType<
  typeof api.note.create.$post
>["json"];

type ResponseCreateNoteType = InferResponseType<typeof api.note.create.$post>;

type RequestUpdateNoteType = InferRequestType<
  (typeof api.note.update)[":id"]["$patch"]
>["json"];

type ResponseUpdateNoteType = InferResponseType<
  (typeof api.note.update)[":id"]["$patch"]
>;

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseCreateNoteType, Error, RequestCreateNoteType>({
    mutationFn: async (json) => {
      const res = await api.note.create.$post({ json });

      return await res.json();
    },
    onSuccess: async () => {
      toast.success("Note created successfully");
      await queryClient.invalidateQueries({
        queryKey: ["notes"],
        refetchType: "all",
      });
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to create note");
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseUpdateNoteType,
    Error,
    { param: { id: string }; json: RequestUpdateNoteType }
  >({
    mutationFn: async ({ param, json }) => {
      const res = await api.note.update[":id"].$patch({
        param: { id: param.id },
        json,
      });

      return await res.json();
    },
    onSuccess: async () => {
      toast.success("Note updated successfully");
      await queryClient.invalidateQueries({
        queryKey: ["notes"],
        refetchType: "all",
      });
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to update note");
    },
  });
};

export const useNotes = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ["notes", page, limit],
    queryFn: async () => {
      const res = await api.note.all.$get({ query: { page, limit } });
      if (!res.ok) {
        throw new Error("Failed to get notes");
      }

      const data = await res.json();

      return data;
    },
  });
};

export const useNote = (id: string) => {
  return useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      const res = await api.note[":id"].$get({ param: { id } });
      if (!res.ok) {
        throw new Error("Failed to get note");
      }

      const data = await res.json();

      return data;
    },
    enabled: Boolean(id),
  });
};
