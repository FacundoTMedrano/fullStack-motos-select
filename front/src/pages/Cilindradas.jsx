import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useForm } from "react-hook-form";
import { useState } from "react";
import CilindradaEditForm from "../components/CilindradaEditForm";

export default function Cilindradas() {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();

    const [editarId, setEditarId] = useState("");

    const cilindradasQuery = useQuery({
        queryKey: ["cilindradas"],
        queryFn: async () => {
            const { data } = await axiosPrivate("cilindradas");
            return data;
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        // resolver: zodResolver(zodSchema),
    });

    const crear = useMutation({
        mutationFn: async (data) => {
            await axiosPrivate.post("cilindradas", data);
        },
        onError: (error) => {
            console.log(error.message);
        },
        onSuccess: () => {
            reset();
            queryClient.invalidateQueries({ queryKey: ["cilindradas"] });
        },
    });

    const eliminar = useMutation({
        mutationFn: async (id) => {
            await axiosPrivate.delete(`cilindradas/${id}`);
        },
        onError: (error) => {
            console.log(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cilindradas"] });
        },
    });

    if (cilindradasQuery.isLoading) {
        return <div>cargando...</div>;
    }
    if (cilindradasQuery.isError) {
        return <div>error</div>;
    }

    return (
        <div className="crear-cilindrada-page">
            <div className="form-crear-cilindrada">
                <div className="contenedor">
                    <h1>Agregar Nuevo Dato</h1>
                    <form onSubmit={handleSubmit(crear.mutate)}>
                        <div>
                            <label htmlFor="titulo-crear">Titulo</label>
                            <input
                                id="titulo-crear"
                                type="text"
                                {...register("cilindrada", {
                                    required: "Debe tener nombre",
                                })}
                            />
                            {errors?.cilindrada?.message && (
                                <p>{errors.cilindrada.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="number-min-crear">
                                Valor Minimo
                            </label>
                            <input
                                id="number-min-crear"
                                type="number"
                                {...register("min", {
                                    required: "Debe tener un minimo",
                                    valueAsNumber: true,
                                })}
                            />
                            {errors?.min?.message && (
                                <p>{errors.min.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="number-max-crear">
                                Valor Maximo
                            </label>
                            <input
                                id="number-max-crear"
                                type="number"
                                {...register("max", {
                                    required: "debe tener un numero",
                                    validate: (v, formValues) => {
                                        if (formValues.min >= v) {
                                            return "max debe ser mayor a min";
                                        }
                                    },
                                    valueAsNumber: true,
                                })}
                            />
                            {errors?.max?.message && (
                                <p>{errors.max.message}</p>
                            )}
                        </div>
                        <button type="submit">Agregar</button>
                    </form>
                </div>
            </div>
            <div className="ver-editar-cilindradas">
                {cilindradasQuery.data.map((v) => {
                    if (editarId === v._id) {
                        return (
                            <CilindradaEditForm
                                key={v._id}
                                cilindrada={v}
                                setEditarId={setEditarId}
                            />
                        );
                    } else {
                        return (
                            <div key={v._id} className="casilla">
                                <div className="valores">
                                    <p>Titulo:</p>
                                    <p>{v.cilindrada}</p>
                                </div>
                                <div className="valores">
                                    <p>Valor Minimo:</p>
                                    <p>{v.max}</p>
                                </div>
                                <div className="valores">
                                    <p>Valor Maximo:</p>
                                    <p>{v.min}</p>
                                </div>
                                <div className="botones">
                                    <button onClick={() => setEditarId(v._id)}>
                                        editar
                                    </button>
                                    <button
                                        onClick={() => eliminar.mutate(v._id)}
                                    >
                                        eliminar
                                    </button>
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
}
