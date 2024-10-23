import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "../services/api";
import { useParams, Link } from "react-router-dom";
import useContexto from "../hooks/useContexto";
import { useEffect } from "react";
import { base } from "../rutas";

export default function MotosPorEstilo() {
    const estilo = useParams().estilo.replace(/_/g, " "); //leo el estilo en el param

    const { setSelectCaract, setListaOpcionesMotos } = useContexto();

    const { data: motos } = useQuery({
        queryKey: ["motos"],
        queryFn: async () => {
            const { data } = await axiosPublic("motos");
            return data;
        },
        refetchOnWindowFocus: false,
    });

    const { data: estilos } = useQuery({
        queryKey: ["estilos"],
        queryFn: async () => {
            const { data } = await axiosPublic("estilos");
            return data;
        },
        refetchOnWindowFocus: false,
    });

    const elementoEstilo = estilos.find(
        (v) => v.estilo.toLowerCase() === estilo.toLowerCase()
    );

    //este useEffect se ejecuta despues del renderizado
    useEffect(() => {
        if (elementoEstilo) {
            setSelectCaract(JSON.stringify({ grupo: "estilo", valor: estilo }));
            setListaOpcionesMotos(motosPorEstilo);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [estilo]);

    if (!elementoEstilo) {
        return <div>estilo no encontrado</div>;
    }

    const motosPorEstilo = motos.filter((v) => v.estilo === elementoEstilo._id);

    if (motosPorEstilo.length === 0) {
        return <div>Motos no encontradas</div>;
    }

    return (
        <div className="motosPorEstilo">
            <h1>Motos por Estilo</h1>
            <ul>
                {motosPorEstilo.map((v) => {
                    const imgBig = `${base}/imgs/big/${v.img}`;
                    const imgMedium = `${base}/imgs/medium/${v.img}`;
                    const nombre = v.nombre.replace(" ", "_");

                    return (
                        <li key={v._id}>
                            <Link to={`/ficha_tecnica/${nombre}`}>
                                <img
                                    src={imgBig}
                                    srcSet={`${imgMedium} 500w,${imgBig} 1000w`}
                                />
                                <h2>{v.nombre}</h2>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
