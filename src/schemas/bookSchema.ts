
import { z } from "zod";
import fromZodSchema from "zod-to-json-schema";


export const bookSchema = z.object({
  title: z.string().min(1).max(255),
  author: z.string().min(1).max(255),
});
export type BookInput = z.infer<typeof bookSchema>; // For TypeScript type safety

// Convert Zod schema to JSON Schema
export const bookJsonSchema = fromZodSchema(bookSchema);
