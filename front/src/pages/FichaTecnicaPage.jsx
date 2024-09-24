import { useParams } from "react-router-dom";
import useDatos from "../hooks/useDatos";
import { useEffect } from "react";
import useContexto from "../hooks/useContexto";
import FichaTecnica from "../components/FichaTecnica";
import Reviews from "../components/Reviews";

export default function FichaTecnicaPage() {
    const moto = useParams().moto.replace(/_/g, " ");

    const {
        selectCarac,
        setSelectCaract,
        setSelectMoto,
        setListaOpcionesMotos,
    } = useContexto();
    const { datos } = useDatos();
    const motoBusqueda = datos.motos.find(
        (v) => v.nombre.toLowerCase() === moto.toLowerCase()
    );

    useEffect(() => {
        const obj = JSON.stringify({ grupo: "", valor: "" });
        if (selectCarac === obj && motoBusqueda) {
            const marcaElemento = datos.marcas.find(
                (v) => v._id === motoBusqueda.marca
            );
            const motosPorMarca = datos.motos.filter(
                (v) => v.marca === marcaElemento._id
            );
            setListaOpcionesMotos(motosPorMarca);
            setSelectCaract(
                JSON.stringify({ grupo: "marca", valor: marcaElemento.marca })
            );
        }

        if (motoBusqueda) {
            setSelectMoto(motoBusqueda.nombre);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moto]);

    if (!motoBusqueda) {
        return <div>moto no encontrada</div>;
    }

    return (
        <div>
            <FichaTecnica moto={motoBusqueda} />
            <Reviews moto={motoBusqueda} />
        </div>
    );
}
