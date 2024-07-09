import React from "react";
import axios from "axios";
import { Button } from "~/components/ui/button";
import { type MatchRes } from "~/lib/useFetchMatchList";

interface VerifyMatchPromptProps {
  match: MatchRes;
  onVerify: () => void;
}

export const VerifyMatchPrompt: React.FC<VerifyMatchPromptProps> = ({
  match,
  onVerify,
}) => {
  const handleVerify = async () => {
    try {
      await axios.post("/api/matches/verify", { matchId: match.id });
      onVerify();
    } catch (error) {
      console.error("Error verifying match:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-black">
          Verify Match Results
        </h2>
        <p className="text-black">Please confirm the match results:</p>
        <div className="mt-4 space-y-2 text-black">
          <p>
            <strong>Game Type:</strong> {match.gameType}
          </p>
          <p>
            <strong>Date:</strong> {new Date(match.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Location:</strong> {match.location.name}
          </p>
          <p>
            <strong>Participants:</strong>
          </p>
          <ul className="list-disc pl-5">
            {match.participants.map((participant, index) => (
              <li key={index}>
                {participant.playerName} ({participant.team})
              </li>
            ))}
          </ul>
          <p>
            <strong>Scores:</strong>
          </p>
          <ul className="list-disc pl-5">
            {match.scores.map((score, index) => (
              <li key={index}>
                Round {score.round}: Home {score.home} - Away {score.away}
              </li>
            ))}
          </ul>
        </div>
        <Button
          onClick={handleVerify}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Verify Results
        </Button>
      </div>
    </div>
  );
};
