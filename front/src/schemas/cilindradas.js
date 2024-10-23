import * as z from "zod";

export default z
    .object({
        cilindrada: z.string().min(1, { message: "debe tener un nombre" }),
        max: z.number({ message: "debe llevar un numero" }).optional(),

        min: z
            .number({ message: "debe llevar un numero" })
            .min(1, { message: "debe llevar un numero y ser mayor a 1" }),
    })
    .refine(
        (v) => {
            return v.max > v.min;
        },
        { message: "max debe ser mayor", path: ["min"] }
    );
