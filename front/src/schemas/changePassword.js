import * as z from "zod";
export default z
    .object({
        oldPassword: z.string(),
        newPassword: z.string().min(5).max(20),
        repetNewPassword: z.string(),
    })
    .refine(
        (val) => {
            return val.newPassword === val.repetNewPassword;
        },
        {
            message: "no coinciden las contraseñas",
            path: ["repetNewPassword"],
        }
    )
    .refine(
        (val) => {
            if (val.oldPassword !== val.newPassword) {
                return true;
            }
            return false;
        },
        {
            message: "la nueva contraseña debe ser distinta a la antigua",
            path: ["oldPassword"],
        }
    );
