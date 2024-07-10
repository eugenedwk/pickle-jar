"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import NavBar from "~/components/NavBar";
import PlayerCard from "~/components/PlayerCard";
import { ScoreboardComponent } from "~/components/ScoreCard";
import { type MatchRes } from "~/lib/useFetchMatchList";
import { type PlayerProfile } from "~/lib/usePlayerProfileCheck";
import { useQuery } from "@tanstack/react-query";

type PlayerPageType = {
  playerProfile: PlayerProfile;
  matches: MatchRes[];
};

export default function PlayerPage({}) {
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerProfile = async () => {
      try {
        const response = await axios.get<PlayerProfile>("/api/players/check");
        if (response.data.hasProfile && response.data.playerData) {
          setPlayerId(response.data.playerData.id);
        }
      } catch (error) {
        console.error("Error fetching player profile:", error);
      }
    };

    void fetchPlayerProfile();
  }, []);

  const {
    data: playerData,
    error: playerError,
    isLoading: playerLoading,
    refetch,
  } = useQuery({
    queryKey: ["playerData", playerId],
    queryFn: async () => {
      const response = await axios.get<PlayerPageType>(
        `/api/players/${playerId}`,
      );
      return response.data;
    },
    enabled: !!playerId,
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
    enabled: !!playerId,
  });

  const isLoading = playerLoading || statsLoading;
  const error = playerError ?? statsError;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  if (isLoading) {
    return <div>Player not found</div>;
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-green-900 text-white">
      <NavBar />
      <div className="mx-4 my-20 md:mx-16">
        <PlayerCard
          {...playerData?.playerProfile}
          wins={playerStats?.wins}
          losses={playerStats?.losses}
        />
        <div className="mt-4">
          <h2 className="mb-2 text-2xl font-bold">Match History</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {playerData?.matches.map((match) => (
              <ScoreboardComponent
                key={match.id}
                match={match}
                loggedInUser={playerData?.playerProfile?.playerData?.realName}
                onVerificationComplete={refetch}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
