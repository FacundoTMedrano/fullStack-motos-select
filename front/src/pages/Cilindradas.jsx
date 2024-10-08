import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import zodSchema from "../schemas/cilindradas";
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
        resolver: zodResolver(zodSchema),
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
        <div>
            <div>
                <form onSubmit={handleSubmit(crear.mutate)}>
                    <input
                        type="text"
                        placeholder="titulo"
                        required
                        {...register("cilindrada")}
                    />
                    {errors?.cilindrada?.message && (
                        <p>{errors.cilindrada.message}</p>
                    )}
                    <input
                        type="number"
                        placeholder="min"
                        required
                        {...register("min", { valueAsNumber: true })}
                    />
                    {errors?.min?.message && <p>{errors.min.message}</p>}
                    <input
                        type="number"
                        placeholder="max"
                        required
                        {...register("max", { valueAsNumber: true })}
                    />
                    {errors?.max?.message && <p>{errors.max.message}</p>}
                    <button type="submit">enviar</button>
                </form>
            </div>
            <div>
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
                            <div
                                key={v._id}
                                style={{
                                    border: "1px solid black",
                                    margin: "5px",
                                }}
                            >
                                <p>titulo: {v.cilindrada}</p>
                                <p>max: {v.max}</p>
                                <p>min: {v.min}</p>
                                <button onClick={() => setEditarId(v._id)}>
                                    editar
                                </button>
                                <button onClick={() => eliminar.mutate(v._id)}>
                                    eliminar
                                </button>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
}
