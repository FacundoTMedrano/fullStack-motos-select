import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "../services/api";
import { Link } from "react-router-dom";
import { base } from "../rutas";
import { useEffect } from "react";
import useContexto from "../hooks/useContexto";

export default function Marcas() {
    const { data: marcas } = useQuery({
        queryKey: ["marcas"],
        queryFn: async () => {
            const { data } = await axiosPublic("marcas");
            return data;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
    });
    const { data: motos } = useQuery({
        queryKey: ["motos"],
        queryFn: async () => {
            const { data } = await axiosPublic("motos");
            return data;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
    });
    const { setListaOpcionesMotos } = useContexto();

    useEffect(() => {
        setListaOpcionesMotos(motos);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="marcasPage">
            <h1>Marcas de Motos</h1>
            <ul>
                {marcas.map((v) => {
                    const valorMarca = v.marca.replace(" ", "_");
                    return (
                        <li key={v._id}>
                            <Link to={`marca/${valorMarca}`}>
                                <img
                                    src={`${base}/imgs/basics/${v.img}`}
                                    alt={v.marca}
                                />
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
