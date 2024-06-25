"use client";

import { useQuery } from "@tanstack/react-query";
import { type PlayerProfileRes } from "./usePlayerProfileCheck";
import axios from "axios";

type PlayerProfileCheckType = {
  playerData: PlayerProfileRes;
  hasProfile: boolean;
};

export const usePlayerProfileCheck = (forceUpdate: number) => {
  return useQuery<PlayerProfileCheckType, Error>({
    queryKey: ["playerProfileCheck", forceUpdate],
    queryFn: async () =>
      await axios
        .get<PlayerProfileCheckType>(`/api/players/check/`)
        .then((res) => res.data),
    staleTime: Infinity,
  });
};
