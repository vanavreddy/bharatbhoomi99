import { z } from 'zod';

export const enquirySchema = z.object({
  propertyId: z.number().positive(),
  senderUserId: z.number().positive(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be under 1000 characters'),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
