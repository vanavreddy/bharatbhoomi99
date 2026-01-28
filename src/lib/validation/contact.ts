import { z } from 'zod';
import { emailSchema, phoneSchema, nameSchema } from './schemas';

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject cannot exceed 100 characters'),
  message: z
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(1000, 'Message cannot exceed 1000 characters'),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
