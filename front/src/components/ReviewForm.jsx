import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import zodSchema from "../schemas/reviewForm.js";
// import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import reviewFormDefaultVal from "../constants/reviewFormDefaultVal.js";
import keys from "../constants/keysReviewForm.js";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa6";
import espaciado from "../utils/espaciado.js";

export default function ReviewForm({ moto }) {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: reviewFormDefaultVal,
        resolver: zodResolver(zodSchema),
    });

    // const miReview = useQuery({
    //     queryKey: ["reviews", "mi_review", moto._id],
    //     queryFn: async () => {
    //         const { data } = await axiosPrivate(
    //             `reviews/review-from-moto/${moto._id}`
    //         );
    //         console.log(data);
    //         return data;
    //     },
    //     retry: 1,
    //     refetchOnWindowFocus: false,
    // });

    const enviarForm = useMutation({
        mutationFn: async (datos) => {
            const { data } = await axiosPrivate.post("reviews/create", {
                ...datos,
                moto: moto._id,
                marca: moto.marca,
            });
            console.log(data);
        },
        onError: (error) => {
            console.log(error.message);
        },
        onSuccess: () => {
            //cambiar esto a que no invalide, por que tiene que ser aceptado por el admin primero
            queryClient.invalidateQueries({
                queryKey: ["reviews", "mi_review", moto._id],
            });
            queryClient.invalidateQueries({
                queryKey: ["reviews"],
            });
        },
    });

    //si retorna un error quiere decir que no tiene review, estoy pidiendo mi review en base a mi token
    // creo que deberia ser distinto

    // if (miReview.isSuccess) {
    //     return (
    //         <div>
    //             <h3>Ya realizaste tu review</h3>
    //             <p>Debes esperar a que sea aceptado</p>
    //         </div>
    //     );
    // }

    return (
        <div className="component-reviews-Form">
            <form onSubmit={handleSubmit(enviarForm.mutate)}>
                <div className="review-aspecto-a-favor">
                    <label htmlFor="opinionPositiva">
                        <FaRegThumbsUp className="icon-thumb-up" />
                        aspecto a favor
                    </label>
                    <textarea
                        id="opinionPositiva"
                        rows={4}
                        {...register("opinionPositiva")}
                    />
                    {errors?.opinionPositiva?.message && (
                        <p>{errors.opinionPositiva.message}</p>
                    )}
                </div>
                <div className="review-aspecto-en-contra">
                    <label htmlFor="opinionNegativa">
                        <FaRegThumbsDown className="icon-thumb-down" />
                        aspecto en contra
                    </label>
                    <textarea
                        id="opinionNegativa"
                        rows={4}
                        {...register("opinionNegativa")}
                    />
                    {errors?.opinionNegativa?.message && (
                        <p>{errors.opinionNegativa.message}</p>
                    )}
                </div>
                <div className="review-calificaciones">
                    <h3>Calificacion del 1 al 10</h3>
                    {keys.map((v) => {
                        return (
                            <div className="form-range-review" key={v}>
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
                                    <span className="reviews-form-puntaje">
                                        {watch(v)}
                                    </span>
                                </div>
                                {errors?.[v] && <p>{errors[v].message}</p>}
                            </div>
                        );
                    })}
                </div>
                <button
                    className="ficha-review-form-boton-enviar"
                    disabled={enviarForm.isPending || enviarForm.isSuccess}
                >
                    enviar
                </button>
            </form>
        </div>
    );
}

ReviewForm.propTypes = {
    moto: PropTypes.shape({
        nombre: PropTypes.string,
        marca: PropTypes.string,
        img: PropTypes.string,
        fichaTecnica: PropTypes.string,
        _id: PropTypes.string,
        cilindrada: PropTypes.number,
    }),
};
