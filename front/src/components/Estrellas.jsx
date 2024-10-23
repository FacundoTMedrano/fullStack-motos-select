import PropTypes from "prop-types";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function Estrellas({ estrellas }) {
    const { completas, media, vacias } = estrellas;

    return (
        <div className="fichaPage-promedio-estrellas">
            {[...Array(completas)].map((_, index) => (
                <FaStar key={index} />
            ))}

            {media === 1 && <FaStarHalfAlt />}

            {[...Array(vacias)].map((_, index) => (
                <FaRegStar key={index} />
            ))}
        </div>
    );
}

Estrellas.propTypes = {
    estrellas: PropTypes.shape({
        completas: PropTypes.number,
        media: PropTypes.number,
        vacias: PropTypes.number,
    }),
};
