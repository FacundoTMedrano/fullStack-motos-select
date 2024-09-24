import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "../services/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import Slider from "react-slick";
import PropTypes from "prop-types";
// import { base } from "../rutas";

export default function FichaTecnica({ moto }) {
    const { isLoading, isError, data } = useQuery({
        queryKey: [`ficha/${moto._id}`],
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
    console.log(data);
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    };
    return (
        <div>
            {/* <Slider {...settings}>
                {data.imagenes.map((v) => {
                    return <img src={``} alt="" />
                })}
            </Slider> */}
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
