import {email, z} from "zod";

export const Signup = z.object({
    name: z.string().min(2).max(25),
    email: email(),
    password: z.string().min(6).max(30)
});

export const Signin = z.object({
    email: email(),
    password: z.string().min(6).max(30)
});
