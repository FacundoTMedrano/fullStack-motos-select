import z from "zod";

const mecanicaSchema = z.object({
    Motor: z.string(),
    Cilindrada: z.string(),
    "Potencia máxima": z.string(),
    "Velocidad máxima": z.string(),
    Alimentación: z.string(),
    Encendido: z.string(),
    Arranque: z.string(),
    Transmisión: z.string(),
    Tracción: z.string(),
});

const configuracionSchema = z.object({
    Colores: z.array(z.string()),
    "Faro Delantero": z.string(),
    Llantas: z.string(),
    "Frenos D / T": z.string(),
    "Neumático Delantero": z.string(),
    "Neumático Trasero": z.string(),
    "Suspensión Delantera": z.string(),
    "Suspensión Trasera": z.string(),
    "Largo / Ancho / Alto": z.string(),
    "Distancia entre Ejes": z.string(),
    Peso: z.string(),
    "Capacidad de Carga": z.string(),
    "Capacidad del Tanque": z.string(),
    "Consumo y Autonomía": z.string(),
    "Puerto USB": z.string(),
    "Altura del Asiento": z.string(),
    Equipamiento: z.string(),
    "Tipo de Batería": z.string(),
    "Cantidad de Baterías": z.string(),
    "Tiempo de Carga": z.string(),
});

const garantiaSchema = z.object({
    Cobertura: z.string(),
    Origen: z.string(),
});

export const FichaTecnicaSchema = z.object({
    mecanica: mecanicaSchema.partial().optional(),
    configuracion: configuracionSchema.partial().optional(),
    garantia: garantiaSchema.partial().optional(),
    imagenes: z.array(z.string()).min(1),
});

export const fichaUpdatechema = z.object({
    _id: z.string(),
    mecanica: mecanicaSchema.partial().optional(),
    configuracion: configuracionSchema.partial().optional(),
    garantia: garantiaSchema.partial().optional(),
    imagenes: z.array(z.string()).min(1),
});

export function validateUpdate(input) {
    return fichaUpdatechema.safeParse(input);
}

export function validateCreate(input) {
    return FichaTecnicaSchema.safeParse(input);
}

export function safeValidateFichaTecnica(input) {
    return FichaTecnicaSchema.safeParse(input);
}
