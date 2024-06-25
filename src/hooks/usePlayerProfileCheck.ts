import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type PlayerProfile = {
  hasProfile: boolean;
  playerData?: Record<string, unknown>;
};

const fetchPlayerProfile = async (): Promise<PlayerProfile> => {
  const { data } = await axios.get<PlayerProfile>("/api/players/check");
  console.log(data);
  return data;
};

export function usePlayerProfileCheck() {
  return useQuery({
    queryKey: ["playerProfile"],
    queryFn: fetchPlayerProfile,
  });
}
