import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import PropTypes from "prop-types";
import { useState } from "react";
import { base } from "../rutas";
import validarImagen from "../utils/validarImagen";

export default function MarcasEditForm({
    marca: { marca, _id, img },
    setEditarId,
}) {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    const [imagenFile, setImagenFile] = useState(null);
    const [imagen, setImagen] = useState(`${base}/imgs/basics/${img}`);
    const [imagenError, setImagenError] = useState(null);

    const {
        handleSubmit,
        formState: { errors },
        register,
    } = useForm({ defaultValues: { marca } });

    const update = useMutation({
        mutationFn: async (data) => {
            await axiosPrivate.patch(`marcas/${_id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        },
        onError: (error) => {
            console.log(error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["marcas"] });
            setEditarId(null);
        },
    });

    function verificarImagen(e) {
        const file = e.target.files[0];
        const error = validarImagen(file);
        if (error) {
            setImagenError(error);
            return;
        }
        const imagen = URL.createObjectURL(file);
        setImagen(imagen);
        setImagenFile(file);

        setImagenError("");
    }

    async function actualizar({ marca }) {
        if (!imagen) {
            setImagenError("debe cargar una imagen");
            return;
        }
        const formData = new FormData();
        formData.append("marca", marca);
        if (imagenFile) {
            formData.append("imagen", imagenFile);
        }
        update.mutate(formData);
    }

    return (
        <form onSubmit={handleSubmit(actualizar)}>
            <img src={imagen} style={{ width: "150px" }} />
            <input type="file" onChange={verificarImagen} />
            {imagenError && <p>{imagenError}</p>}
            <input
                type="text"
                placeholder="marca"
                {...register("marca", {
                    required: "debe llenar el campo",
                })}
            />
            {errors?.marca && <p>{errors.marca.message}</p>}
            <button type="submit">actualizar</button>
            <button type="button" onClick={() => setEditarId(null)}>
                cancelar
            </button>
        </form>
    );
}

MarcasEditForm.propTypes = {
    marca: PropTypes.shape({
        marca: PropTypes.string,
        _id: PropTypes.string,
        img: PropTypes.string,
    }),
    setEditarId: PropTypes.func,
};
