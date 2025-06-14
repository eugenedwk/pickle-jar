"use client";

import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { Dialog, DialogContent } from "~/components/ui/dialog";

import PlayerCard from "~/components/PlayerCard";
import { usePlayerProfileCheck } from "~/lib/hooks";
import { useFetchMatchList, type MatchRes } from "~/lib/useFetchMatchList";
import PickleballMatchForm from "../PickleballMatchForm";
import { ScoreboardComponent } from "../ScoreCard";
import { OnboardingForm } from "../UserRegistration";
import { LoadingPickle } from "../LoadingPickle";

const Dashboard: React.FC = () => {
  const [forceUpdate, setForceUpdate] = useState(0);
  const [showOnboardingDialog, setShowOnboardingDialog] = useState(false);

  const { data: session, status } = useSession();
  const sessionId = session?.user.id;
  console.log("sessionId", sessionId);
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
    setShowOnboardingDialog(false);
  }, []);

  if (status === "loading" || isLoading) {
    return <LoadingPickle />;
  }

  if (status === "unauthenticated") {
    return <p>Please sign in.</p>;
  }

  if (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return <p>Error checking player profile: {error.message}</p>;
  }
  console.log(playerProfileData);
  const showOnboarding = !playerProfileData?.hasProfile;
  const realNamePLZ = playerProfileData?.playerData?.realName ?? "";
  const playerId = playerProfileData?.playerData?.id;

  if (showOnboarding && !showOnboardingDialog) {
    setShowOnboardingDialog(true);
  }

  return (
    <div>
      <Dialog
        open={showOnboardingDialog}
        onOpenChange={setShowOnboardingDialog}
      >
        <DialogContent className="top-[45%] mt-7 md:mt-10">
          <OnboardingForm onComplete={handleOnboardingComplete} />
        </DialogContent>
      </Dialog>
      {!showOnboarding && (
        <>
          <div className="w-full md:my-8">
            <PlayerCard {...playerProfileData.playerData} />
            <div className="w-full bg-white"></div>
          </div>
          <div className="my-8 flex w-full flex-col md:flex-row">
            <div className="mb-8 w-full md:m-8">
              <PickleballMatchForm />
            </div>
            <div className="mb-4 w-full md:m-8 md:w-1/2">
              <h2 className="text-left text-4xl font-bold text-white">
                Recent Matches
              </h2>
              {matchList
                ?.sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
                )
                .slice(0, 4)
                .map((match: MatchRes, index: number) => (
                  <ScoreboardComponent
                    key={match.id || index}
                    match={match}
                    loggedInUser={playerId}
                    onVerificationComplete={() => refetch()}
                  />
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
