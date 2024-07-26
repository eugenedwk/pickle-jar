"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import NavBar from "~/components/NavBar";

interface Player {
  id: string;
  screenName: string;
  wins: number;
  losses: number;
  rank: number;
}

export default function RanksPage() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.get<Player[]>("/api/ranks");
        if (response.status !== 200)
          throw new Error("Failed to fetch rankings");
        const data = response.data;
        setPlayers(data);
      } catch (error) {
        console.error("Error fetching rankings:", error);
      }
    };

    void fetchRankings();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-green-900 text-white">
      <NavBar />
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Ranks
        </h1>
        <div className="w-full max-w-4xl">
          {players.map((player, index) => (
            <div
              key={player.id}
              className={`mb-4 flex items-center justify-between rounded-lg p-4 shadow-md ${
                index === 0
                  ? "ml-0 border-8 border-yellow-400 bg-green-800 p-6"
                  : index === 1
                    ? "ml-4 border-4 border-gray-300 bg-green-800 p-5"
                    : index === 2
                      ? "ml-8 border-2 border-orange-600 bg-green-800"
                      : "ml-12 bg-green-800"
              }`}
            >
              <div className="flex items-center">
                <span
                  className={`mr-4 font-bold ${
                    index === 0
                      ? "text-4xl"
                      : index === 1
                        ? "text-3xl"
                        : "text-2xl"
                  }`}
                >
                  {player.rank}
                </span>
                <span
                  className={`${
                    index === 0
                      ? "text-2xl"
                      : index === 1
                        ? "text-xl"
                        : "text-lg"
                  }`}
                >
                  {player.screenName}
                </span>
              </div>
              <div className="flex items-center">
                <span className="mr-4">
                  Wins: <span className="font-semibold">{player.wins}</span>
                </span>
                <span>
                  Losses: <span className="font-semibold">{player.losses}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
