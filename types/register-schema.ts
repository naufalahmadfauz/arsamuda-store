import * as z from "zod";

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8,{
        message:"Password minimal 8 karakter"
    }),
    name: z.string().min(3,{message:"Nama minimal 3 karakter"})
})