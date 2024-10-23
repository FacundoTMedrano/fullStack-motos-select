import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useRef } from "react";
import validarImagen from "../utils/validarImagen";
import { useNavigate } from "react-router-dom";

export default function CrearMarca() {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();
    const inputFileRef = useRef();
    const navigate = useNavigate();

    const [imagenFile, setImagenFile] = useState(null);
    const [imagen, setImagen] = useState(null);
    const [imagenError, setImagenError] = useState(null);

    const {
        handleSubmit,
        formState: { errors },
        register,
    } = useForm();

    const crear = useMutation({
        mutationFn: async (data) => {
            await axiosPrivate.post("marcas", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        },
        onError: (error) => {
            console.log(error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["marcas"] });
            // setImagen(null);
            // setImagenFile(null);
            // reset();
            navigate("/admin/marcas");
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

    async function enviarDatos({ marca }) {
        if (!imagen) {
            setImagenError("Debe cargar una imagen");
            return;
        }
        const formData = new FormData();
        formData.append("marca", marca);
        formData.append("imagen", imagenFile);
        crear.mutate(formData);
    }

    return (
        <div className="contenedor-form">
            <h1>Ver, editar y crear marcas </h1>
            <form onSubmit={handleSubmit(enviarDatos)}>
                <div className="imagen-box">
                    <div className="imagen">
                        {imagen && <img src={imagen} />}
                        {!imagen && <p>Sin Imagen</p>}
                    </div>
                    {imagenError && <p>{imagenError}</p>}
                    <div className="botones">
                        {imagen && (
                            <button
                                onClick={() => {
                                    setImagen(null);
                                    setImagenError(null);
                                    setImagenFile(null);
                                }}
                            >
                                Cancelar imagen
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => inputFileRef.current.click()}
                        >
                            {!imagen ? "Cargar Imagen" : "Cambiar imagen"}
                        </button>
                    </div>
                </div>

                <input
                    style={{ display: "none" }}
                    ref={inputFileRef}
                    type="file"
                    onChange={verificarImagen}
                />

                <div className="casilla-input">
                    <label htmlFor="marca-input">Nombre de Marca</label>
                    <input
                        id="marca-input"
                        type="text"
                        placeholder="marca"
                        {...register("marca", {
                            required: "Debe llenar el campo",
                        })}
                    />
                    {errors?.marca && <p>{errors.marca.message}</p>}
                </div>
                <div className="boton-crear">
                    <button type="submit">Crear</button>
                </div>
            </form>
        </div>
    );
}
