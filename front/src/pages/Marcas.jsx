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
        <div>
            <div>
                <ul>
                    {marcas.map((v) => {
                        const valorMarca = v.marca.replace(" ", "_");
                        return (
                            <div key={v._id}>
                                <Link to={`marca/${valorMarca}`}>
                                    <img
                                        src={`${base}/imgs/basics/${v.img}`}
                                        alt={v.marca}
                                    />
                                </Link>
                            </div>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
