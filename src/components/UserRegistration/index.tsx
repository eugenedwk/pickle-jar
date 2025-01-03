"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { useCreatePlayerProfile } from "~/lib/useCreatePlayerProfile";
import { toast } from "~/components/ui/use-toast";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  AutocompleteCommand,
  type GenericFormSelectType,
} from "~/components/AutoComplete";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Button } from "../ui/button";
import { LocationForm } from "../LocationForm";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { stateList } from "~/lib/stateList";

const LocationSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const playerSchema = z.object({
  screenName: z.string().min(1, "Username is required"),
  realName: z.string().optional(),
  hideRealName: z.boolean().default(true),
  skillLevel: z.string().optional(),
  paddleBrand: z.string().optional(),
  paddlePreference: z.string().optional(),
  plays: z.string().optional(),
  homeCourt: LocationSchema.optional(),
  state: z.string().optional(),
});

export type PlayerFormData = z.infer<typeof playerSchema>;
interface OnboardingFormProps {
  onComplete: () => void;
}
export const OnboardingForm: React.FC<OnboardingFormProps> = ({
  onComplete,
}) => {
  const { mutate: createProfile, isPending: isSubmitting } =
    useCreatePlayerProfile();
  const handleSubmit = (data: PlayerFormData) => {
    createProfile(data, {
      onSuccess: () => {
        toast({
          title: "Profile Created",
          description: "Your player profile has been successfully created.",
          duration: 5000,
        });
        onComplete();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to create profile. Please try again.",
          duration: 5000,
          variant: "destructive",
        });
        console.error("Error creating profile:", error);
      },
    });
  };
  return (
    <div className="mx-auto max-w-md">
      <h2 className="mb-4 text-2xl font-bold">Complete Your Profile</h2>
      <PlayerProfileForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};

type PlayerProfileFormProps = {
  onSubmit: (data: PlayerFormData) => void;
  isSubmitting: boolean;
};

export const PlayerProfileForm: React.FC<PlayerProfileFormProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,

    formState: { errors },
  } = useForm<PlayerFormData>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      hideRealName: true,
    },
  });

  const [locations, setLocations] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [isLocationFormOpen, setIsLocationFormOpen] = useState(false);

  const [locationInput, setLocationInput] = useState("");
  const hideRealName = watch("hideRealName");

  const { data: locationsData, error: locationsError } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await axios.get("/api/locations");
      return response.data as { id: string; name: string }[];
    },
  });

  useEffect(() => {
    if (locationsData) {
      setLocations(locationsData);
    }
    if (locationsError) {
      console.error("Error fetching locations:", locationsError);
    }
  }, [locationsData, locationsError]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationInput(value);
    setValue("homeCourt", { id: "", name: value });
  };

  const handleLocationSelect = (selectedLocation: GenericFormSelectType) => {
    setLocationInput(selectedLocation.name ?? "");
    setValue("homeCourt", {
      id: selectedLocation.id,
      name: selectedLocation.name ?? "",
    });
  };
  const onSubmitHandler: SubmitHandler<PlayerFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="relative max-h-[65vh] space-y-2 overflow-y-auto rounded-lg bg-white p-6 pb-16 shadow-md"
    >
      <div>
        <Label
          htmlFor="realName"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </Label>
        <Input
          {...register("realName")}
          id="realName"
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <Label
          htmlFor="screenName"
          className="block text-sm font-medium text-gray-700"
        >
          Screen Name
        </Label>
        <Input
          {...register("screenName")}
          id="screenName"
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.screenName && (
          <span className="text-xs text-red-500">
            {errors.screenName.message!}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Controller
          name="hideRealName"
          control={control}
          render={({ field }) => (
            <Switch
              id="hideRealName"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label
          htmlFor="hideRealName"
          className="text-sm font-medium text-gray-700"
        >
          Use Screen Name (Hides real name from public)
        </Label>
      </div>

      <div className="py-4">
        <hr className="border-t border-gray-300" />
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <Label
            htmlFor="skillLevel"
            className="block text-sm font-medium text-gray-700"
          >
            Skill Level
          </Label>
          <Select onValueChange={(value) => setValue("skillLevel", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select skill level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
              <SelectItem value="Try Hard">Try Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Label
            htmlFor="paddleBrand"
            className="block text-sm font-medium text-gray-700"
          >
            Paddle Brand
          </Label>
          <Input
            {...register("paddleBrand")}
            id="paddleBrand"
            className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      <div className="flex">
        <div className="flex-1">
          <span className="text-sm font-medium text-gray-700">
            Paddle Preference
          </span>
          <div className="flex whitespace-nowrap">
            <Label className="flex items-center">
              <Input
                type="radio"
                {...register("paddlePreference")}
                value="Control"
                className="form-radio"
              />
              <span className="ml-2 text-black">Control</span>
            </Label>
          </div>
          <div className="flex whitespace-nowrap">
            <Label className="flex items-center">
              <Input
                type="radio"
                {...register("paddlePreference")}
                value="Power"
                className="form-radio"
              />
              <span className="ml-2 text-black">Power</span>
            </Label>
          </div>
        </div>

        <div className="mx-4 w-px bg-gray-300"></div>

        <div className="flex-1">
          <span className="text-sm font-medium text-gray-700">Plays</span>
          <div className="flex whitespace-nowrap">
            <Label className="flex items-center">
              <Input
                type="radio"
                {...register("plays")}
                value="Left-Handed"
                className="form-radio "
              />
              <span className="ml-2 text-black">Left Handed</span>
            </Label>
          </div>
          <div className="flex whitespace-nowrap">
            <Label className="flex items-center">
              <Input
                type="radio"
                {...register("plays")}
                value="Right-Handed"
                className="form-radio"
              />
              <span className="ml-2 text-black">Right Handed</span>
            </Label>
          </div>
        </div>
      </div>

      <div className="py-4">
        <hr className="border-t border-gray-300" />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700"
          >
            State
          </Label>
          <div
            id="state"
            className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <Select onValueChange={(value) => setValue("state", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent>
                {stateList.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex-1">
          <Label
            htmlFor="homeCourt"
            className="block text-sm font-medium text-gray-700"
          >
            Home Court
          </Label>
          <AutocompleteCommand
            options={locations}
            onSelect={handleLocationSelect}
            placeholder="Enter your home court"
            value={locationInput}
            onChange={handleLocationChange}
          />
          <div className="mt-2 text-xs">
            <button
              type="button"
              className="text-left text-blue-600 hover:underline focus:outline-none "
              onClick={() => setIsLocationFormOpen(true)}
            >
              + Add new court
            </button>
          </div>
          {isLocationFormOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-semibold">Add New Location</h3>
                <LocationForm
                  onSubmit={async (newLocation: GenericFormSelectType) => {
                    const location = {
                      id: newLocation.id,
                      name: newLocation.name ?? "",
                    };
                    setLocations([...locations, location]);
                    setLocationInput(location.name);
                    setValue("homeCourt", location);
                    setIsLocationFormOpen(false);
                  }}
                  onCancel={() => setIsLocationFormOpen(false)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
        <div className="mx-auto max-w-md">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md border border-transparent bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </form>
  );
};
