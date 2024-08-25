"use client";

import axios from "axios";
import { useState } from "react";
import NavBar from "~/components/NavBar";
import PlayerCard from "~/components/PlayerCard";
import { ScoreboardComponent } from "~/components/ScoreCard";
import { type MatchRes } from "~/lib/useFetchMatchList";
import {
  type PlayerProfileRes,
  type PlayerProfile,
} from "~/lib/usePlayerProfileCheck";
import { LoadingPickle } from "~/components/LoadingPickle";
import { useQuery } from "@tanstack/react-query";

type PlayerPageType = {
  playerProfile: PlayerProfile;
  matches: MatchRes[];
};

export default function PlayerPage({
  params,
}: {
  params: { playerId: string };
}) {
  const { playerId } = params;
  const [playerScreenName, setPlayerScreenName] = useState<string>("");

  const {
    data: playerData,
    error: playerError,
    isLoading: playerLoading,
    refetch: refetchPlayerData,
  } = useQuery({
    queryKey: ["playerData", playerId],
    queryFn: async () => {
      const response = await axios.get<PlayerPageType>(
        `/api/players/${playerId}`,
      );
      const playerScreeName =
        response.data?.playerProfile?.playerData?.screenName;
      setPlayerScreenName(playerScreeName!);
      return response.data;
    },
  });

  const {
    data: playerStats,
    error: statsError,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ["playerStats", playerId],
    queryFn: async () => {
      const response = await axios.get<{ wins: number; losses: number }>(
        `/api/players/${playerId}/stats`,
      );
      return response.data;
    },
  });

  const isLoading = playerLoading || statsLoading;
  const error = playerError ?? statsError;

  if (isLoading) {
    return <LoadingPickle />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!playerData?.playerProfile ?? !playerData.matches) {
    return <div>Player not found</div>;
  }

  const handleVerificationComplete = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    void refetchPlayerData();
  };

  const playerMatches = playerData.matches;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-green-900 text-white">
      <NavBar />
      <div className="mx-4 md:mx-16">
        <PlayerCard
          {...playerData.playerProfile}
          wins={playerStats?.wins}
          losses={playerStats?.losses}
        />
        <div className="mt-4">
          <h2 className="mb-2 text-2xl font-bold">Match History</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {playerMatches.map((match) => (
              <ScoreboardComponent
                key={match.id}
                match={match}
                loggedInUser={playerScreenName}
                onVerificationComplete={handleVerificationComplete}
              />
            )) ?? null}
          </div>
        </div>
      </div>
    </main>
  );
}
