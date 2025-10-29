import { z } from 'zod';

export const grievanceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  submitter_name: z.string().optional(),
  submitter_email: z.string().email().optional().or(z.literal('')),
  submitter_phone: z.string().optional(),
  location: z.string().optional(),
  // Add any other fields you need
});