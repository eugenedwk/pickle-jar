import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  AutocompleteInput,
  type GenericFormSelectType,
} from "~/components/AutoComplete";
import { useToast } from "~/components/ui/use-toast";
import { LocationForm } from "../LocationForm";
import { Button } from "../ui/button";

// type FormData = z.infer<typeof MatchSchema>;

export type ParticipantType = {
  playerId: string;
  playerName: string;
  team: string;
};

export type MatchInputs = {
  gameType: string;
  date: Date;
  time: string;
  location: {
    id: string;
    name: string;
  };
  outcome: string;
  scores: {
    round: number;
    home: number;
    away: number;
  }[];
  participants: {
    home1: ParticipantType;
    home2: ParticipantType;
    away1: ParticipantType;
    away2: ParticipantType;
  };
};

export const PickleballMatchForm: React.FC = () => {
  const { toast } = useToast();
  const [createdMatch, setCreatedMatch] = useState<MatchInputs | null>(null);
  const [locations, setLocations] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [isLocationFormOpen, setIsLocationFormOpen] = useState(false);

  const [formData, setFormData] = useState<MatchInputs>({
    participants: {
      home1: { playerId: "", playerName: "", team: "" },
      home2: { playerId: "", playerName: "", team: "" },
      away1: { playerId: "", playerName: "", team: "" },
      away2: { playerId: "", playerName: "", team: "" },
    },
    gameType: "",
    date: new Date(),
    time: "",
    location: { id: "", name: "" },
    outcome: "",
    scores: [
      { round: 1, home: 0, away: 0 },
      { round: 2, home: 0, away: 0 },
      { round: 3, home: 0, away: 0 },
    ],
  });

  const [locationInput, setLocationInput] = useState("");
  const [playerOptions, setPlayerOptions] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<MatchInputs>({
    defaultValues: formData,
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("/api/locations");
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

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

    void fetchLocations();
    void fetchPlayers();
  }, []);

  const handlePlayerSelect =
    (field: keyof MatchInputs) => (value: GenericFormSelectType) => {
      if (!value) {
        console.error("Selected value is undefined");
        return;
      }
      const { id, name, team } = value;
      const playerIdField = `${field}.playerId` as keyof MatchInputs;
      const playerNameField = `${field}.playerName` as keyof MatchInputs;
      const playerTeamField = `${field}.team` as keyof MatchInputs;

      console.log("Setting values:", {
        playerIdField,
        playerNameField,
        playerTeamField,
      });

      if (id && name) {
        setValue(`${field}.playerId` as keyof MatchInputs, id, {
          shouldValidate: true,
        });
        setValue(`${field}.playerName` as keyof MatchInputs, name, {
          shouldValidate: true,
        });
        if (team) {
          setValue(`${field}.team` as keyof MatchInputs, team, {
            shouldValidate: true,
          });
        }
        setFormData((prevData) => {
          const updatedData = { ...prevData };
          const fields = field.split(".");
          let current: unknown = updatedData;

          for (let i = 0; i < fields.length - 1; i++) {
            current = current![fields[i] as keyof typeof current];
          }

          (current as Record<string, unknown>)[fields[fields.length - 1]!] = {
            playerId: id,
            playerName: name,
            team: team,
          };

          // console.log("Updated formData:", updatedData);
          return updatedData;
        });
      }
    };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValue(name as keyof MatchInputs, value, { shouldValidate: true });
    setFormData((prevData) => {
      return {
        ...prevData,
        ...setNestedValue(prevData, name.split("."), value),
      };
    });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationInput(value);
    setValue("location", { id: "", name: value });
  };

  const handleLocationSelect = (selectedLocation: {
    id: string;
    name: string;
  }) => {
    setLocationInput(selectedLocation.name);
    setValue("location", selectedLocation);
  };

  // Helper function to set nested value
  const setNestedValue = <T extends Record<string, unknown>>(
    obj: T,
    path: string[],
    value: unknown,
  ): Partial<T> => {
    const [head, ...rest] = path;
    if (!head) return {};

    if (rest.length === 0) {
      return { [head]: value } as Partial<T>;
    }

    return {
      [head]: {
        ...(obj[head] as Record<string, unknown>),
        ...setNestedValue(obj[head] as Record<string, unknown>, rest, value),
      },
    } as Partial<T>;
  };

  const onSubmit: SubmitHandler<MatchInputs> = async (data) => {
    // Step 1: Submit match match data
    try {
      const participants = [
        {
          playerId: data.participants.home1.playerId,
          playerName: data.participants.home1.playerName,
          team: "home",
        },
        {
          playerId: data.participants.home2.playerId,
          playerName: data.participants.home2.playerName,
          team: "home",
        },
        {
          playerId: data.participants.away1.playerId,
          playerName: data.participants.away1.playerName,
          team: "away",
        },
        {
          playerId: data.participants.away2.playerId,
          playerName: data.participants.away2.playerName,
          team: "away",
        },
      ];
      const matchData = {
        ...data,
        participants,
      };
      try {
        const response = await axios.post("/api/matches", matchData);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setCreatedMatch(response.data);

        // Clear the form
        reset();

        // Show success notification
        toast({
          title: "Match Submitted",
          description: "Your match details have been successfully submitted.",
          duration: 5000,
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error submitting match:", error.response?.data);
          throw new Error("Failed to submit match data");
        } else {
          console.error("Unexpected error:", error);
          throw new Error("An unexpected error occurred");
        }
      }
      // Step 2: Submit match participant data

      // Handle successful submission (e.g., show success message, reset form)
    } catch (error) {
      console.error("Error submitting match:", error);
      // Handle error (e.g., show error message to user)
      toast({
        title: "Error",
        description: "Failed to submit match details. Please try again.",
        duration: 5000,
        variant: "destructive",
      });
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto rounded-lg bg-white p-6 text-black shadow-md md:gap-6"
    >
      <div className="mb-2 md:col-span-2">
        <h2 className="text-left text-4xl font-bold text-green-800">
          Pickleball Match Entry Form
        </h2>
        <h3 className="text-md text-left ">
          Only one entry required per match.
        </h3>
      </div>
      <div className="mb-4 w-full rounded-lg md:border md:border-green-800 md:p-4">
        <h2 className="mb-4 text-left text-2xl font-bold text-green-800">
          Players
        </h2>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="playerName" className="mb-2 block font-medium">
              Home #1
            </label>
            <AutocompleteInput
              options={playerOptions}
              onSelect={handlePlayerSelect(
                "participants.home1" as keyof MatchInputs,
              )}
              placeholder="Enter Your Name"
              value={formData.participants.home1.playerName}
              onChange={(e) =>
                handleInputChange({
                  ...e,
                  target: {
                    ...e.target,
                    name: "participants.home1.playerName",
                  },
                })
              }
            />
            {errors.participants?.home1?.playerName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.participants.home1?.playerName?.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="home2name" className="mb-2 block font-medium">
              Home #2
            </label>
            <AutocompleteInput
              options={playerOptions}
              onSelect={handlePlayerSelect(
                "participants.home2" as keyof MatchInputs,
              )}
              placeholder="Enter partner's name"
              value={formData.participants.home2.playerName}
              onChange={(e) =>
                handleInputChange({
                  ...e,
                  target: {
                    ...e.target,
                    name: "participants.home2.playerName",
                  },
                })
              }
            />
            {errors.participants?.home2?.playerName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.participants.home2?.playerName?.message}
              </p>
            )}
          </div>
        </div>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="away1Name" className="mb-2 block font-medium">
              Opponent #1
            </label>
            <AutocompleteInput
              options={playerOptions}
              onSelect={handlePlayerSelect(
                "participants.away1" as keyof MatchInputs,
              )}
              placeholder="Enter opponents name"
              value={formData.participants.away1.playerName}
              onChange={(e) =>
                handleInputChange({
                  ...e,
                  target: {
                    ...e.target,
                    name: "participants.away1.playerName",
                  },
                })
              }
            />
            {errors.participants?.away1?.playerName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.participants.away1?.playerName?.message}
              </p>
            )}
          </div>

          <div>
            <div className="mb-4">
              <label htmlFor="away2Name" className="mb-2 block font-medium">
                Opponent #2
              </label>
              <AutocompleteInput
                options={playerOptions}
                onSelect={handlePlayerSelect(
                  "participants.away2" as keyof MatchInputs,
                )}
                placeholder="Enter opponents name"
                value={formData.participants.away2.playerName}
                onChange={(e) =>
                  handleInputChange({
                    ...e,
                    target: {
                      ...e.target,
                      name: "participants.away2.playerName",
                    },
                  })
                }
              />
              {errors.participants?.away2?.playerName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.participants.away2?.playerName?.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4 w-full rounded-lg md:border md:border-green-800 md:p-4">
        <h2 className="mb-4 text-left text-2xl font-bold text-green-800">
          Score Card
        </h2>
        <div className="mb-6 grid grid-cols-12 gap-4">
          <div
            id="scoreboard-player-names"
            className="col-span-3 grid grid-rows-3 items-center gap-2 md:col-span-4 "
          >
            <div className="row-span-1 text-right font-bold">Players</div>
            <div className="row-span-1 text-right font-bold">
              <span className="hidden md:inline">
                {formData.participants.home1.playerName} /
                {formData.participants.home2.playerName}
              </span>
              <span className="md:hidden">Home</span>
            </div>
            <div className="row-span-1 text-right font-bold">
              <span className="hidden md:inline">
                {formData.participants.away1.playerName} /
                {formData.participants.away2.playerName}
              </span>
              <span className="md:hidden">Away</span>
            </div>
          </div>
          {formData.scores.map((score, index) => (
            <div key={score.round} className="col-span-2">
              <div className="grid grid-rows-3 items-center md:gap-2">
                <label className="row-span-1 font-bold">
                  Round {score.round}
                </label>
                <div className="row-span-1">
                  <input
                    {...register(`scores.${index}.home` as const, {
                      required: "Home team score is required",
                      valueAsNumber: true,
                      min: { value: 0, message: "Score must be non-negative" },
                    })}
                    type="number"
                    min="0"
                    defaultValue={0}
                    className="w-8 rounded-md border md:w-full md:px-2 md:py-2"
                    onChange={(e) =>
                      handleScoreChange(
                        score.round,
                        "home",
                        parseInt(e.target.value),
                      )
                    }
                  />
                  {errors.scores?.[index]?.home && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.scores[index]?.home?.message}
                    </p>
                  )}
                </div>
                <div className="row-span-1">
                  <input
                    {...register(`scores.${index}.away` as const, {
                      required: "Away team score is required",
                      valueAsNumber: true,
                      min: { value: 0, message: "Score must be non-negative" },
                    })}
                    type="number"
                    min="0"
                    defaultValue={0}
                    className="w-8 rounded-md  border md:w-full md:px-2 md:py-2"
                    onChange={(e) =>
                      handleScoreChange(
                        score.round,
                        "away",
                        parseInt(e.target.value),
                      )
                    }
                  />
                  {errors.scores?.[index]?.away && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.scores[index]?.away?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="col-span-2">
            <div className="grid h-full grid-rows-3 items-center gap-2">
              <label className="font-bold">Winner?</label>
              <div>
                <input
                  {...register("outcome", {
                    required: "Outcome is required",
                    valueAsNumber: true,
                  })}
                  type="radio"
                  value="home"
                  className="form-radio row-span-1"
                  onChange={handleInputChange}
                />
                <span className="ml-2">Home</span>
              </div>
              <div>
                <input
                  {...register("outcome", {
                    required: "Outcome is required",
                    valueAsNumber: true,
                  })}
                  type="radio"
                  value="away"
                  className="form-radio row-span-1"
                  onChange={handleInputChange}
                />
                <span className="ml-2">Away</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4 w-full rounded-lg md:border md:border-green-800 md:p-4">
        <h2 className="mb-4 text-left text-2xl font-bold text-green-800">
          Match Info
        </h2>
        <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row">
          <div>
            <label className="mb-2 block font-medium">Game Type</label>
            <div className="flex flex-col">
              <div>
                <label className="flex items-center">
                  <input
                    {...register("gameType", {
                      required: "Game type is required",
                    })}
                    type="radio"
                    value="Casual"
                    className="mr-2"
                  />
                  Casual
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    {...register("gameType", {
                      required: "Game type is required",
                    })}
                    type="radio"
                    value="Ranked"
                    className="mr-2"
                  />
                  Ranked
                </label>
              </div>
            </div>
            {errors.gameType && (
              <p className="mt-1 text-sm text-red-500">
                {errors.gameType.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="location" className="mb-2 block font-medium">
              Location
            </label>
            <AutocompleteInput
              options={locations}
              onSelect={handleLocationSelect}
              placeholder="Enter location"
              value={locationInput}
              onChange={handleLocationChange}
            />
            {errors.location?.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.location.name.message}
              </p>
            )}
            <div className="mt-2 text-xs">
              <button
                type="button"
                className="text-blue-600 hover:underline focus:outline-none"
                onClick={() => setIsLocationFormOpen(true)}
              >
                Don&apos;t see your location? Add a new one
              </button>
            </div>
            {isLocationFormOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                  <h3 className="mb-4 text-lg font-semibold">
                    Add New Location
                  </h3>
                  <LocationForm
                    onSubmit={async (newLocation: GenericFormSelectType) => {
                      // Add the new location to the locations list
                      setLocations([...locations, newLocation]);
                      // Select the new location
                      setValue("location", newLocation);
                      // Close the popover
                      setIsLocationFormOpen(false);
                    }}
                    onCancel={() => setIsLocationFormOpen(false)}
                  />
                </div>
              </div>
            )}
            {errors.location && (
              <p className="mt-1 text-sm text-red-500">
                {errors.location.message}
              </p>
            )}
          </div>
          <div>
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
          {/* <div>
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
          </div> */}
        </div>
        <div className="mb-4 flex flex-col gap-4"></div>
        {errors.outcome && (
          <p className="mt-1 text-sm text-red-500">{errors.outcome.message}</p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full rounded-md bg-green-800 px-4 py-2 text-white transition-colors hover:bg-green-600 md:col-span-2"
      >
        Submit Match Details
      </Button>
    </form>
  );
};

export default PickleballMatchForm;
