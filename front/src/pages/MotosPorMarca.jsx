import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "../services/api";
import { useParams } from "react-router-dom";
import useContexto from "../hooks/useContexto";
import { useEffect } from "react";
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
        refetchOnMount: false,
        staleTime: Infinity,
    });

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

    const marcaElemento = marcas.find(
        (v) => v.marca.toLowerCase() === marca.toLowerCase()
    );
    //este useEffect se ejecuta al final de toda la funcion
    //pero siempre debe estar por lo que no puede ir dentro de un condicional
    useEffect(() => {
        if (marcaElemento) {
            const obj = { grupo: "marca", valor: marcaElemento.marca };
            setSelectCaract(JSON.stringify(obj));
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
        <div>
            {motosElementos.map((v) => {
                return <div key={v._id}>{v.nombre}</div>;
            })}
        </div>
    );
}
