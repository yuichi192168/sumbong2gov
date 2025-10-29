
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Base schema for all grievance fields except the image
const baseGrievanceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().min(20, 'Please provide a detailed description (minimum 20 characters).'),
  category: z.string().min(1, 'Category is required'),
  agencyId: z.string().min(1, 'You must select an agency.'),
  location: z.string().optional(),
  submitterName: z.string().optional(),
  submitterEmail: z.string().email('Please enter a valid email address.').optional().or(z.literal('')),
  submitter_phone: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

// Schema for the form on the client-side, which includes the file input
export const grievanceFormSchema = baseGrievanceSchema.extend({
    image: z
        .any()
        .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
        .refine(
            (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
        .optional(),
    imageUrl: z.string().url("Please enter a valid URL that starts with http:// or https://").optional().or(z.literal('')),
}).superRefine((data, ctx) => {
    if (!data.isAnonymous) {
        if (!data.submitterName || data.submitterName.trim().length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Full Name is required for non-anonymous submissions.",
                path: ["submitterName"],
            });
        }
        if (!data.submitterEmail) {
             ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "A valid email is required for non-anonymous submissions.",
                path: ["submitterEmail"],
            });
        }
    }
});


// Schema for the server-side action, which doesn't handle the 'image' field directly
// but still needs the same conditional validation for submitter info.
export const grievanceActionSchema = baseGrievanceSchema.extend({
    imageUrl: z.string().url().optional().or(z.literal('')),
}).superRefine((data, ctx) => {
    if (!data.isAnonymous) {
        if (!data.submitterName || data.submitterName.trim().length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Full Name is required for non-anonymous submissions.",
                path: ["submitterName"],
            });
        }
        if (!data.submitterEmail) {
             ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "A valid email is required for non-anonymous submissions.",
                path: ["submitterEmail"],
            });
        }
    }
});
    