import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import zodSchema from "../schemas/cilindradas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import PropTypes from "prop-types";

export default function CilindradaEditForm({
    cilindrada: { cilindrada, min, max, _id },
    setEditarId,
}) {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

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
        <form onSubmit={handleSubmit(actualizar.mutate)}>
            <input type="text" required {...register("cilindrada")} />
            {errors?.cilindrada?.message && <p>{errors.cilindrada.message}</p>}
            <input
                type="number"
                required
                {...register("min", { valueAsNumber: true })}
            />
            {errors?.min?.message && <p>{errors.min.message}</p>}
            <input
                type="number"
                required
                {...register("max", { valueAsNumber: true })}
            />
            {errors?.max?.message && <p>{errors.max.message}</p>}
            <button type="submit">enviar</button>
            <button type="button" onClick={() => setEditarId("")}>
                cancelar
            </button>
        </form>
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
