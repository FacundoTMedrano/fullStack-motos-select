import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import zodSchema from "../schemas/reviewForm.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { Fragment } from "react";
import reviewFormDefaultVal from "../constants/reviewFormDefaultVal.js";
import keys from "../constants/keysReviewForm.js";

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

    const enviarForm = useMutation({
        mutationFn: async (datos) => {
            const { data } = await axiosPrivate.post("reviews/create", {
                ...datos,
                moto: moto._id,
            });
            console.log(data);
        },
        onError: (error) => {
            console.log(error.message);
        },
        onSettled: () => {
            //cambiar esto a que no invalide, por que tiene que ser aceptado por el admin primero
            queryClient.invalidateQueries({ queryKey: ["reviews", moto._id] });
        },
    });

    return (
        <form
            onSubmit={handleSubmit(enviarForm.mutate)}
            style={{ display: "flex", flexDirection: "column" }}
        >
            <input type="text" {...register("opinionPositiva")} />
            {errors?.opinionPositiva?.message && (
                <p>{errors.opinionPositiva.message}</p>
            )}
            <input type="text" {...register("opinionNegativa")} />
            {errors?.opinionNegativa?.message && (
                <p>{errors.opinionNegativa.message}</p>
            )}
            {keys.map((v) => {
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
            <button disabled={enviarForm.isPending || enviarForm.isSuccess}>
                enviar
            </button>
        </form>
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
