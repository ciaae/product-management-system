import { z } from 'zod';

const isValidImageReference = (value: string) => {
  if (!value.trim()) return true;
  return /^(https?:\/\/|data:image\/)/i.test(value.trim());
};

const imageUrlSchema = z
  .union([
    z.string().trim().refine(isValidImageReference, 'Image must be a valid URL or data URL'),
    z.literal('')
  ])
  .optional()
  .transform((value) => (value === '' ? null : value));

export const createProductSchema = z.object({
  name: z
    .string({ required_error: 'Product name is required' })
    .trim()
    .min(1, 'Product name cannot be empty')
    .max(120, 'Product name is too long'),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(1, 'Description cannot be empty')
    .max(2000, 'Description is too long'),
  imageUrl: imageUrlSchema
});

export const productIdSchema = z.object({
  id: z.string().min(1, 'Product ID is required')
});
