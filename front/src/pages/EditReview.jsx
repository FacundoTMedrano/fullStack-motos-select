import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import keys from "../constants/keysReviewForm";
import zodSchema from "../schemas/reviewForm";
import espaciado from "../utils/espaciado";

export default function EditarReview() {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();
    const { id } = useParams();
    const navigate = useNavigate();
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
                queryKey: ["reviews", "all"],
            });
            queryClient.invalidateQueries({
                queryKey: ["review", "edit", id],
            });
            navigate(`/${role}/reviews`);
        },
    });

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(zodSchema),
        values: reviewQuery.data,
    });

    if (reviewQuery.isLoading) {
        return <div>Cargando...</div>;
    }

    if (reviewQuery.isError) {
        return <p>error en el dato</p>;
    }

    return (
        <div className="signed-review-edit-single">
            <div className="contenedor">
                <h1>Editar Review</h1>
                <form onSubmit={handleSubmit(enviar.mutate)}>
                    <div className="valor-texto">
                        <label htmlFor="opinionPositiva">
                            Opinion Positiva
                        </label>
                        <textarea
                            id="opinionPositiva"
                            type="text"
                            rows={4}
                            {...register("opinionPositiva")}
                        />
                        {errors?.opinionPositiva?.message && (
                            <p>{errors.opinionPositiva.message}</p>
                        )}
                    </div>
                    <div className="valor-texto">
                        <label htmlFor="opinionNegativa">
                            Opinion Negativa
                        </label>
                        <textarea
                            id="opinionNegativa"
                            rows={4}
                            type="text"
                            {...register("opinionNegativa")}
                        />
                        {errors?.opinionNegativa?.message && (
                            <p>{errors.opinionNegativa.message}</p>
                        )}
                    </div>
                    {keys.map((v) => {
                        //numeros
                        return (
                            <div className="valor-range" key={v}>
                                <label htmlFor={v}>{espaciado(v)}</label>
                                <div>
                                    <input
                                        id={v}
                                        type="range"
                                        max={10}
                                        min={0}
                                        {...register(v, {
                                            valueAsNumber: true,
                                        })}
                                    />
                                    <p>{watch(v)}</p>
                                    {errors?.[v]?.message && (
                                        <p>{errors[v].message}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <div className="botones">
                        <button disabled={enviar.isPending} type="submit">
                            enviar
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/${role}/reviews`)}
                        >
                            cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
