import z from "zod";

export const cilindradaSchema = z
    .object({
        cilindrada: z.string(),
        max: z.number().min(0),
        min: z.number().min(0),
    })
    .refine((data) => data.max > data.min, {
        message: "maxima debe ser mayor que minima",
    });

export function Validatesafe(input) {
    return cilindradaSchema.safeParse(input);
}
