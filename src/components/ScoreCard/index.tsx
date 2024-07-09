import { Button } from "~/components/ui/button";
import { useState } from "react";
import { VerifyMatchPrompt } from "~/components/VerifyMatchPrompt";
import { type MatchRes } from "~/lib/useFetchMatchList";
import Link from "next/link";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/hFjExG7Zgwy
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
interface ScoreboardProps {
  match: MatchRes;
  loggedInUser?: string;
  onVerificationComplete: () => void;
}

/**
 * ScoreboardComponent displays the details and scores of a pickleball match.
 * It also handles match verification functionality.
 */
export const ScoreboardComponent = ({
  match,
  loggedInUser,
  onVerificationComplete,
}: ScoreboardProps) => {
  const [isVerifying, setIsVerifying] = useState(false);

  /**
   * Initiates the match verification process.
   */
  const handleVerifyClick = () => {
    setIsVerifying(true);
  };

  /**
   * Completes the verification process and triggers a callback.
   */
  const handleVerificationComplete = () => {
    setIsVerifying(false);
    onVerificationComplete();
  };

  const { participants, gameType, location, date, scores, outcome, verified } =
    match;

  // Separate participants into home and away teams
  const homeTeam = participants.filter((p) => p.team === "home");
  const awayTeam = participants.filter((p) => p.team === "away");

  // Extract player names or use default names if not available
  const player = {
    name: homeTeam[0]?.playerName ?? "Player 1",
    playerId: homeTeam[0]?.playerId ?? "",
  };
  const partner = {
    name: homeTeam[1]?.playerName ?? "Player 2",
    playerId: homeTeam[1]?.playerId ?? "",
  };
  const opponent1 = {
    name: awayTeam[0]?.playerName ?? "Opponent 1",
    playerId: awayTeam[0]?.playerId ?? "",
  };
  const opponent2 = {
    name: awayTeam[1]?.playerName ?? "Opponent 2",
    playerId: awayTeam[1]?.playerId ?? "",
  };
  return (
    <div className="my-8 w-full rounded-md border bg-white shadow-md">
      <div className="flex justify-between border-b bg-gray-100 p-4">
        <div className="flex flex-col items-start">
          <h2 className="text-lg font-bold text-gray-900">{gameType}</h2>
          {verified ? (
            <span className="mt-1 rounded-full bg-green-500 px-2 py-1 text-xs text-white">
              Verified
            </span>
          ) : opponent1.name === loggedInUser ||
            opponent2.name === loggedInUser ? (
            <Button
              onClick={handleVerifyClick}
              className="mt-1 rounded-md bg-blue-500 text-xs text-white hover:bg-blue-600"
            >
              Verify Match
            </Button>
          ) : (
            <span className="mt-1 rounded-full bg-gray-500 px-2 py-1 text-xs text-white">
              Awaiting Verification
            </span>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-right text-sm text-gray-600">
            {location.name}
          </span>
          <span className="text-right text-sm text-gray-600">
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
      <div className="space-y-4 p-4">
        <div className="flex justify-between">
          <div>
            <div className="font-medium text-gray-900">
              <Link href={`/players/${player.playerId}`}>{player.name}</Link> /{" "}
              <Link href={`/players/${partner.playerId}`}>{partner.name}</Link>
              {outcome === "home" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="ml-2 inline-block h-6 w-6 text-green-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            {scores.map((round, index) => (
              <div
                key={index}
                className="flex h-8 w-8 items-center justify-center rounded bg-gray-100"
              >
                <span className="font-bold text-gray-900">{round.home}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <div className="font-medium text-gray-900">
              <Link href={`/players/${opponent1.playerId}`}>
                {opponent1.name}
              </Link>{" "}
              /{" "}
              <Link href={`/players/${opponent2.playerId}`}>
                {opponent2.name}
              </Link>
              {outcome === "away" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="ml-2 inline-block h-6 w-6 text-green-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            {scores.map((round, index) => (
              <div
                key={index}
                className="flex h-8 w-8 items-center justify-center rounded bg-gray-100"
              >
                <span className="font-bold text-gray-900">{round.away}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isVerifying && (
        <VerifyMatchPrompt
          match={match}
          onVerify={handleVerificationComplete}
        />
      )}
    </div>
  );
};
