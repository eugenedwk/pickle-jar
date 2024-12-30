import { z } from "zod";

export const createMatchSchema = z.object({
  startTime: z.coerce.date().default(() => new Date()),
  endTime: z.coerce.date().default(() => new Date()),
  courtId: z.string().uuid().optional(),
  participants: z
    .array(
      z.object({
        id: z.string().uuid().optional().nullable(),
        teamId: z.number().optional(),
        position: z.number().optional(),
      }),
    )
    .length(4),
});

export type CreateMatchSchema = z.infer<typeof createMatchSchema>;
