import * as z from "zod";

export default z.object({
    motor: z.number().min(0).max(10),
    velocidadMaxima: z.number().min(0).max(10),
    armadoYTerminaciones: z.number().min(0).max(10),
    equipamientoEInstrumental: z.number().min(0).max(10),
    bateriasYRecarga: z.number().min(0).max(10),
    consumoYAutonimia: z.number().min(0).max(10),
    neumaticos: z.number().min(0).max(10),
    frenos: z.number().min(0).max(10),
    luces: z.number().min(0).max(10),
    costoDeMantenimiento: z.number().min(0).max(10),
    opinionPositiva: z.string().max(500).min(1,"debe de tener una opinion"),
    opinionNegativa: z.string().max(500),
});
