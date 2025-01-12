import * as z from "zod"


export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email tidak valid"
    }),
    password: z.string().min(8, {
        message: "Password minimal 8 karakter"
    }),
    code:z.optional(z.string())
})