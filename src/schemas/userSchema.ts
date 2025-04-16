// schemas/userSchema.ts
import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().min(1, "Título é obrigatório"),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória").max(8, "Senha deve ter no máximo 8 caracteres"),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória").max(8, "Senha deve ter no máximo 8 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"], 
  });;

export type userFormData = z.infer<typeof userFormSchema>;