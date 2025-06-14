import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  AutocompleteCommand,
  type GenericFormSelectType,
} from "~/components/AutoComplete";
import { useToast } from "~/components/ui/use-toast";
import { LocationForm } from "../LocationForm";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

// type FormData = z.infer<typeof MatchSchema>;

export type ParticipantType = {
  playerId: string;
  playerName: string;
  playerScreenName: string;
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
  scores?: {
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
  const [isLocationFormOpen, setIsLocationFormOpen] = useState(false);
  const [locationInput, setLocationInput] = useState("");

  const [formData, setFormData] = useState<MatchInputs>({
    participants: {
      home1: { playerId: "", playerName: "", playerScreenName: "", team: "" },
      home2: { playerId: "", playerName: "", playerScreenName: "", team: "" },
      away1: { playerId: "", playerName: "", playerScreenName: "", team: "" },
      away2: { playerId: "", playerName: "", playerScreenName: "", team: "" },
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<MatchInputs>({
    defaultValues: formData,
  });

  const { data: locations = [], refetch: refetchLocations } = useQuery<
    GenericFormSelectType[]
  >({
    queryKey: ["locations"],
    queryFn: async () => {
      const response =
        await axios.get<GenericFormSelectType[]>("/api/locations");
      console.log("Fetched locations:", response.data);
      return response.data;
    },
  });

  const { data: playerOptions = [] } = useQuery({
    queryKey: ["players option"],
    queryFn: async () => {
      try {
        const response =
          await axios.get<GenericFormSelectType[]>("/api/players");
        const players = response.data;
        return players ?? []; // Ensure we always return an array
      } catch (error) {
        console.error("Failed to fetch players:", error);
        return []; // Return empty array on error
      }
    },
  });

  const handlePlayerSelect =
    (field: keyof MatchInputs) => (value: GenericFormSelectType) => {
      if (!value) return;

      const { id, name, team } = value;
      setValue(`${field}.playerId` as keyof MatchInputs, id, {
        shouldValidate: true,
      });
      setValue(`${field}.playerScreenName` as keyof MatchInputs, name ?? "", {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let current: any = updatedData;

        for (let i = 0; i < fields.length - 1; i++) {
          current = current[fields[i] as keyof typeof current];
        }

        (current as Record<string, unknown>)[fields[fields.length - 1]!] = {
          playerId: id,
          playerName: name ?? "",
          team: team ?? "",
        };

        return updatedData;
      });
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
    console.log("handleLocationChange:", { value });
    setLocationInput(value);

    // Find matching location to preserve ID if it exists
    const matchingLocation = locations.find(
      (loc: GenericFormSelectType) => loc.name === value,
    );
    setValue("location", {
      id: matchingLocation?.id ?? "",
      name: value,
    });
  };

  const handleLocationSelect = (selectedLocation: GenericFormSelectType) => {
    console.log("handleLocationSelect:", selectedLocation);
    setLocationInput(selectedLocation.name ?? "");
    setValue("location", {
      id: selectedLocation.id,
      name: selectedLocation.name ?? "",
    });
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
    // Validate required fields before submission
    if (
      !data.participants.home1.playerId ||
      !data.participants.away1.playerId
    ) {
      toast({
        title: "Missing Required Players",
        description: "Please select both Home #1 and Away #1 players.",
        variant: "destructive",
      });
      return;
    }

    if (!data.scores?.some((score) => score.home > 0 || score.away > 0)) {
      toast({
        title: "Missing Scores",
        description: "Please enter scores for at least one round.",
        variant: "destructive",
      });
      return;
    }

    console.log("Form submission - location data:", data.location.id);
    console.log("data", data);
    // Step 1: Submit match match data
    try {
      const participants = [
        {
          playerId: data.participants.home1.playerId,
          playerName: data.participants.home1.playerScreenName,
          team: "home",
        },
        {
          playerId: data.participants.home2.playerId,
          playerName: data.participants.home2.playerScreenName,
          team: "home",
        },
        {
          playerId: data.participants.away1.playerId,
          playerName: data.participants.away1.playerScreenName,
          team: "away",
        },
        {
          playerId: data.participants.away2.playerId,
          playerName: data.participants.away2.playerScreenName,
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
      scores:
        prevData.scores?.map((score) =>
          score.round === round ? { ...score, [team]: value } : score,
        ) ?? [],
    }));
  };

  const handleWinnerSelect = (winner: "home" | "away") => {
    setValue("outcome", winner);
    setFormData((prevData) => ({
      ...prevData,
      outcome: winner,
    }));
  };

  // Add this helper function near the top of the component
  const isRoundAvailable = (
    roundIndex: number,
    scores: MatchInputs["scores"] = [],
  ) => {
    if (roundIndex === 0) return true; // First round is always available

    const previousRound = scores[roundIndex - 1];
    return previousRound && (previousRound.home > 0 || previousRound.away > 0);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto rounded-lg bg-white p-0 text-black shadow-md md:gap-6 md:p-6"
    >
      <div className="mb-2 md:col-span-2">
        <h2 className="text-left text-4xl font-bold text-green-800">
          Match Entry Form
        </h2>
        <h3 className="text-md text-left ">
          Only one entry required per match.
        </h3>
      </div>
      <div className="mb-4 w-full rounded-lg md:border md:border-green-800 md:p-4">
        <h2 className="mb-4 text-left text-2xl font-bold text-green-800">
          Players
        </h2>
        <div className="mb-4 grid-cols-2 gap-4">
          <div>
            <label htmlFor="playerName" className="mb-2 block font-medium">
              Home #1
            </label>
            <AutocompleteCommand
              options={playerOptions}
              onSelect={handlePlayerSelect(
                "participants.home1" as keyof MatchInputs,
              )}
              placeholder="Enter Your Name"
              value={formData.participants.home1.playerName}
              onChange={handleInputChange}
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
            <AutocompleteCommand
              options={playerOptions}
              onSelect={handlePlayerSelect(
                "participants.home2" as keyof MatchInputs,
              )}
              placeholder="Enter partner's name"
              value={formData.participants.home2.playerName}
              onChange={handleInputChange}
            />
            {errors.participants?.home2?.playerName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.participants.home2?.playerName?.message}
              </p>
            )}
          </div>
        </div>
        <div className="mb-4 grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="away1Name" className="mb-2 block font-medium">
              Away #1
            </label>
            <AutocompleteCommand
              options={playerOptions}
              onSelect={handlePlayerSelect(
                "participants.away1" as keyof MatchInputs,
              )}
              placeholder="Enter Aways name"
              value={formData.participants.away1.playerName}
              onChange={handleInputChange}
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
                Away #2
              </label>
              <AutocompleteCommand
                options={playerOptions}
                onSelect={handlePlayerSelect(
                  "participants.away2" as keyof MatchInputs,
                )}
                placeholder="Enter Away name"
                value={formData.participants.away2.playerName}
                onChange={handleInputChange}
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
        <div className="mb-6 grid grid-cols-12 gap-1 text-xs md:gap-4 md:text-base">
          {/* ====================================
>>>>>>>>>> Row 1: HEADERS <<<<<<<<<<<<<
====================================   */}{" "}
          <div className="col-span-3 text-right font-bold">Players</div>
          {formData.scores?.map((score) => (
            <div key={score.round} className="col-span-2 font-bold">
              <span className="md:hidden">Rd {score.round}</span>
              <span className="hidden md:inline">Round {score.round}</span>
            </div>
          ))}
          <div className="col-span-3 font-bold">Winner?</div>
          {/* ====================================
          >>>>>>>>>> Row 2: HOME <<<<<<<<<<<<<
          ====================================   */}
          <div className="col-span-3 text-right">
            <span className="hidden md:inline">
              {formData.participants.home1.playerName} /{" "}
              {formData.participants.home2.playerName}
            </span>
            <div className="pt-2 font-bold md:hidden">Home</div>
          </div>
          {formData.scores?.map((score, index) => (
            <div key={`home-${score.round}`} className="col-span-2">
              {isRoundAvailable(index, formData.scores) ? (
                <Input
                  {...register(`scores.${index}.home` as const, {
                    valueAsNumber: true,
                    min: { value: 0, message: "Score must be non-negative" },
                    max: { value: 100, message: "Score cannot exceed 100" },
                  })}
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={0}
                  className="w-14 rounded-md border md:w-full md:px-2 md:py-2"
                  onChange={(e) =>
                    handleScoreChange(
                      score.round,
                      "home",
                      parseInt(e.target.value),
                    )
                  }
                />
              ) : (
                <div className="w-14 rounded-md border bg-gray-100 md:w-full md:px-2 md:py-2">
                  -
                </div>
              )}
              {errors.scores?.[index]?.home && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.scores[index]?.home?.message}
                </p>
              )}
            </div>
          ))}
          <div id="home-winner-button" className="col-span-3">
            <Button
              type="button"
              className={`w-full rounded-md px-4 py-2 text-left ${
                watch("outcome") === "home"
                  ? "bg-green-600 text-white"
                  : "border border-green-600 bg-white text-green-600"
              }`}
              onClick={() => handleWinnerSelect("home")}
            >
              Home
            </Button>
          </div>
          {/* ====================================
>>>>>>>>>> Row 2: AWAY <<<<<<<<<<<<<
====================================   */}
          <div className="col-span-3 text-right ">
            <span className="hidden md:inline">
              {formData.participants.away1.playerName} /{" "}
              {formData.participants.away2.playerName}
            </span>
            <div className="pt-2 font-bold md:hidden">Away</div>
          </div>
          {formData.scores?.map((score, index) => (
            <div key={`away-${score.round}`} className="col-span-2">
              {isRoundAvailable(index, formData.scores) ? (
                <Input
                  {...register(`scores.${index}.away` as const, {
                    valueAsNumber: true,
                    min: { value: 0, message: "Score must be non-negative" },
                    max: { value: 100, message: "Score cannot exceed 100" },
                  })}
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={0}
                  className="w-14 rounded-md border md:w-full md:px-2 md:py-2"
                  onChange={(e) =>
                    handleScoreChange(
                      score.round,
                      "away",
                      parseInt(e.target.value),
                    )
                  }
                />
              ) : (
                <div className="w-14 rounded-md border bg-gray-100 md:w-full md:px-2 md:py-2">
                  -
                </div>
              )}
              {errors.scores?.[index]?.away && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.scores[index]?.away?.message}
                </p>
              )}
            </div>
          ))}
          <div id="away-winner-button" className="col-span-3">
            <Button
              type="button"
              className={`w-full rounded-md px-4 py-2 text-left ${
                watch("outcome") === "away"
                  ? "bg-green-600 text-white"
                  : "border border-green-600 bg-white text-green-600"
              }`}
              onClick={() => handleWinnerSelect("away")}
            >
              Away
            </Button>
          </div>
        </div>
      </div>
      <div className="mb-4 w-full rounded-lg md:border md:border-green-800 md:p-4">
        <h2 className="mb-4 text-left text-2xl font-bold text-green-800">
          Match Info
        </h2>
        <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row">
          <div>
            <fieldset>
              <legend className="mb-2 block font-medium">Game Type</legend>
              <div className="flex flex-col">
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...register("gameType", {
                      required: "Game type is required",
                    })}
                    value="Casual"
                    className="form-radio mr-2 text-green-600"
                  />
                  Casual
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...register("gameType", {
                      required: "Game type is required",
                    })}
                    value="Ranked"
                    className="form-radio mr-2 text-green-600"
                  />
                  Ranked
                </label>
              </div>
            </fieldset>
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
            <AutocompleteCommand
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
              <Button
                type="button"
                className="text-white hover:underline focus:outline-none"
                onClick={() => setIsLocationFormOpen(true)}
              >
                Don&apos;t see your location? Add a new one
              </Button>
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
                      await refetchLocations();
                      setValue("location", {
                        id: newLocation.id,
                        name: newLocation.name ?? "",
                      });
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
            <Input
              {...register("date", { required: "Date is required" })}
              id="date"
              type="date"
              className="w-full rounded-md border px-3 py-2"
              defaultValue={new Date().toISOString().split("T")[0]}
              value={new Date().toISOString().split("T")[0]}
              onChange={handleInputChange}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>
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
