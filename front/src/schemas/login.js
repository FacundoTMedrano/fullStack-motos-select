import z from "zod";

export default z.object({
    email: z
        .string()
        .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
        .max(40),
    password: z.string().max(25).min(5),
});
