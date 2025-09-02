import {email, z} from "zod";

export const Signup = z.object({
    username: z.string().min(2).max(25),
    email: email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters long"}).max(30, {message: "Password must be at most 30 characters long"})
});

export const Signin = z.object({
    email: email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters long"}).max(30, {message: "Password must be at most 30 characters long"})
});
