import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "../services/api";
import { useParams } from "react-router-dom";
import useContexto from "../hooks/useContexto";
import { useEffect } from "react";

export default function MotosPorCilindrada() {
    const [min, max] = useParams()
        .cilindrada.split("-")
        .map((v) => Number(v)); //leo la marca en el param

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

    const motosCilindradas = motos.filter(
        (v) => v.cilindrada <= max && v.cilindrada >= min
    );

    //este useEffect se ejecuta al final de toda la funcion
    //pero siempre debe estar por lo que no puede ir dentro de un condicional
    useEffect(() => {
        const obj = { grupo: "cilindrada", valor: `${min}-${max}` };
        setSelectCaract(JSON.stringify(obj));
        setListaOpcionesMotos(motosCilindradas);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [min, max]);

    if (motosCilindradas.length === 0) {
        return <div>cilindradas no encontradas</div>;
    }

    return (
        <div>
            {motosCilindradas.map((v) => {
                return <div key={v._id}>{v.nombre}</div>;
            })}
        </div>
    );
}
