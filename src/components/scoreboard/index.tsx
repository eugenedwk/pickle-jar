/**
 * v0 by Vercel.
 * @see https://v0.dev/t/hFjExG7Zgwy
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
interface Player {
  name: string;
}

interface Round {
  homeTeamScore: number;
  awayTeamScore: number;
}

interface ScoreboardProps {
  player: Player;
  partner: Player;
  opponent1: Player;
  opponent2: Player;
  gameType: string;
  gameLocation: string;
  rounds: Round[];
}

export const ScoreboardComponent = ({
  player,
  partner,
  opponent1,
  opponent2,
  gameType,
  gameLocation,
  rounds,
}: ScoreboardProps) => {
  return (
    <div className="w-full rounded-md border bg-white shadow-md">
      <div className="flex justify-between border-b bg-gray-100 p-4">
        <h2 className="text-lg font-bold text-gray-900">{gameType}</h2>
        <span className="text-sm text-gray-600">{gameLocation}</span>
      </div>
      <div className="space-y-4 p-4">
        <div className="flex justify-between">
          <div>
            <p className="font-medium text-gray-900">
              {player.name} / {partner.name}
            </p>
          </div>
          <div className="flex space-x-2">
            {rounds.map((round, index) => (
              <div
                key={index}
                className="flex h-8 w-8 items-center justify-center rounded bg-gray-100"
              >
                <span className="font-bold text-gray-900">
                  {round.homeTeamScore}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium text-gray-900">
              {opponent1.name} / {opponent2.name}
            </p>
          </div>
          <div className="flex space-x-2">
            {rounds.map((round, index) => (
              <div
                key={index}
                className="flex h-8 w-8 items-center justify-center rounded bg-gray-100"
              >
                <span className="font-bold text-gray-900">
                  {round.awayTeamScore}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock data
const mockData = {
  player: { name: "Player 1" },
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

// Usage
<ScoreboardComponent {...mockData} />;

export const Component = () => {
  return (
    <div className="w-full rounded-md border bg-white shadow-md">
      <div className="flex justify-between border-b bg-gray-100 p-4">
        <h2 className="text-lg font-bold text-gray-900">Mixed Doubles</h2>
        <span className="text-sm text-gray-600">Round of 64</span>
      </div>
      <div className="space-y-4 p-4">
        <div className="flex justify-between">
          <div>
            <p className="font-medium text-gray-900">
              Maggie Brascia / Julian Arnold
            </p>
          </div>
          <div className="flex space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
              <span className="font-bold text-gray-900">11</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
              <span className="font-bold text-gray-900">11</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
              <span className="font-bold text-gray-900">0</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium text-gray-900">
              Jillian Braverman / Jack Munro
            </p>
          </div>
          <div className="flex space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
              <span className="font-bold text-gray-900">5</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
              <span className="font-bold text-gray-900">3</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
              <span className="font-bold text-gray-900">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
