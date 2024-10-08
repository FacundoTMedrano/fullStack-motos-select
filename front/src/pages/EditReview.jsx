import { Fragment } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import keys from "../constants/keysReviewForm";
import zodSchema from "../schemas/reviewForm";
import { useEffect } from "react";

export default function EditarReview() {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();
    const { id } = useParams();
    const navi = useNavigate();
    const {
        auth: { role },
    } = useAuth();

    const reviewQuery = useQuery({
        queryKey: ["review", "edit", id],
        queryFn: async () => {
            const { data } = await axiosPrivate(`reviews/get-review/${id}`);
            return data;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
    });

    const enviar = useMutation({
        mutationFn: async (data) => {
            await axiosPrivate.patch(`reviews/update/${id}`, data);
        },
        onError: (error) => {
            console.log(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["reviews"],
            });
            queryClient.invalidateQueries({
                queryKey: ["review", "edit", id],
            });
        },
    });

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(zodSchema),
    });

    useEffect(() => {
        if (reviewQuery.data) {
            reset(reviewQuery.data);
        }
    }, [reviewQuery.data, reset]);

    if (reviewQuery.isLoading) {
        return <div>Cargando...</div>;
    }

    if (reviewQuery.isError) {
        return <p>error en el dato</p>;
    }

    return (
        <form
            onSubmit={handleSubmit(enviar.mutate)}
            style={{ display: "flex", flexDirection: "column" }}
        >
            <>
                <input type="text" {...register("opinionPositiva")} />
                {errors?.opinionPositiva?.message && (
                    <p>{errors.opinionPositiva.message}</p>
                )}
                <input type="text" {...register("opinionNegativa")} />
                {errors?.opinionNegativa?.message && (
                    <p>{errors.opinionNegativa.message}</p>
                )}
                {keys.map((v) => {
                    //numeros
                    return (
                        <Fragment key={v}>
                            <input
                                type="range"
                                max={10}
                                min={0}
                                {...register(v, {
                                    valueAsNumber: true,
                                })}
                            />
                            <p>{watch(v)}</p>
                            {errors?.[v]?.message && <p>{errors[v].message}</p>}
                        </Fragment>
                    );
                })}
            </>
            {enviar.isSuccess && <p>correctamente actualizado</p>}
            {!enviar.isPending && <button type="submit">enviar</button>}
            <button onClick={() => navi(`/${role}/reviews`)}>cancelar</button>
        </form>
    );
}
