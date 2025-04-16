// schemas/boardSchema.ts
import { z } from "zod";

export const boardFormSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  members: z.array(z.string()).optional(),
});

export type boardFormData = z.infer<typeof boardFormSchema>;