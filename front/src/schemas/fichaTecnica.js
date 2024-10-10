import { z } from "zod";

const mecanicaSchema = z.object({
    Motor: z.string().min(1, "campo requerido"),
    Cilindrada: z.number({ message: "se requiere un numero" }).min(1),
    "Potencia máxima": z.string(),
    "Velocidad máxima": z.string(),
    Alimentación: z.string(),
    Encendido: z.string(),
    Arranque: z.string(),
    Transmisión: z.string(),
    Tracción: z.string(),
});

const configuracionSchema = z.object({
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

const motoSchema = z.object({
    nombre: z.string().min(1, "campo requerido"),
    marca: z.string().min(1, "marca requerida"),
    estilo: z.string().optional(),
});

export default z.object({
    moto: motoSchema.partial(),
    mecanica: mecanicaSchema.partial(),
    configuracion: configuracionSchema.partial(),
});
