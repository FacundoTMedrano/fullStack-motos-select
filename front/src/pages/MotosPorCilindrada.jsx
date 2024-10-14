import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "../services/api";
import { useParams, Link } from "react-router-dom";
import useContexto from "../hooks/useContexto";
import { useEffect } from "react";
import { base } from "../rutas";

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
    });

    const motosCilindradas = motos.filter(
        (v) => v.cilindrada <= max && v.cilindrada >= min
    );

    //este useEffect se ejecuta al final de toda la funcion
    //pero siempre debe estar por lo que no puede ir dentro de un condicional
    useEffect(() => {
        setSelectCaract(
            JSON.stringify({ grupo: "cilindrada", valor: `${min}-${max}` })
        );
        setListaOpcionesMotos(motosCilindradas);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [min, max]);

    if (motosCilindradas.length === 0) {
        return <div>cilindradas no encontradas</div>;
    }

    return (
        <div>
            {motosCilindradas.map((v) => {
                const imgBig = `${base}/imgs/big/${v.img}`;
                const imgMedium = `${base}/imgs/medium/${v.img}`;
                return (
                    <Link key={v._id} to={`/ficha_tecnica/${v.nombre}`}>
                        <img
                            src={imgBig}
                            srcSet={`${imgMedium} 500w,${imgBig} 1000w`}
                            style={{ width: "250px" }}
                        />
                        <h2>{v.nombre}</h2>
                    </Link>
                );
            })}
        </div>
    );
}
