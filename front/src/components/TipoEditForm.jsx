import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import PropTypes from "prop-types";

export default function TipoEditForm({ tipo: { estilo, _id }, setEditarId }) {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    const {
        handleSubmit,
        formState: { errors },
        register,
    } = useForm({ defaultValues: { estilo } });

    const actualizar = useMutation({
        mutationFn: async (data) => {
            await axiosPrivate.put(`estilos/${_id}`, data);
        },
        onError: (error) => {
            console.log(error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["estilos"] });
            setEditarId("");
        },
    });

    return (
        <form onSubmit={handleSubmit(actualizar.mutate)}>
            <input
                type="text"
                {...register("estilo", {
                    required: "debe llenar el campo",
                    maxLength: "maximo debe ser 20",
                })}
            />
            {errors?.estilo && <p>{errors.estilo.message}</p>}
            <button onClick={() => setEditarId("")}>cancelar</button>
            <button disabled={actualizar.isPending}>actualizar</button>
        </form>
    );
}

TipoEditForm.propTypes = {
    tipo: PropTypes.shape({ estilo: PropTypes.string, _id: PropTypes.string }),
    setEditarId: PropTypes.func,
};
