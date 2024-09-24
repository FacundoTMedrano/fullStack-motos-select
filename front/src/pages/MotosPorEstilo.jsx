import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "../services/api";
import { useParams } from "react-router-dom";
import useContexto from "../hooks/useContexto";
import { useEffect } from "react";

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
        refetchOnMount: false,
        staleTime: Infinity,
    });

    const { data: estilos } = useQuery({
        queryKey: ["estilos"],
        queryFn: async () => {
            const { data } = await axiosPublic("estilos");
            return data;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
    });

    const elementoEstilo = estilos.find(
        (v) => v.estilo.toLowerCase() === estilo.toLowerCase()
    );

    //este useEffect se ejecuta al final de toda la funcion
    //pero siempre debe estar por lo que no puede ir dentro de un condicional
    useEffect(() => {
        if (elementoEstilo) {
            const obj = { grupo: "estilo", valor: estilo };
            setSelectCaract(JSON.stringify(obj));
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
        <div>
            {motosPorEstilo.map((v) => {
                return <div key={v._id}>{v.nombre}</div>;
            })}
        </div>
    );
}
