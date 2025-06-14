"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AutocompleteCommand,
  type GenericFormSelectType,
} from "~/components/AutoComplete";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useToast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";

// Validation Schema
const MatchFormSchema = z
  .object({
    gameType: z.enum(["singles", "doubles"], {
      required_error: "Please select a game type",
    }),
    date: z.date({
      required_error: "Please select a match date",
    }),
    time: z.string().min(1, "Please enter a match time"),
    location: z.object({
      id: z.string().min(1, "Please select a location"),
      name: z.string().min(1, "Location name is required"),
    }),
    homePlayer1Id: z.string().min(1, "Home player 1 is required"),
    homePlayer2Id: z.string().optional(),
    awayPlayer1Id: z.string().min(1, "Away player 1 is required"),
    awayPlayer2Id: z.string().optional(),
    courtId: z.string().optional(),
  })
  .refine(
    (data) => {
      // For doubles, both players are required
      if (data.gameType === "doubles") {
        return data.homePlayer2Id && data.awayPlayer2Id;
      }
      return true;
    },
    {
      message: "Both players are required for doubles matches",
      path: ["gameType"],
    },
  );

type MatchFormData = z.infer<typeof MatchFormSchema>;

interface CreateMatchFormProps {
  onSuccess?: (matchId: string) => void;
  onCancel?: () => void;
}

export function CreateMatchForm({ onSuccess, onCancel }: CreateMatchFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedGameType, setSelectedGameType] = useState<
    "singles" | "doubles"
  >("doubles");

  const form = useForm<MatchFormData>({
    resolver: zodResolver(MatchFormSchema),
    defaultValues: {
      gameType: "doubles",
      date: new Date(),
      time: "",
      location: { id: "", name: "" },
      homePlayer1Id: "",
      homePlayer2Id: "",
      awayPlayer1Id: "",
      awayPlayer2Id: "",
      courtId: "",
    },
  });

  // Data fetching
  const { data: players = [], isLoading: playersLoading } = useQuery({
    queryKey: ["players"],
    queryFn: async () => {
      const response = await axios.get<GenericFormSelectType[]>("/api/players");
      return response.data;
    },
  });

  const { data: locations = [], isLoading: locationsLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const response =
        await axios.get<GenericFormSelectType[]>("/api/locations");
      return response.data;
    },
  });

  // Create match mutation
  const createMatchMutation = useMutation({
    mutationFn: async (data: MatchFormData) => {
      const participants = [
        {
          playerId: data.homePlayer1Id,
          teamId: 1,
          position: 1,
        },
        ...(data.gameType === "doubles" && data.homePlayer2Id
          ? [
              {
                playerId: data.homePlayer2Id,
                teamId: 1,
                position: 2,
              },
            ]
          : []),
        {
          playerId: data.awayPlayer1Id,
          teamId: 2,
          position: 1,
        },
        ...(data.gameType === "doubles" && data.awayPlayer2Id
          ? [
              {
                playerId: data.awayPlayer2Id,
                teamId: 2,
                position: 2,
              },
            ]
          : []),
      ];

      const matchData = {
        gameType: data.gameType,
        date: data.date,
        time: data.time,
        location: data.location,
        courtId: data.courtId || "default-court",
        participants,
      };

      const response = await axios.post("/api/matches", matchData);
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Match Created",
        description: "Your match has been successfully created!",
      });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      onSuccess?.(data.id);
      form.reset();
    },
    onError: (error) => {
      console.error("Failed to create match:", error);
      toast({
        title: "Error",
        description: "Failed to create match. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MatchFormData) => {
    createMatchMutation.mutate(data);
  };

  const handleGameTypeChange = (value: "singles" | "doubles") => {
    setSelectedGameType(value);
    form.setValue("gameType", value);

    // Clear player 2 fields when switching to singles
    if (value === "singles") {
      form.setValue("homePlayer2Id", "");
      form.setValue("awayPlayer2Id", "");
    }
  };

  const isLoading =
    playersLoading || locationsLoading || createMatchMutation.isPending;

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Match</CardTitle>
        <CardDescription>
          Set up a new pickleball match with players and details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Game Type Selection */}
            <FormField
              control={form.control}
              name="gameType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={handleGameTypeChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="singles" id="singles" />
                        <label htmlFor="singles">Singles</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="doubles" id="doubles" />
                        <label htmlFor="doubles">Doubles</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Time */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Match Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Match Time</FormLabel>
                    <FormControl>
                      <Input type="time" placeholder="Select time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <AutocompleteCommand
                      options={locations}
                      placeholder="Select or search location..."
                      onSelect={(location) => {
                        field.onChange({
                          id: location.id,
                          name: location.name,
                        });
                      }}
                      value={field.value.name}
                      disabled={locationsLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Players Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Players</h3>

              {/* Home Team */}
              <div className="space-y-3">
                <h4 className="font-medium text-green-700">Home Team</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="homePlayer1Id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Player 1 *</FormLabel>
                        <FormControl>
                          <AutocompleteCommand
                            options={players}
                            placeholder="Select player..."
                            onSelect={(player) => field.onChange(player.id)}
                            disabled={playersLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedGameType === "doubles" && (
                    <FormField
                      control={form.control}
                      name="homePlayer2Id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Home Player 2 *</FormLabel>
                          <FormControl>
                            <AutocompleteCommand
                              options={players}
                              placeholder="Select player..."
                              onSelect={(player) => field.onChange(player.id)}
                              disabled={playersLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              {/* Away Team */}
              <div className="space-y-3">
                <h4 className="font-medium text-blue-700">Away Team</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="awayPlayer1Id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Away Player 1 *</FormLabel>
                        <FormControl>
                          <AutocompleteCommand
                            options={players}
                            placeholder="Select player..."
                            onSelect={(player) => field.onChange(player.id)}
                            disabled={playersLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedGameType === "doubles" && (
                    <FormField
                      control={form.control}
                      name="awayPlayer2Id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Away Player 2 *</FormLabel>
                          <FormControl>
                            <AutocompleteCommand
                              options={players}
                              placeholder="Select player..."
                              onSelect={(player) => field.onChange(player.id)}
                              disabled={playersLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {createMatchMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Match
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
