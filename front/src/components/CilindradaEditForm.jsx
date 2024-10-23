import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import zodSchema from "../schemas/cilindradas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import PropTypes from "prop-types";
import { useId } from "react";

export default function CilindradaEditForm({
    cilindrada: { cilindrada, min, max, _id },
    setEditarId,
}) {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();
    const idHook = useId();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: { cilindrada, min, max },
        resolver: zodResolver(zodSchema),
    });

    const actualizar = useMutation({
        mutationFn: async (data) => {
            await axiosPrivate.put(`cilindradas/${_id}`, data);
        },
        onError: (error) => {
            console.log(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cilindradas"] });
            setEditarId("");
        },
    });

    return (
        <div className="formulario">
            <form onSubmit={handleSubmit(actualizar.mutate)}>
                <div className="input-box">
                    <label htmlFor={`${idHook}-cilindrada`}>Titulo</label>
                    <input
                        id={`${idHook}-cilindrada`}
                        type="text"
                        {...register("cilindrada")}
                    />
                    {errors?.cilindrada?.message && (
                        <p>{errors.cilindrada.message}</p>
                    )}
                </div>
                <div className="input-box">
                    <label htmlFor={`${idHook}-min`}>Valor Minimo</label>
                    <input
                        id={`${idHook}-min`}
                        type="number"
                        {...register("min", { valueAsNumber: true })}
                    />
                    {errors?.min?.message && <p>{errors.min.message}</p>}
                </div>
                <div className="input-box">
                    <label htmlFor={`${idHook}-max`}>Valor Maximo</label>
                    <input
                        id={`${idHook}-max`}
                        type="number"
                        {...register("max", { valueAsNumber: true })}
                    />
                    {errors?.max?.message && <p>{errors.max.message}</p>}
                </div>
                <div className="botones">
                    <button type="button" onClick={() => setEditarId("")}>
                        cancelar
                    </button>
                    <button type="submit">actualizar</button>
                </div>
            </form>
        </div>
    );
}

CilindradaEditForm.propTypes = {
    cilindrada: PropTypes.shape({
        cilindrada: PropTypes.string,
        min: PropTypes.number,
        max: PropTypes.number,
        _id: PropTypes.string,
    }),
    setEditarId: PropTypes.func,
};
