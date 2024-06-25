"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { useCreatePlayerProfile } from "~/hooks/useCreatePlayerProfile";

const playerSchema = z.object({
  screenName: z.string().min(1, "Username is required"),
  realName: z.string().optional(),
  skillLevel: z.string().optional(),
  paddleBrand: z.string().optional(),
  paddlePreference: z.string().optional(),
  plays: z.string().optional(),
  homeCourt: z.string().optional(),
});

export type PlayerFormData = z.infer<typeof playerSchema>;

export const OnboardingForm: React.FC = ({}) => {
  const { mutate: createProfile, isPending: isSubmitting } =
    useCreatePlayerProfile();

  return (
    <div className="mx-auto max-w-md">
      <h2 className="mb-4 text-2xl font-bold">Complete Your Profile</h2>
      <PlayerProfileForm
        onSubmit={(data) => Promise.resolve(createProfile(data))}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

type PlayerProfileFormProps = {
  onSubmit: (data: PlayerFormData) => Promise<void>;
  isSubmitting: boolean;
};

export const PlayerProfileForm: React.FC<PlayerProfileFormProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlayerFormData>({
    resolver: zodResolver(playerSchema),
  });

  const onSubmitHandler: SubmitHandler<PlayerFormData> = (data) => {
    void onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="space-y-4 rounded-lg bg-white p-6 shadow-md"
    >
      <div>
        <label
          htmlFor="screenName"
          className="block text-sm font-medium text-gray-700"
        >
          Username *
        </label>
        <input
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
      <div>
        <label
          htmlFor="realName"
          className="block text-sm font-medium text-gray-700"
        >
          Real Name
        </label>
        <input
          {...register("realName")}
          id="realName"
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="skillLevel"
          className="block text-sm font-medium text-gray-700"
        >
          Skill Level
        </label>
        <select
          {...register("skillLevel")}
          id="skillLevel"
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select skill level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="try hard">Try Hard</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="paddleBrand"
          className="block text-sm font-medium text-gray-700"
        >
          Paddle Brand
        </label>
        <input
          {...register("paddleBrand")}
          id="paddleBrand"
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700">
          Paddle Preference
        </span>
        <div className="mt-2 space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register("paddlePreference")}
              value="control"
              className="form-radio text-indigo-600"
            />
            <span className="ml-2 text-black">Control</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register("paddlePreference")}
              value="power"
              className="form-radio text-indigo-600"
            />
            <span className="ml-2 text-black">Power</span>
          </label>
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700">Plays</span>
        <div className="mt-2 space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register("plays")}
              value="leftHand"
              className="form-radio text-indigo-600"
            />
            <span className="ml-2 text-black">Left Hand</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register("plays")}
              value="rightHand"
              className="form-radio text-indigo-600"
            />
            <span className="ml-2 text-black">Right Hand</span>
          </label>
        </div>
      </div>
      <div>
        <label
          htmlFor="homeCourt"
          className="block text-sm font-medium text-gray-700"
        >
          Home Court
        </label>
        <input
          {...register("homeCourt")}
          id="homeCourt"
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};
