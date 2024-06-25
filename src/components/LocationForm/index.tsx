import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "~/components/ui/use-toast";
import axios from "axios";
import { type Location } from "~/server/db/schema";

const locationSchema = z.object({
  name: z.string().min(1, "Location name is required"),
});

export type LocationFormData = { name: string };

type LocationFormProps = {
  onSubmit: (newLocation: Location) => Promise<void>;
  onCancel: () => void;
};

export const LocationForm: React.FC<LocationFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
  });

  const handleFormSubmit = async (data: LocationFormData) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<Location>("/api/locations", data);
      const newLocation = response.data;
      toast({
        title: "Location Added",
        description: "The new location has been successfully added.",
      });
      reset();
      await onSubmit(newLocation);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add the location. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Location Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div className="flex justify-between">
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Location"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
