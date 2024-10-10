import { useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import validarImagen from "../utils/validarImagen";
import { nanoid } from "nanoid";
import fichaTec from "../schemas/fichaTecnica";
import { zodResolver } from "@hookform/resolvers/zod";
import keys from "../utils/keysFicha";
import filterObj from "../utils/filterObj";
import { base } from "../rutas";
import { Fragment } from "react";

export default function EditarMoto() {
    const axiosPrivate = useAxiosPrivate();
    const { id } = useParams();
    const queryClient = useQueryClient();
    const botonImgRef = useRef(null);
    const imagenesDeFichaRef = useRef(null);

    const [eliminar, setEliminar] = useState([]);
    const [viejasImagenes, setViejasImagenes] = useState([]);

    const [motoImg, setMotoImg] = useState({
        file: null,
        err: "",
    });

    const [fichasImg, setFichasImg] = useState({
        files: [], //{file:File-Img- , id:"23rewfc23(id)"}
        err: "",
    });

    const moto = useQuery({
        queryKey: ["motos", id],
        queryFn: async () => {
            const { data } = await axiosPrivate(`motos/${id}`);
            return data;
        },
        refetchOnWindowFocus: false,
    });

    const ficha = useQuery({
        queryKey: ["ficha", moto?.data?.fichaTecnica],
        queryFn: async () => {
            const { data } = await axiosPrivate(
                `fichas/${moto?.data?.fichaTecnica}`
            );
            return data;
        },
        enabled: moto.isSuccess,
        refetchOnWindowFocus: false,
    });

    const marcas = useQuery({
        queryKey: ["marcas"],
        queryFn: async () => {
            const { data } = await axiosPrivate("marcas");
            return data;
        },
        refetchOnWindowFocus: false,
    });

    const tipos = useQuery({
        queryKey: ["estilos"],
        queryFn: async () => {
            const { data } = await axiosPrivate("estilos");
            return data;
        },
        refetchOnWindowFocus: false,
    });

    const actualizar = useMutation({
        mutationFn: async (data) => {
            await axiosPrivate.patch(`motos/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        },
        onError: (error) => {
            console.log(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["motos"] });
            queryClient.invalidateQueries({
                queryKey: ["ficha", moto?.data?.fichaTecnica],
            });
            console.log("realizado");
        },
    });

    const {
        handleSubmit,
        formState: { errors },
        register,
    } = useForm({
        resolver: zodResolver(fichaTec),
        values: {
            moto: { ...moto.data },
            mecanica: {
                ...ficha.data?.mecanica,
                Cilindrada: ficha.data?.mecanica?.Cilindrada.replace(/\D/g, ""), //todo lo que no sea un numero por un espacio vacio
            },
            configuracion: {
                ...ficha.data?.configuracion,
                Equipamiento:
                    ficha.data?.configuracion?.Equipamiento.join(" | "),
            },
        },
    });

    function cargarMotoImg(e) {
        const file = e.target.files[0];
        const err = validarImagen(file);
        if (err) {
            setMotoImg((prev) => {
                return { ...prev, err };
            });
            return;
        }
        setMotoImg({ file, err: "" });
    }

    function cargarFichaImgs(e) {
        const files = [...e.target.files];
        let errorFile = files.find((v) => validarImagen(v));
        if (errorFile) {
            setFichasImg((prev) => {
                return { ...prev, err: errorFile };
            });
            return;
        }
        const imagenes = files.map((v) => {
            return { file: v, id: nanoid() };
        });
        setFichasImg((prev) => {
            return { files: [...prev.files, ...imagenes], err: "" };
        });
    }

    function prepareSend(data) {
        if (motoImg.err || fichasImg.err) {
            console.log(motoImg.err, fichasImg.err);
            return;
        }
        if (
            //es decir si no quedan imagenes en la ficha
            fichasImg.files.length === 0 &&
            eliminar.length === ficha.data.imagenes.length
        ) {
            console.log("error en los files");
            return;
        }

        const formData = new FormData();
        if (motoImg.file) {
            formData.append("motoImg", motoImg.file);
        }
        if (fichasImg.files.length) {
            fichasImg.files.forEach((v) => {
                formData.append("fichaImgs", v.file);
            });
        }
        // const ficha = { eliminar };

        const moto = filterObj(data.moto);
        moto.cilindrada = data.mecanica.Cilindrada;

        data.mecanica.Cilindrada = `${data.mecanica.Cilindrada} cc`;

        const mecanica = filterObj(data.mecanica);
        const configuracion = filterObj(data.configuracion);
        if (configuracion.Equipamiento) {
            configuracion.Equipamiento = configuracion.Equipamiento.replace(
                /\n/g,
                ""
            ).split("|");
        }

        const datos = { moto, mecanica, configuracion, eliminar };

        console.log(datos, formData);
        formData.append("datos", JSON.stringify(datos));
        // formData.append("moto", JSON.stringify(datos.moto));
        // formData.append("mecanica", JSON.stringify(datos.mecanica));
        // formData.append("configuracion", JSON.stringify(datos.configuracion));

        // console.log("consola", formData);
        actualizar.mutate(formData);
    }

    useEffect(() => {
        if (ficha.isSuccess) {
            setViejasImagenes(ficha.data.imagenes);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ficha.isSuccess]);

    function handleImagenesViejas(img) {
        setEliminar((prev) => [...prev, img]);
        setViejasImagenes((prev) => {
            return prev.filter((v) => v !== img);
        });
    }

    function handleFichasImg(id) {
        setFichasImg((prev) => {
            const nuevaLista = prev.files.filter((v) => v.id !== id);
            return { ...prev, files: nuevaLista };
        });
    }

    if (
        moto.isLoading ||
        ficha.isLoading ||
        marcas.isLoading ||
        tipos.isLoading
    ) {
        return <p>cargando</p>;
    }
    if (moto.isError || ficha.isError || marcas.isError || tipos.isError) {
        return <p>error</p>;
    }
    return (
        <div>
            <form onSubmit={handleSubmit(prepareSend)}>
                {moto.data.img && !motoImg.file ? (
                    <img
                        src={`${base}/imgs/big/${moto.data.img}`}
                        srcSet={`${base}/imgs/medium/${moto.data.img} 500w,${base}/imgs/big/${moto.data.img} 1000w`}
                        style={{ width: "250px" }}
                    />
                ) : (
                    <img
                        src={URL.createObjectURL(motoImg.file)}
                        style={{ width: "250px" }}
                    />
                )}
                <input
                    ref={botonImgRef}
                    style={{ display: "none" }}
                    type="file"
                    onChange={cargarMotoImg}
                />
                <button
                    onClick={() => {
                        botonImgRef.current.click();
                    }}
                    type="button"
                >
                    cambiar imagen de moto
                </button>
                {motoImg.err && <p>{motoImg.err}</p>}

                <input type="text" {...register(keys.moto.nombre)} />
                {errors.moto?.nombre && <p>{errors.moto.nombre.message}</p>}

                <div>
                    {viejasImagenes.map((v) => {
                        return (
                            <Fragment key={v}>
                                <img
                                    src={`${base}/imgs/big/${v}`}
                                    srcSet={`${base}/imgs/medium/${v} 500w,${base}/imgs/big/${v} 1000w`}
                                    style={{ width: "250px" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleImagenesViejas(v)}
                                >
                                    borrar
                                </button>
                            </Fragment>
                        );
                    })}
                    {fichasImg.files.map((v) => {
                        return (
                            <Fragment key={v.id}>
                                <img
                                    src={URL.createObjectURL(v.file)}
                                    style={{ width: "250px" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleFichasImg(v.id)}
                                >
                                    borrar
                                </button>
                            </Fragment>
                        );
                    })}
                </div>
                <input
                    ref={imagenesDeFichaRef}
                    type="file"
                    style={{ display: "none" }}
                    multiple
                    onChange={cargarFichaImgs}
                />
                <button
                    type="button"
                    onClick={() => {
                        imagenesDeFichaRef.current.click();
                    }}
                >
                    cargar imagenes ficha
                </button>
                {fichasImg.err && <p>{fichasImg.err}</p>}

                <h2>marca</h2>
                <select {...register(keys.moto.marca)}>
                    <option value={""}>seleccione una marca</option>
                    {marcas.data.map((v) => {
                        return (
                            <option key={v._id} value={v._id}>
                                {v.marca}
                            </option>
                        );
                    })}
                </select>
                {errors.moto?.marca && <p>{errors.moto.marca.message}</p>}

                <h2>tipo</h2>
                <select {...register(keys.moto.estilo)}>
                    <option value={""}>seleccione un estilo</option>
                    {tipos.data.map((v) => {
                        return (
                            <option key={v._id} value={v._id}>
                                {v.estilo}
                            </option>
                        );
                    })}
                </select>
                {errors.moto?.estilo && <p>{errors.moto.estilo.message}</p>}
                <h2>mecanica</h2>

                <input type="text" {...register(keys.mecanica.Motor)} />
                {errors.mecanica?.Motor && (
                    <p>{errors.mecanica.Motor.message}</p>
                )}

                <input
                    type="number"
                    {...register(keys.mecanica.Cilindrada, {
                        valueAsNumber: true,
                    })}
                />
                {errors.mecanica?.Cilindrada && (
                    <p>{errors.mecanica.Cilindrada.message}</p>
                )}

                <input
                    type="text"
                    {...register(keys.mecanica["Potencia máxima"])}
                />
                {errors.mecanica?.["Potencia máxima"] && (
                    <p>{errors.mecanica["Potencia máxima"].message}</p>
                )}

                <input
                    type="text"
                    {...register(keys.mecanica["Velocidad máxima"])}
                />
                {errors.mecanica?.["Velocidad máxima"] && (
                    <p>{errors.mecanica["Velocidad máxima"].message}</p>
                )}

                <input type="text" {...register(keys.mecanica.Alimentación)} />
                {errors.mecanica?.Alimentación && (
                    <p>{errors.mecanica.Alimentación.message}</p>
                )}

                <input type="text" {...register(keys.mecanica.Encendido)} />
                {errors.mecanica?.Encendido && (
                    <p>{errors.mecanica.Encendido.message}</p>
                )}

                <input type="text" {...register(keys.mecanica.Arranque)} />
                {errors.mecanica?.Arranque && (
                    <p>{errors.mecanica.Arranque.message}</p>
                )}

                <input type="text" {...register(keys.mecanica.Transmisión)} />
                {errors.mecanica?.Transmisión && (
                    <p>{errors.mecanica.Transmisión.message}</p>
                )}

                <input type="text" {...register(keys.mecanica.Tracción)} />
                {errors.mecanica?.Tracción && (
                    <p>{errors.mecanica.Tracción.message}</p>
                )}

                <h2>configuracion</h2>

                <input
                    type="text"
                    {...register(keys.configuracion["Faro Delantero"])}
                />
                {errors.configuracion?.["Faro Delantero"] && (
                    <p>{errors.configuracion["Faro Delantero"].message}</p>
                )}

                <input type="text" {...register(keys.configuracion.Llantas)} />
                {errors.configuracion?.Llantas && (
                    <p>{errors.configuracion.Llantas.message}</p>
                )}

                <input
                    type="text"
                    {...register(keys.configuracion["Frenos D / T"])}
                />
                {errors.configuracion?.["Frenos D / T"] && (
                    <p>{errors.configuracion["Frenos D / T"].message}</p>
                )}

                <input
                    type="text"
                    {...register(keys.configuracion["Neumático Delantero"])}
                />
                {errors.configuracion?.["Neumático Delantero"] && (
                    <p>{errors.configuracion["Neumático Delantero"].message}</p>
                )}

                <input
                    type="text"
                    {...register(keys.configuracion["Neumático Trasero"])}
                />
                {errors.configuracion?.["Neumático Trasero"] && (
                    <p>{errors.configuracion["Neumático Trasero"].message}</p>
                )}

                <input
                    type="text"
                    {...register(keys.configuracion["Suspensión Delantera"])}
                />
                {errors.configuracion?.["Suspensión Delantera"] && (
                    <p>
                        {errors.configuracion["Suspensión Delantera"].message}
                    </p>
                )}

                <input
                    type="text"
                    {...register(keys.configuracion["Suspensión Trasera"])}
                />
                {errors.configuracion?.["Suspensión Trasera"] && (
                    <p>{errors.configuracion["Suspensión Trasera"].message}</p>
                )}

                <input
                    type="text"
                    {...register(keys.configuracion["Largo / Ancho / Alto"])}
                />
                {errors.configuracion?.["Largo / Ancho / Alto"] && (
                    <p>
                        {errors.configuracion["Largo / Ancho / Alto"].message}
                    </p>
                )}

                <input
                    type="text"
                    {...register(keys.configuracion["Distancia entre Ejes"])}
                />
                {errors.configuracion?.["Distancia entre Ejes"] && (
                    <p>
                        {errors.configuracion["Distancia entre Ejes"].message}
                    </p>
                )}

                <input type="text" {...register(keys.configuracion.Peso)} />
                {errors.configuracion?.Peso && (
                    <p>{errors.configuracion.Peso.message}</p>
                )}

                <input
                    type="text"
                    {...register(keys.configuracion["Capacidad de Carga"])}
                />
                {errors.configuracion?.["Capacidad de Carga"] && (
                    <p>{errors.configuracion["Capacidad de Carga"].message}</p>
                )}

                <input
                    type="text"
                    {...register(keys.configuracion["Capacidad del Tanque"])}
                />
                {errors.configuracion?.["Capacidad del Tanque"] && (
                    <p>
                        {errors.configuracion["Capacidad del Tanque"].message}
                    </p>
                )}

                <input
                    type="text"
                    {...register(keys.configuracion["Consumo y Autonomía"])}
                />
                {errors.configuracion?.["Consumo y Autonomía"] && (
                    <p>{errors.configuracion["Consumo y Autonomía"].message}</p>
                )}

                <input
                    type="text"
                    {...register(keys.configuracion["Puerto USB"])}
                />
                {errors.configuracion?.["Puerto USB"] && (
                    <p>{errors.configuracion["Puerto USB"].message}</p>
                )}

                <input
                    type="text"
                    {...register(keys.configuracion["Altura del Asiento"])}
                />
                {errors.configuracion?.["Altura del Asiento"] && (
                    <p>{errors.configuracion["Altura del Asiento"].message}</p>
                )}

                <textarea {...register(keys.configuracion.Equipamiento)} />
                {errors.configuracion?.Equipamiento && (
                    <p>{errors.configuracion.Equipamiento.message}</p>
                )}

                <input
                    type="text"
                    {...register(keys.configuracion["Tipo de Batería"])}
                />
                {errors.configuracion?.["Tipo de Batería"] && (
                    <p>{errors.configuracion["Tipo de Batería"].message}</p>
                )}

                <input
                    type="text"
                    {...register(keys.configuracion["Cantidad de Baterías"])}
                />
                {errors.configuracion?.["Cantidad de Baterías"] && (
                    <p>
                        {errors.configuracion["Cantidad de Baterías"].message}
                    </p>
                )}

                <input
                    type="text"
                    {...register(keys.configuracion["Tiempo de Carga"])}
                />
                {errors.configuracion?.["Tiempo de Carga"] && (
                    <p>{errors.configuracion["Tiempo de Carga"].message}</p>
                )}

                <button type="submit">enviar</button>
            </form>
        </div>
    );
}
