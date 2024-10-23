import { useRef } from "react";
import validarImagen from "../utils/validarImagen";
import PropTypes from "prop-types";
import { nanoid } from "nanoid";
import { TiDelete } from "react-icons/ti";

export default function CargarMultiplesImgs({
    fichasImg,
    setFichasImg,
    setEliminar,
}) {
    const inputFilesRef = useRef();

    function cargarFichaImgs(e) {
        const files = [...e.target.files];
        // console.log(files);
        for (let i = 0; i < files.length; i++) {
            const err = validarImagen(files[i]);
            if (err) {
                setFichasImg((prev) => {
                    return { ...prev, err: err };
                });
                return;
            }
        }

        const imagenes = files.map((v) => {
            return {
                file: v,
                img: URL.createObjectURL(v),
                nombreBase: null,
                id: nanoid(),
            };
        });

        setFichasImg((prev) => {
            return { files: [...prev.files, ...imagenes], err: "" };
        });
    }

    function handleDelete(img) {
        setFichasImg((prev) => {
            const imagenFiltrada = prev.files.filter((v) => v.id !== img.id);
            return { ...prev, files: imagenFiltrada };
        });
        if (img.nombreBase) {
            setEliminar((prev) => [...prev, img.nombreBase]);
        }
    }

    return (
        <div className="componente-muchas-imgs">
            <div className="contenedor-imgs">
                {fichasImg.files.map((v) => {
                    return (
                        <div key={v.id}>
                            <TiDelete
                                className="delete-icon"
                                onClick={() => handleDelete(v)}
                            />
                            <img src={v.img} />
                        </div>
                    );
                })}
            </div>
            {fichasImg.err && <p>{fichasImg.err}</p>}

            <input
                type="file"
                ref={inputFilesRef}
                multiple
                onChange={cargarFichaImgs}
            />

            <button type="button" onClick={() => inputFilesRef.current.click()}>
                cargar imagenes
            </button>
        </div>
    );
}

CargarMultiplesImgs.propTypes = {
    fichasImg: PropTypes.shape({
        files: PropTypes.arrayOf(
            PropTypes.shape({
                file: PropTypes.instanceOf(File),
                img: PropTypes.string,
                nombreBase: PropTypes.string,
                id: PropTypes.string,
            })
        ),
        err: PropTypes.string,
    }),
    setFichasImg: PropTypes.func,
    setEliminar: PropTypes.func,
};
