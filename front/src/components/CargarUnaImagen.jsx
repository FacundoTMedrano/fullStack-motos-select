import PropTypes from "prop-types";
import validarImagen from "../utils/validarImagen";
import { useRef } from "react";

export default function CargarUnaImagen({ motoImg, setMotoImg }) {
    const inputFileRef = useRef();

    function cargarMotoImg(e) {
        const file = e.target.files[0];
        const err = validarImagen(file);
        if (err) {
            setMotoImg((prev) => {
                return { ...prev, err };
            });
            return;
        }
        setMotoImg({ img: URL.createObjectURL(file), file, err: "" });
    }

    return (
        <div className="imagen-box">
            <div className="imagen">
                {motoImg.img ? <img src={motoImg.img} /> : <p>Sin Imagen</p>}
            </div>
            {motoImg.err && <p>{motoImg.err}</p>}

            <input //display = none en scss
                type="file"
                onChange={cargarMotoImg}
                ref={inputFileRef}
            />

            <div className="botones">
                <button
                    type="button"
                    onClick={() => inputFileRef.current.click()}
                >
                    {motoImg.img ? "Cambiar imagen" : "Cargar Imagen"}
                </button>
            </div>
        </div>
    );
}

CargarUnaImagen.propTypes = {
    motoImg: PropTypes.shape({
        img: PropTypes.string,
        file: PropTypes.instanceOf(File),
        err: PropTypes.string,
    }),
    setMotoImg: PropTypes.func,
};
