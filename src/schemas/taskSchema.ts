// schemas/taskSchema.ts
import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  laneId: z.string().min(1,"Lane inválida"),
  members: z.array(z.string()).optional(),
  order: z.number(),
  boardId: z.string().min(1, "Board inválido"),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;

