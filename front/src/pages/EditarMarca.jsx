import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useRef, useEffect } from "react";
import validarImagen from "../utils/validarImagen";
import { base } from "../rutas";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarMarca() {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();
    const inputFileRef = useRef();

    const navigate = useNavigate();
    const { id } = useParams();

    const [imagenFile, setImagenFile] = useState(null);
    const [imagen, setImagen] = useState(null);
    const [imagenError, setImagenError] = useState(null);

    const marca = useQuery({
        queryKey: ["marcas", id],
        queryFn: async () => {
            const { data } = await axiosPrivate(`marcas/${id}`);
            return data;
        },
        refetchOnWindowFocus: false,
    });

    const {
        handleSubmit,
        formState: { errors },
        register,
    } = useForm({ values: marca.data });

    const update = useMutation({
        mutationFn: async (data) => {
            await axiosPrivate.patch(`marcas/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        },
        onError: (error) => {
            console.log(error);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["marcas"] });
            navigate(`/admin/marcas`);
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

    useEffect(() => {
        if (marca.isSuccess) {
            setImagen(`${base}/imgs/basics/${marca.data.img}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [marca.isSuccess]);

    if (marca.isLoading) {
        return <div>cargando</div>;
    }

    if (marca.isError) {
        return <div>review no encontrado</div>;
    }

    return (
        <div className="contenedor-form">
            <h1>Ver, editar y crear marcas </h1>
            <form onSubmit={handleSubmit(actualizar)}>
                <div className="imagen-box">
                    <div className="imagen">
                        {imagen && <img src={imagen} />}
                        {!imagen && <p>Sin Imagen</p>}
                    </div>
                    {imagenError && <p>{imagenError}</p>}
                    <div className="botones">
                        <button
                            type="button"
                            onClick={() => inputFileRef.current.click()}
                        >
                            Cambiar imagen
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
                    <button type="submit">Actualizar</button>
                </div>
            </form>
        </div>
    );
}
