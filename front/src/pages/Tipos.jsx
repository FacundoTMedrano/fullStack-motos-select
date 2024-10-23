import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState } from "react";
import TipoEditForm from "../components/TipoEditForm";

export default function Tipos() {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    const [editarId, setEditarId] = useState("");

    const tipos = useQuery({
        queryKey: ["estilos"],
        queryFn: async () => {
            const { data } = await axiosPrivate("estilos");
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
            await axiosPrivate.post("estilos", data);
        },
        onError: (error) => {
            console.log(error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["estilos"] });
            reset();
        },
    });

    const eliminar = useMutation({
        mutationFn: async (id) => {
            await axiosPrivate.delete(`estilos/${id}`);
        },
        onError: (error) => {
            console.log(error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["estilos"] });
        },
    });

    if (tipos.isLoading) {
        return <div>cargando...</div>;
    }

    if (tipos.isError) {
        return <p>error</p>;
    }

    return (
        <div className="tipos-page">
            <div className="form">
                <div className="contenedor">
                    <h1>Agrega un nuevo tipo de moto</h1>
                    <form onSubmit={handleSubmit(crear.mutate)}>
                        <div>
                            <label htmlFor="tipo">Tipo de Moto</label>
                            <input
                                id="tipo"
                                type="text"
                                {...register("estilo", {
                                    required: "debe llenar el campo",
                                    maxLength: "maximo debe ser 20",
                                })}
                            />
                            {errors?.estilo && <p>{errors.estilo.message}</p>}
                        </div>
                        <button type="submit">crear</button>
                    </form>
                </div>
            </div>
            <div className="casillas">
                {tipos.data.map((v) => {
                    if (v._id === editarId) {
                        return (
                            <TipoEditForm
                                key={v._id}
                                tipo={v}
                                setEditarId={setEditarId}
                            />
                        );
                    } else {
                        return (
                            <div key={v._id} className="casilla-dato">
                                <div className="valor">
                                    <p>Tipo:</p>
                                    <p>{v.estilo}</p>
                                </div>
                                <div className="botones">
                                    <button onClick={() => setEditarId(v._id)}>
                                        editar
                                    </button>
                                    <button
                                        onClick={() => eliminar.mutate(v._id)}
                                    >
                                        eliminar
                                    </button>
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
}
