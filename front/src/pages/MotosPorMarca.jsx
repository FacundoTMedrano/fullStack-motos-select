import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "../services/api";
import { useParams, Link } from "react-router-dom";
import useContexto from "../hooks/useContexto";
import { useEffect } from "react";
import { base } from "../rutas";

export default function MotosPorMarca() {
    const marca = useParams().marca.replace(/_/g, " "); //leo la marca en el param
    const { setSelectCaract, setListaOpcionesMotos } = useContexto();

    const { data: motos } = useQuery({
        queryKey: ["motos"],
        queryFn: async () => {
            const { data } = await axiosPublic("motos");
            return data;
        },
        refetchOnWindowFocus: false,
    });

    const { data: marcas } = useQuery({
        queryKey: ["marcas"],
        queryFn: async () => {
            const { data } = await axiosPublic("marcas");
            return data;
        },
        refetchOnWindowFocus: false,
    });

    const marcaElemento = marcas.find(
        (v) => v.marca.toLowerCase() === marca.toLowerCase()
    );
    //useEffect se ejecuta al final del renderizado por lo cual es como si estuviera abajo de motosElementos
    useEffect(() => {
        if (marcaElemento) {
            setSelectCaract(
                JSON.stringify({ grupo: "marca", valor: marcaElemento.marca })
            );
            setListaOpcionesMotos(motosElementos);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [marca]);

    if (!marcaElemento) {
        return <div>marca no encontrada</div>;
    }

    const motosElementos = motos.filter((v) => v.marca === marcaElemento._id);
    if (motosElementos.length === 0) {
        return (
            <div>
                <p>no hay motos aun para mostrar</p>
            </div>
        );
    }

    return (
        <div className="motosPorMarca">
            <h1>Motos por Marca</h1>
            <ul>
                {motosElementos.map((v) => {
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
