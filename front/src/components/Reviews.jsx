import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "../services/api";
import PropTypes from "prop-types";
import reviewAvgUserPuntos from "../utils/reviewAvgUserPuntos.js";
import getAvg from "../utils/getAvg.js";
import useAuth from "../hooks/useAuth.jsx";
import { Link } from "react-router-dom";
import ReviewForm from "./ReviewForm.jsx";
import Estrellas from "./Estrellas.jsx";
import espaciado from "../utils/espaciado.js";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa6";
import useAxiosPrivate from "../hooks/useAxiosPrivate.jsx";

export default function Reviews({ moto }) {
    const axiosPrivate = useAxiosPrivate();

    const {
        auth: { role },
    } = useAuth();

    const { isLoading, isError, data } = useQuery({
        queryKey: ["reviews", moto._id],
        queryFn: async () => {
            const { data } = await axiosPublic(`reviews/moto/${moto._id}`);
            return data;
        },
        refetchOnWindowFocus: false,
    });

    const miReview = useQuery({
        queryKey: ["reviews", "mi_review", moto._id],
        queryFn: async () => {
            const { data } = await axiosPrivate(
                `reviews/review-from-moto/${moto._id}`
            );
            console.log(data);
            return data;
        },
        retry: 0,
        refetchOnWindowFocus: false,
    });

    if ((isLoading, miReview.isLoading)) {
        return <div>Cargando</div>;
    }
    if (isError) {
        return <div>error en el fetch</div>;
    }

    const avg = getAvg(data);

    return (
        <div className="ficha-reviewsComponent">
            {data.length > 0 && (
                <div className="avg-puntaje-comentarios">
                    <div className="tabla-promedio-y-estrellas">
                        <div className="tabla-promedio">
                            <table>
                                <caption>
                                    Promedio de Puntajes por Característica
                                </caption>
                                <tbody>
                                    {Object.entries(avg.avgLista).map((v) => {
                                        return (
                                            <tr key={v[0]}>
                                                <th>{espaciado(v[0])}</th>
                                                <td>{v[1]}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="estrellas-y-promedio">
                            <div>
                                <p>Promedio: {avg.avgTotal}/10</p>
                                <Estrellas estrellas={avg.estrellas} />
                                <p>Reseñas de {data.length} usuarios</p>
                            </div>
                        </div>
                    </div>
                    <div className="comentarios">
                        {data.map((v) => {
                            const promedio = reviewAvgUserPuntos(v);
                            return (
                                <div key={v._id} className="comentario">
                                    <h3>{v.user.name}</h3>
                                    <div className="positivo-negativo">
                                        <div>
                                            <FaRegThumbsUp className="icon-thumb-up" />
                                            <p>{v?.opinionPositiva}</p>
                                        </div>
                                        <div>
                                            <FaRegThumbsDown className="icon-thumb-down" />
                                            <p>{v?.opinionNegativa}</p>
                                        </div>

                                        <p>Opinion: {promedio} puntos</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {data.length === 0 && !miReview.isSuccess && (
                <div className="ficha-reviewsComponent--sin-reviews">
                    <div>
                        <h3>Sin Reviews</h3>
                        <p>Se el primero</p>
                    </div>
                </div>
            )}

            {miReview.isSuccess && miReview.data?.state === "pending" && (
                // corregir el nombre
                <div className="ficha-reviewsComponent--sin-reviews">
                    <div>
                        <h3>Ya realizaste tu review</h3>
                        <p>Debes esperar a que sea aceptado</p>
                    </div>
                </div>
            )}

            {!role && (
                <div className="logesee-para-dejar-un-link">
                    <div>
                        <p>logeese para dejar un review</p>
                        <Link to={`/login`}>Login</Link>
                    </div>
                </div>
            )}

            {role && !miReview.isSuccess && <ReviewForm moto={moto} />}
        </div>
    );
}

Reviews.propTypes = {
    moto: PropTypes.shape({
        nombre: PropTypes.string,
        marca: PropTypes.string,
        img: PropTypes.string,
        fichaTecnica: PropTypes.string,
        _id: PropTypes.string,
        cilindrada: PropTypes.number,
    }),
};
