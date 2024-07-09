"use client";

import { useSession } from "next-auth/react";

import PlayerCard from "~/components/PlayerCard";
import { usePlayerProfileCheck } from "~/lib/hooks";
import { useFetchMatchList, type MatchRes } from "~/lib/useFetchMatchList";
import PickleballMatchForm from "../PickleballMatchForm";
import { ScoreboardComponent } from "../ScoreCard";
import { OnboardingForm } from "../UserRegistration";
import { useCallback, useState } from "react";

const Dashboard: React.FC = () => {
  const [forceUpdate, setForceUpdate] = useState(0);

  const { data: session, status } = useSession();
  const sessionId = session?.user.id;
  const {
    data: playerProfileData,
    isLoading,
    error,
  } = usePlayerProfileCheck(forceUpdate);
  //currently pulling all matches.
  const {
    data: matchList,
    isLoading: isLoadingMatch,
    refetch,
  } = useFetchMatchList();
  const handleOnboardingComplete = useCallback(() => {
    setForceUpdate((prev) => prev + 1);
  }, []);

  if (status === "loading" || isLoading) {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Please sign in.</p>;
  }

  if (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return <p>Error checking player profile: {error.message}</p>;
  }

  const showOnboarding = !playerProfileData?.hasProfile;
  const realNamePLZ = playerProfileData?.playerData?.realName ?? "";
  return (
    <div>
      <div className="w-full md:m-8">
        {showOnboarding ? (
          <OnboardingForm onComplete={handleOnboardingComplete} />
        ) : (
          <PlayerCard {...playerProfileData.playerData} />
        )}
        <div className="w-full bg-white"></div>
      </div>
      <div className="my-8 flex w-full flex-col md:flex-row">
        <div className="mb-8 w-full md:m-8">
          <PickleballMatchForm />
        </div>
        <div className="mb-4 w-full md:m-8 md:w-1/2">
          <h2 className="text-left text-4xl font-bold text-white">
            Recent Matches{" "}
          </h2>
          {matchList?.map((match: MatchRes, index: number) => (
            <ScoreboardComponent
              key={index}
              match={match}
              loggedInUser={realNamePLZ}
              onVerificationComplete={() => refetch()}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
