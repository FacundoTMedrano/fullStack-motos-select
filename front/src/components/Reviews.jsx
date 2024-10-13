import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "../services/api";
import PropTypes from "prop-types";
import reviewAvgUserPuntos from "../utils/reviewAvgUserPuntos.js";
import getAvg from "../utils/getAvg.js";
import useAuth from "../hooks/useAuth.jsx";
import { Link } from "react-router-dom";
import ReviewForm from "./ReviewForm.jsx";

export default function Reviews({ moto }) {
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

    if (isLoading) {
        return <div>Cargando</div>;
    }
    if (isError) {
        return <div>error en el fetch</div>;
    }

    const avg = getAvg(data);
    
    return (
        <div>
            {data.length === 0 ? (
                <div>sin reviews</div>
            ) : (
                <div>
                    <div>
                        <table>
                            <tbody>
                                {Object.entries(avg.avgLista).map((v) => {
                                    const espaciado = v[0]
                                        .split(/(?=[A-Z])/)
                                        .map((v) => {
                                            return `${v
                                                .charAt(0)
                                                .toUpperCase()}${v.slice(1)}`;
                                        })
                                        .join(" ");
                                    return (
                                        <tr key={v[0]}>
                                            <th>{espaciado}</th>
                                            <td>{v[1]}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <p>promedio: {avg.avgTotal}</p>
                    </div>
                    <div>
                        {data.map((v) => {
                            const promedio = reviewAvgUserPuntos(v);
                            return (
                                <div key={v._id}>
                                    <h3>{v.user.name}</h3>
                                    <div>
                                        <div>
                                            <p>{v?.opinionPositiva}</p>
                                        </div>
                                        <div>
                                            <p>{v?.opinionNegativa}</p>
                                        </div>
                                        <p>opinion: {promedio}/10</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            {!role ? (
                <div>
                    <p>logeese para dejar un review</p>
                    <Link to={`/login`}>login</Link>
                </div>
            ) : (
                <ReviewForm moto={moto} />
            )}
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
