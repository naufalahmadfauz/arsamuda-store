import {z} from "zod"


export const newPasswordSchema = z.object({
    password: z.string().min(8, {
        message: "Password minimal 8 karakter"
    }),
    token: z.string().nullable().optional(),
})