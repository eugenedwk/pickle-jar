import { Card, CardContent } from "~/components/ui/card";
import ProfilePickle from "~/components/PickleProfile";

interface PlayerCardProps {
  screenName?: string;
  realName?: string;
  skillLevel?: string;
  paddleBrand?: string;
  paddlePreference?: string;
  plays?: string;
  homeCourt?: string;
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
  imageUrl,
  wins,
  losses,
}: PlayerCardProps) {
  return (
    <div className="grid w-full max-w-md grid-cols-1 md:grid-cols-2">
      <div className="relative h-full rounded-t-lg bg-muted md:rounded-l-lg md:rounded-t-none">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Player Profile"
            width={128}
            height={128}
            className="absolute -bottom-[64px] left-1/2 -translate-x-1/2 rounded-full border-4 border-background md:left-[32px] md:-translate-x-0"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-2">
            <ProfilePickle username={screenName ?? realName} />
          </div>
        )}
      </div>
      <Card className="md:rounded-l-none">
        <CardContent className="space-y-4 p-4">
          <div className="grid gap-1">
            {realName ?? (
              <div className="text-xl font-extrabold">{realName}</div>
            )}
            <div className="text-sm text-muted-foreground">@{screenName}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {skillLevel && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">
                  Skill Level
                </div>
                <div>{skillLevel}</div>
              </div>
            )}
            {paddleBrand && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">
                  Paddle Brand
                </div>
                <div>{paddleBrand}</div>
              </div>
            )}
            {paddlePreference && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">
                  Paddle Preference
                </div>
                <div>{paddlePreference}</div>
              </div>
            )}
            {plays && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">
                  Plays
                </div>
                <div>{plays}</div>
              </div>
            )}
          </div>
          {homeCourt && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">
                Home Court
              </div>
              <div>{homeCourt}</div>
            </div>
          )}
          {wins !== undefined && losses !== undefined && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">
                Record
              </div>
              <div>
                {wins}W - {losses}L
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
