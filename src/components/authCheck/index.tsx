"use client";

import { useSession } from "next-auth/react";
import { OnboardingForm } from "../onboardingForm";
import { PickleballMatchForm } from "../scoreReporter";
import { ScoreboardComponent } from "../scoreboard";
import { usePlayerProfileCheck } from "~/hooks/usePlayerProfileCheck";

const AuthCheck: React.FC = () => {
  const { data: session, status } = useSession();
  const { data: playerProfile, isLoading, error } = usePlayerProfileCheck();

  if (status === "loading" || isLoading) {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied. Please sign in.</p>;
  }

  if (error) {
    return <p>Error checking player profile: {error.message}</p>;
  }

  const userName = session?.user?.name ?? "You";
  const mockData = {
    player: { name: userName },
    partner: { name: "Partner 1" },
    opponent1: { name: "Opponent 1" },
    opponent2: { name: "Opponent 2" },
    gameType: "Mixed Doubles",
    gameLocation: "Court 1",
    rounds: [
      { homeTeamScore: 11, awayTeamScore: 5 },
      { homeTeamScore: 11, awayTeamScore: 3 },
      { homeTeamScore: 0, awayTeamScore: 0 },
    ],
  };

  const showOnboarding = !playerProfile?.hasProfile;

  return (
    <div>
      <h1>Hello, {session?.user?.name ?? "User"}!</h1>
      <div className="w-full">{showOnboarding ? <OnboardingForm /> : null}</div>
      <div className="my-8 flex w-full flex-col md:flex-row">
        <div className="w-full md:m-8 md:w-1/2">
          <ScoreboardComponent {...mockData} />
        </div>
        <div className="w-full md:m-8 md:w-1/2">
          <PickleballMatchForm />
        </div>
      </div>
    </div>
  );
};

export default AuthCheck;
