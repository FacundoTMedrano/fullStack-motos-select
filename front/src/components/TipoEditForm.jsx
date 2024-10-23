import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import PropTypes from "prop-types";
import { useId } from "react";

export default function TipoEditForm({ tipo: { estilo, _id }, setEditarId }) {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();
    const idHook = useId();

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
        <div className="casilla-form">
            <form onSubmit={handleSubmit(actualizar.mutate)}>
                <div className="valores-input">
                    <label htmlFor={idHook}>Tipo:</label>
                    <input
                        id={idHook}
                        type="text"
                        {...register("estilo", {
                            required: "debe llenar el campo",
                            maxLength: "maximo debe ser 20",
                        })}
                    />
                    {errors?.estilo && <p>{errors.estilo.message}</p>}
                </div>
                <div className="botones">
                    <button onClick={() => setEditarId("")}>cancelar</button>
                    <button type="submit" disabled={actualizar.isPending}>
                        actualizar
                    </button>
                </div>
            </form>
        </div>
    );
}

TipoEditForm.propTypes = {
    tipo: PropTypes.shape({ estilo: PropTypes.string, _id: PropTypes.string }),
    setEditarId: PropTypes.func,
};
