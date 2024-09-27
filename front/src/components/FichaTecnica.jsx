import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "../services/api";
import PropTypes from "prop-types";
import { base } from "../rutas";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export default function FichaTecnica({ moto }) {
    const { isLoading, isError, data } = useQuery({
        queryKey: ["ficha", moto._id],
        queryFn: async () => {
            const { data } = await axiosPublic(`fichas/${moto.fichaTecnica}`);
            return data;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
    });
    if (isLoading) {
        return <div>Cargando</div>;
    }
    if (isError) {
        return <div>error en el fetch</div>;
    }

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    };

    if (data.imagenes.length === 1) {
        data.imagenes[1] = data.imagenes[0];
    }
    const imagenes = data.imagenes.map((v) => {
        return (
            <div key={v}>
                <img style={{ width: "300px" }} src={`${base}/imgs/big/${v}`} />
            </div>
        );
    });
    const informacion = data.informacion.map((v) => {
        return (
            <div key={v.grupo}>
                <h2>{v.grupo}</h2>
                <table>
                    <tbody>
                        {Object.entries(v.propiedades).map((v) => {
                            const [key, value] = v;
                            let valor = value;
                            if (Array.isArray(value)) {
                                valor = (
                                    <ul>
                                        {value.map((v) => {
                                            return <li key={v}>{v}</li>;
                                        })}
                                    </ul>
                                );
                            }

                            return (
                                <tr key={key}>
                                    <th>{key}</th>
                                    <td>{valor}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    });
    return (
        <div>
            <Slider {...settings}>{imagenes}</Slider>
            {informacion}
        </div>
    );
}

FichaTecnica.propTypes = {
    moto: PropTypes.shape({
        nombre: PropTypes.string,
        marca: PropTypes.string,
        img: PropTypes.string,
        fichaTecnica: PropTypes.string,
        _id: PropTypes.string,
        cilindrada: PropTypes.number,
    }),
};
