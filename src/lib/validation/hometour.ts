import { z } from 'zod';

export const hometourSchema = z.object({
  userId: z.number().positive(),
  preferredDate: z.string().refine((d) => new Date(d) >= new Date(new Date().toDateString()), {
    message: 'Date must be today or in the future',
  }),
  preferredTime: z.string().max(20).optional(),
  message: z.string().max(1000).optional(),
});

export type HomeTourInput = z.infer<typeof hometourSchema>;
