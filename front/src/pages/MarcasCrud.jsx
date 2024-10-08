import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { base } from "../rutas";
import { useState } from "react";
import MarcasEditForm from "../components/MarcasEditForm";
import validarImagen from "../utils/validarImagen";

export default function MarcasCrud() {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    const [editarId, setEditarId] = useState("");
    const [imagenFile, setImagenFile] = useState(null);
    const [imagen, setImagen] = useState(null);
    const [imagenError, setImagenError] = useState(null);

    const marcas = useQuery({
        queryKey: ["marcas"],
        queryFn: async () => {
            const { data } = await axiosPrivate("marcas");
            return data;
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });

    const {
        handleSubmit,
        formState: { errors },
        register,
        reset,
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
            setImagen(null);
            setImagenFile(null);
            reset();
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

    const eliminar = useMutation({
        mutationFn: async (id) => {
            await axiosPrivate.delete(`marcas/${id}`);
        },
        onError: (error) => {
            console.log(error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["marcas"] });
            setImagen(null);
            setImagenError(null);
            setImagenFile(null);
        },
    });

    async function enviarDatos({ marca }) {
        if (!imagen) {
            setImagenError("debe cargar una imagen");
            return;
        }
        const formData = new FormData();
        formData.append("marca", marca);
        formData.append("imagen", imagenFile);
        crear.mutate(formData);
    }

    if (marcas.isLoading) {
        return <div>cargando...</div>;
    }

    if (marcas.isError) {
        return <p>error</p>;
    }

    return (
        <div>
            <form onSubmit={handleSubmit(enviarDatos)}>
                {imagen && <img src={imagen} style={{ width: "150px" }} />}

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
                <button type="submit">crear</button>
            </form>
            {marcas.data.map((v) => {
                if (v._id === editarId) {
                    return (
                        <MarcasEditForm
                            key={v._id}
                            marca={v}
                            setEditarId={setEditarId}
                        />
                    );
                } else {
                    return (
                        <div key={v._id}>
                            <img
                                src={`${base}/imgs/basics/${v.img}`}
                                style={{ width: "150px" }}
                            />
                            <p>{v.marca}</p>
                            <button onClick={() => setEditarId(v._id)}>
                                editar
                            </button>
                            <button onClick={() => eliminar.mutate(v._id)}>
                                eliminar
                            </button>
                        </div>
                    );
                }
            })}
        </div>
    );
}
