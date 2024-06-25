import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type PlayerFormData } from "~/components/UserRegistration";

async function createPlayerProfile(data: PlayerFormData) {
  const response = await fetch("/api/players", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create player profile");
  }
  return response.json();
}

export function useCreatePlayerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PlayerFormData) => createPlayerProfile(data),
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
    },
  });
}
