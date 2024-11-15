import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "../services/api";
import PropTypes from "prop-types";
import { base } from "../rutas";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export default function FichaTecnica({ moto }) {
    const ficha = useQuery({
        queryKey: ["ficha", moto._id],
        queryFn: async () => {
            const { data } = await axiosPublic(`fichas/${moto.fichaTecnica}`);
            return data;
        },
        refetchOnWindowFocus: false,
    });

    const marca = useQuery({
        queryKey: ["marcas"],
        queryFn: async () => {
            const { data } = await axiosPublic(`marcas`);
            return data;
        },
        refetchOnWindowFocus: false,
    });

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    };

    if (ficha.isLoading) {
        return <div>Cargando</div>;
    }

    if (ficha.isError) {
        return <div>error en el fetch</div>;
    }

    if (ficha.data.imagenes.length === 1) {
        ficha.data.imagenes[1] = ficha.data.imagenes[0];
    }
    const marcaDeLaMoto = marca.data.find((marca) => marca._id === moto.marca);

    return (
        <div className="fichaTecnicaComponent">
            <h1>
                {marcaDeLaMoto.marca} {moto.nombre}
            </h1>
            <div className="sliderFicha">
                <Slider {...settings}>
                    {ficha.data.imagenes.map((v) => {
                        const imgBig = `${base}/imgs/big/${v}`;
                        const imgMedium = `${base}/imgs/medium/${v}`;
                        return (
                            <div key={v}>
                                <img
                                    src={imgBig}
                                    srcSet={`${imgMedium} 500w,${imgBig} 1000w`}
                                />
                            </div>
                        );
                    })}
                </Slider>
            </div>
            <div className="fichaPageTablas">
                <table>
                    <caption>Mecanica</caption>
                    <tbody>
                        {Object.entries(ficha.data.mecanica).map(
                            ([key, value]) => {
                                return (
                                    <tr key={key}>
                                        <th>{key}</th>
                                        <td>{value}</td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>

                <table>
                    <caption>Configuracion</caption>
                    <tbody>
                        {Object.entries(ficha.data.configuracion).map(
                            ([key, value]) => {
                                if (value.length === 0) return null;
                                let val = value;
                                if (Array.isArray(value)) {
                                    val = (
                                        <ul>
                                            {value.map((v) => {
                                                return (
                                                    <li key={v.slice(0, 10)}>
                                                        {v}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    );
                                }
                                return (
                                    <tr key={key}>
                                        <th>{key}</th>
                                        <td>{val}</td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>
            </div>
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
