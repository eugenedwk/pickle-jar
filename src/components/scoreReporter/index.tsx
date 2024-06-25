import React, { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { format } from "date-fns";
import { AutocompleteInput, type PlayerInfo } from "../AutoComplete";

// type FormData = z.infer<typeof MatchSchema>;

type MatchInputs = {
  gameType: string;
  date: Date;
  time: string;
  location: string;
  outcome: string;
  scores: {
    round: number;
    home: number;
    away: number;
  }[];
  playerName: string;
  partnerName: string;
  opponent1Name: string;
  opponent2Name: string;
};
export const PickleballMatchForm: React.FC = () => {
  const [formData, setFormData] = useState<MatchInputs>({
    playerName: "",
    partnerName: "",
    opponent1Name: "",
    opponent2Name: "",
    gameType: "",
    date: new Date(),
    time: "",
    location: "",
    outcome: "",
    scores: [
      { round: 1, home: 0, away: 0 },
      { round: 2, home: 0, away: 0 },
      { round: 3, home: 0, away: 0 },
    ],
  });

  const [playerOptions, setPlayerOptions] = useState<PlayerInfo[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<MatchInputs>();

  useEffect(() => {
    // Fetch player list from your API
    const fetchPlayers = async () => {
      try {
        const response = await fetch("/api/players");
        if (response.ok) {
          const players = (await response.json()) as {
            id: string;
            name: string;
          }[];
          setPlayerOptions(
            players.map((player) => ({
              id: player.id,
              name: player.name,
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    void fetchPlayers();
  }, []);

  const handlePlayerSelect = (field: keyof MatchInputs) => (value: string) => {
    setValue(field, value);
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const onSubmit: SubmitHandler<MatchInputs> = async (data) => {
    // Step 1: Submit match match data
    try {
      const participants = [
        { playerId: data.playerName, team: "home" },
        { playerId: data.partnerName, team: "home" },
        { playerId: data.opponent1Name, team: "away" },
        { playerId: data.opponent2Name, team: "away" },
      ];
      const matchData = {
        ...data,
        participants,
      };

      const response = await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(matchData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit match data");
      }

      const result = (await response.json()) as { id: number };
      console.log("Match submitted successfully:", result);

      // Step 2: Submit match participant data

      // Handle successful submission (e.g., show success message, reset form)
    } catch (error) {
      console.error("Error submitting match:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleScoreChange = (
    round: number,
    team: "home" | "away",
    value: number,
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      scores: prevData.scores.map((score) =>
        score.round === round ? { ...score, [team]: value } : score,
      ),
    }));
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-md rounded-lg bg-white p-6 text-black shadow-md md:grid md:grid-cols-2 md:gap-6"
    >
      <h2 className="mb-6 text-center text-2xl font-bold md:col-span-2">
        Pickleball Match Details
      </h2>
      <div>
        <div>
          <div className="mb-4">
            <label htmlFor="playerName" className="mb-2 block font-medium">
              Player Name
            </label>
            <AutocompleteInput
              options={playerOptions}
              onSelect={handlePlayerSelect("playerName")}
              placeholder="Enter player name"
              value={formData.playerName}
              onChange={(e) =>
                handleInputChange({
                  ...e,
                  target: { ...e.target, name: "playerName" },
                })
              }
            />
            {errors.playerName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.playerName.message}
              </p>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="partnerName" className="mb-2 block font-medium">
            Partner Name
          </label>
          <AutocompleteInput
            options={playerOptions}
            onSelect={handlePlayerSelect("partnerName")}
            placeholder="Enter player name"
            value={formData.partnerName}
            onChange={(e) =>
              handleInputChange({
                ...e,
                target: { ...e.target, name: "partnerName" },
              })
            }
          />
          {errors.partnerName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.partnerName.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="opponent1Name" className="mb-2 block font-medium">
            Opponent Name #1
          </label>
          <AutocompleteInput
            options={playerOptions}
            onSelect={handlePlayerSelect("opponent1Name")}
            placeholder="Enter player name"
            value={formData.opponent1Name}
            onChange={(e) =>
              handleInputChange({
                ...e,
                target: { ...e.target, name: "opponent1Name" },
              })
            }
          />
          {errors.opponent1Name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.opponent1Name.message}
            </p>
          )}
        </div>

        <div>
          <div className="mb-4">
            <label htmlFor="opponent2Name" className="mb-2 block font-medium">
              Opponent Name #2
            </label>
            <AutocompleteInput
              options={playerOptions}
              onSelect={handlePlayerSelect("opponent2Name")}
              placeholder="Enter player name"
              value={formData.opponent2Name}
              onChange={(e) =>
                handleInputChange({
                  ...e,
                  target: { ...e.target, name: "opponent2Name" },
                })
              }
            />
            {errors.opponent2Name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.opponent2Name.message}
              </p>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-2 block font-medium">Game Type</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                {...register("gameType", { required: "Game type is required" })}
                type="radio"
                value="casual"
                className="mr-2"
              />
              Casual
            </label>
            <label className="flex items-center">
              <input
                {...register("gameType", { required: "Game type is required" })}
                type="radio"
                value="ranked"
                className="mr-2"
              />
              Ranked
            </label>
          </div>
          {errors.gameType && (
            <p className="mt-1 text-sm text-red-500">
              {errors.gameType.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="mb-2 block font-medium">
            Date
          </label>
          <input
            {...register("date", { required: "Date is required" })}
            id="date"
            type="date"
            className="w-full rounded-md border px-3 py-2"
            defaultValue={format(new Date(), "yyyy-MM-dd")}
            onChange={handleInputChange}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="time" className="mb-2 block font-medium">
            Time
          </label>
          <input
            {...register("time", { required: "Time is required" })}
            id="time"
            type="time"
            className="w-full rounded-md border px-3 py-2"
            onChange={handleInputChange}
          />
          {errors.time && (
            <p className="mt-1 text-sm text-red-500">{errors.time.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="location" className="mb-2 block font-medium">
            Location
          </label>
          <input
            {...register("location", { required: "Location is required" })}
            id="location"
            type="text"
            className="w-full rounded-md border px-3 py-2"
            onChange={handleInputChange}
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-500">
              {errors.location.message}
            </p>
          )}
        </div>
      </div>
      <div>
        {formData.scores.map((score, index) => (
          <div key={score.round} className="mb-6">
            <label className="mb-2 block font-medium">
              Round {score.round}
            </label>
            <div className="flex space-x-4">
              <input
                {...register(`scores.${index}.home` as const, {
                  required: "Home team score is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Score must be non-negative" },
                })}
                type="number"
                min="0"
                defaultValue={0}
                className="w-full rounded-md border px-3 py-2"
                onChange={(e) =>
                  handleScoreChange(
                    score.round,
                    "home",
                    parseInt(e.target.value),
                  )
                }
              />
              <input
                {...register(`scores.${index}.away` as const, {
                  required: "Away team score is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Score must be non-negative" },
                })}
                type="number"
                min="0"
                defaultValue={0}
                className="w-full rounded-md border px-3 py-2"
                onChange={(e) =>
                  handleScoreChange(
                    score.round,
                    "away",
                    parseInt(e.target.value),
                  )
                }
              />
            </div>
            {errors.scores?.[index]?.home && (
              <p className="mt-1 text-sm text-red-500">
                {errors.scores[index]?.home?.message}
              </p>
            )}
            {errors.scores?.[index]?.away && (
              <p className="mt-1 text-sm text-red-500">
                {errors.scores[index]?.away?.message}
              </p>
            )}
          </div>
        ))}

        <div className="mb-4 md:col-span-2">
          <label className="mb-2 block font-medium">Outcome</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                {...register("outcome", {
                  required: "Outcome is required",
                  valueAsNumber: true,
                })}
                type="radio"
                value="win"
                className="form-radio"
                onChange={handleInputChange}
              />
              <span className="ml-2">Win</span>
            </label>
            <label className="inline-flex items-center">
              <input
                {...register("outcome", {
                  required: "Outcome is required",
                  valueAsNumber: true,
                })}
                type="radio"
                value="loss"
                className="form-radio"
                onChange={handleInputChange}
              />
              <span className="ml-2">Loss</span>
            </label>
          </div>
          {errors.outcome && (
            <p className="mt-1 text-sm text-red-500">
              {errors.outcome.message}
            </p>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 md:col-span-2"
      >
        Submit Match Details
      </button>
    </form>
  );
};
