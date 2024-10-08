import { useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState } from "react";
import { useForm } from "react-hook-form";
import validarImagen from "../utils/validarImagen";
import { nanoid } from "nanoid";

export default function CrearMoto() {
    const axiosPrivate = useAxiosPrivate();

    const [motoImg, setMotoImg] = useState({
        file: null,
        err: "",
    });
    const [fichasImg, setFichasImg] = useState({
        files: [],
        err: "",
    });

    const {
        handleSubmit,
        formState: { errors },
        register,
    } = useForm();

    function cargarMotoImg(e) {
        const file = e.target.files[0];
        const error = validarImagen(file);
        if (error) {
            setMotoImg((prev) => {
                return { ...prev, err: error };
            });
            return;
        }
        setMotoImg({ file, err: null });
    }

    function busquedaErr(lista) {
        for (let i = 0; i < lista.length; i++) {
            const err = validarImagen(lista[i]);
            if (err) return err;
        }
    }

    function cargarFichaImgs(e) {
        const files = [...e.target.files];
        let errorFile = busquedaErr(files);
        console.log(errorFile);
        if (errorFile) {
            setFichasImg((prev) => {
                return { ...prev, err: errorFile };
            });
            return;
        }
        const nuevaLista = files.map((v) => {
            return { file: v, id: nanoid() };
        });
        setFichasImg((prev) => {
            const obj = { files: [...prev.files, ...nuevaLista], err: "" };
            console.log(obj);
            return obj;
        });
    }

    function prepareSend(data) {
        console.log(data);
    }

    return (
        <div>
            <form onSubmit={handleSubmit(prepareSend)}>
                {motoImg.file && (
                    <img
                        src={URL.createObjectURL(motoImg.file)}
                        style={{ width: "250px" }}
                    />
                )}
                <input type="file" onChange={cargarMotoImg} />
                {motoImg.err && <p>{motoImg.err}</p>}
                <input type="text" {...register("moto", { required: "falta la moto" })} />
                {errors.moto && <p>{errors.moto.message}</p>}
                {fichasImg.files.map((v) => {
                    return (
                        <img
                            key={v.id}
                            src={URL.createObjectURL(v.file)}
                            style={{ width: "250px" }}
                        />
                    );
                })}
                <input type="file" multiple onChange={cargarFichaImgs} />
                {fichasImg.err && <p>{fichasImg.err}</p>}
                <button type="submit">enviar</button>
            </form>
        </div>
    );
}
