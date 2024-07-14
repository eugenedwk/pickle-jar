import ProfilePickle from "~/components/PickleProfile";
import { type Location } from "~/server/db/schema";

interface PlayerCardProps {
  screenName?: string;
  realName?: string;
  hideRealName?: boolean;
  skillLevel?: string;
  paddleBrand?: string;
  paddlePreference?: string;
  plays?: string;
  homeCourt?: Location;
  imageUrl?: string;
  wins?: number;
  losses?: number;
}

export default function PlayerCard({
  screenName,
  realName,
  skillLevel,
  paddleBrand,
  paddlePreference,
  plays,
  homeCourt,
  hideRealName,
  wins,
  losses,
}: PlayerCardProps) {
  return (
    <div className="grid w-full grid-cols-12">
      {/* first half */}
      <div className="relative col-span-3 h-full rounded-t-lg bg-muted md:rounded-l-lg md:rounded-t-none">
        {/* {imageUrl ? (
          <img
            src={imageUrl}
            alt="Player Profile"
            width={128}
            height={128}
            className="absolute -bottom-[64px] left-1/2 -translate-x-1/2 rounded-full border-4 border-background md:left-[32px] md:-translate-x-0"
          />
        ) : ()} */}
        <div className="absolute inset-0  flex items-center justify-center p-2">
          <ProfilePickle username={screenName ?? realName} />
        </div>
      </div>
      {/* second half */}
      <div className="col-span-9 w-full bg-white text-black">
        <div className="space-y-4 p-4 md:p-6 lg:p-8">
          <div className="grid gap-1 text-2xl font-extrabold">
            {hideRealName ? (
              <>
                <div className="text-xl font-extrabold">{realName}</div>
                <div className="text-sm text-green-700">@{screenName}</div>
              </>
            ) : (
              <div className="text-sm text-green-700">@{screenName}</div>
            )}
            <div className="text-xl font-extrabold text-green-700">
              @{screenName}
            </div>
          </div>
          <div className="flex gap-4">
            {skillLevel && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-green-700">
                  Skill Level
                </div>
                <div>{skillLevel}</div>
              </div>
            )}
            {paddleBrand && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-green-700">
                  Paddle Brand
                </div>
                <div>{paddleBrand}</div>
              </div>
            )}
            {paddlePreference && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-green-700">
                  Paddle Preference
                </div>
                <div>{paddlePreference}</div>
              </div>
            )}
            {plays && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-green-700">Plays</div>
                <div>{plays}</div>
              </div>
            )}
            {homeCourt && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-green-700">
                  Home Court
                </div>
                <div>{homeCourt.name}</div>
              </div>
            )}
          </div>
          {wins !== undefined && losses !== undefined && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-green-700">Record</div>
              <div>
                {wins}W - {losses}L
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
