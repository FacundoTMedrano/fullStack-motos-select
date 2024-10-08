import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import validarImagen from "../utils/validarImagen";
import { nanoid } from "nanoid";
import fichaTec from "../schemas/fichaTecnica";
import { zodResolver } from "@hookform/resolvers/zod";
import keys from "../utils/keysFicha";
import filterObj from "../utils/filterObj";

export default function CrearMoto() {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    const [motoImg, setMotoImg] = useState({
        file: null,
        err: "",
    });

    const [fichasImg, setFichasImg] = useState({
        files: [],
        err: "",
    });

    const marcas = useQuery({
        queryKey: ["marcas"],
        queryFn: async () => {
            const { data } = await axiosPrivate("marcas");
            return data;
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });

    const tipos = useQuery({
        queryKey: ["estilos"],
        queryFn: async () => {
            const { data } = await axiosPrivate("estilos");
            return data;
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });

    const crear = useMutation({
        mutationFn: async (data) => {
            await axiosPrivate.post("motos", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        },
        onError: (error) => {
            console.log(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["motos"] });
            queryClient.invalidateQueries({ queryKey: ["marcas"] });
            console.log("realizado");
        },
    });

    const {
        handleSubmit,
        formState: { errors },
        register,
    } = useForm({
        resolver: zodResolver(fichaTec),
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
        setFichasImg({ files: imagenes, err: "" });
    }

    function prepareSend(data) {
        if (motoImg.err || fichasImg.err) {
            console.log(motoImg.err);
            return;
        }
        if (!motoImg.file || fichasImg.files.length === 0) {
            console.log("error en los files");
            return;
        }

        const formData = new FormData();
        formData.append("motoImg", motoImg.file);
        fichasImg.files.forEach((v) => {
            formData.append("fichaImgs", v.file);
        });

        const moto = filterObj(data.moto);
        moto.cilindrada = data.mecanica.Cilindrada;

        data.mecanica.Cilindrada = `${data.mecanica.Cilindrada} cc`;

        const mecanica = filterObj(data.mecanica);
        const configuracion = filterObj(data.configuracion);
        if (configuracion.Equipamiento) {
            configuracion.Equipamiento = configuracion.Equipamiento.split("|");
        }
        const datos = { moto, mecanica, configuracion };
        console.log(datos);
        formData.append("moto", JSON.stringify(datos.moto));
        formData.append("mecanica", JSON.stringify(datos.mecanica));
        formData.append("configuracion", JSON.stringify(datos.configuracion));

        console.log("consola", formData);
        crear.mutate(formData);
    }

    if (marcas.isLoading || tipos.isLoading) {
        return <p>cargando...</p>;
    }
    if (marcas.isError || tipos.isError) {
        return <p>error</p>;
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

                <input type="text" {...register(keys.moto.nombre)} />
                {errors.moto?.nombre && <p>{errors.moto.nombre.message}</p>}

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
