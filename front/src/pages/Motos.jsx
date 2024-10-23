import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState } from "react";
import { base } from "../rutas";
import { useNavigate } from "react-router-dom";

export default function Motos() {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [selectMarca, setSelectMarca] = useState("");

    const marcas = useQuery({
        queryKey: ["marcas"],
        queryFn: async () => {
            const { data } = await axiosPrivate("marcas");
            return data;
        },
        refetchOnWindowFocus: false,
    });

    const motos = useQuery({
        queryKey: ["motos"],
        queryFn: async () => {
            const { data } = await axiosPrivate("motos");
            return data;
        },
        refetchOnWindowFocus: false,
    });

    const eliminar = useMutation({
        mutationFn: async (id) => {
            await axiosPrivate.delete(`motos/${id}`);
        },
        onError: (error) => {
            console.log(error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["motos"] });
            console.log("success");
        },
    });

    if (marcas.isLoading || motos.isLoading) {
        return <div>cargando...</div>;
    }
    if (marcas.isError || motos.isError) {
        return <div>error</div>;
    }

    let motosFiltradas;
    if (selectMarca === "") {
        motosFiltradas = [];
    } else {
        motosFiltradas = motos.data.filter((v) => v.marca === selectMarca);
    }

    return (
        <div className="ver-y-editar-motos-page">
            <h1>Ver y Editar Motos</h1>
            <div className="crear-select">
                <button onClick={() => navigate("crear")}>crear moto</button>
                <select onChange={(e) => setSelectMarca(e.target.value)}>
                    <option value="">selecciona una marca</option>
                    {marcas.data.map((v) => {
                        return (
                            <option key={v._id} value={v._id}>
                                {v.marca}
                            </option>
                        );
                    })}
                </select>
            </div>
            {selectMarca === "" && (
                <div className="casilla-sin-marca">
                    <h2>Selecciona una marca para poder verla</h2>
                </div>
            )}

            <div className="contenedor">
                {motosFiltradas.map((v) => {
                    const imgBig = `${base}/imgs/big/${v.img}`;
                    const imgMedium = `${base}/imgs/medium/${v.img}`;
                    return (
                        <div className="casilla" key={v._id}>
                            <img
                                src={imgBig}
                                srcSet={`${imgMedium} 500w,${imgBig} 1000w`}
                            />
                            <p>{v.nombre}</p>
                            <div className="botones">
                                <button onClick={() => navigate(v._id)}>
                                    editar
                                </button>
                                <button onClick={() => eliminar.mutate(v._id)}>
                                    delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
