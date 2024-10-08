import * as z from "zod";

export default z
    .object({
        cilindrada: z.string(),
        max: z.number().min(0),
        min: z.number().min(0),
    })
    .refine(
        (v) => {
            return v.max > v.min;
        },
        { message: "max debe ser mayor", path: ["min"] }
    );
