"use client";

import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import PlayerCard from "~/components/PlayerCard";
import { ScoreboardComponent } from "~/components/ScoreCard";
import { type MatchRes } from "~/lib/useFetchMatchList";
import { type PlayerProfile } from "~/lib/usePlayerProfileCheck";

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
  const [matches, setMatches] = useState<MatchRes[]>([]);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>();
  const [playerStats, setPlayerStats] = useState<{
    wins: number;
    losses: number;
  }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [profileResponse, statsResponse] = await Promise.all([
        axios.get<PlayerPageType>(`/api/players/${playerId}`),
        axios.get<{ wins: number; losses: number }>(
          `/api/players/${playerId}/stats`,
        ),
      ]);

      setPlayerProfile(profileResponse.data.playerProfile);
      setMatches(profileResponse.data.matches);
      setPlayerStats(statsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load player data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleVerificationComplete = () => {
    void fetchData(); // Refetch all data
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!playerProfile) {
    return <div>Player not found</div>;
  }
  return (
    <div className="mx-4 md:mx-16">
      <PlayerCard
        {...playerProfile}
        wins={playerStats?.wins}
        losses={playerStats?.losses}
      />
      <div className="mt-4">
        <h2 className="mb-2 text-2xl font-bold">Match History</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {matches.map((match) => (
            <ScoreboardComponent
              key={match.id}
              match={match}
              loggedInUser={playerProfile?.playerData?.realName}
              onVerificationComplete={handleVerificationComplete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
