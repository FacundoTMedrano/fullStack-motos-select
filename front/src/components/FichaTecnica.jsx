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

    console.log(ficha.data);

    if (ficha.data.imagenes.length === 1) {
        ficha.data.imagenes[1] = ficha.data.imagenes[0];
    }

    return (
        <div>
            <Slider {...settings}>
                {ficha.data.imagenes.map((v) => {
                    return (
                        <div key={v}>
                            <img
                                style={{ width: "300px" }}
                                src={`${base}/imgs/big/${v}`}
                            />
                        </div>
                    );
                })}
            </Slider>
            <table>
                <tbody>
                    {Object.entries(ficha.data.mecanica).map(([key, value]) => {
                        return (
                            <tr key={key}>
                                <th>{key}</th>
                                <td>{value}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <table>
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
