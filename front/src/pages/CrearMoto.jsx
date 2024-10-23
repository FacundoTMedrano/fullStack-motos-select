import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import filterObj from "../utils/filterObj";
import {
    mecanica,
    configuracion,
} from "../constants/configuracion-mecanica-keys";
import CargarUnaImagen from "../components/CargarUnaImagen";
import CargarMultiplesImgs from "../components/CargarMultiplesImgs";

export default function CrearMoto() {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    const [motoImg, setMotoImg] = useState({
        img: null,
        file: null,
        err: "",
    });

    const [fichasImg, setFichasImg] = useState({
        files: [], //{ file, id, img}
        err: "",
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
    } = useForm();

    function searchErr() {
        if (
            motoImg.err ||
            fichasImg.err ||
            !motoImg.file ||
            fichasImg.files.length === 0
        ) {
            if (motoImg.err) {
                setMotoImg((prev) => {
                    return { ...prev, err: "Error en la imagen" };
                });
            }

            if (fichasImg.err) {
                setFichasImg((prev) => {
                    return { ...prev, err: "Error en las imagenes" };
                });
            }

            if (!motoImg.file) {
                setMotoImg((prev) => {
                    return { ...prev, err: "Debe tener una imagen" };
                });
            }

            if (fichasImg.files.length === 0) {
                setFichasImg((prev) => {
                    return { ...prev, err: "Debe tener imagenes" };
                });
            }

            return true;
        }
    }

    function prepareSend(data) {
        const moto = { ...filterObj(data.moto) };
        const mecanica = { ...filterObj(data.mecanica) };
        const configuracion = { ...filterObj(data.configuracion) };

        if (mecanica.Cilindrada) {
            moto.cilindrada = mecanica.Cilindrada;
            mecanica.Cilindrada = `${mecanica.Cilindrada} cc`;
        }

        if (configuracion.Equipamiento) {
            configuracion.Equipamiento = configuracion.Equipamiento.replace(
                /\n/g,
                ""
            ).split("|");
        }

        const datos = { moto, mecanica, configuracion };

        console.log(datos);

        const formData = new FormData();

        formData.append("motoImg", motoImg.file);

        fichasImg.files.forEach((v) => {
            formData.append("fichaImgs", v.file);
        });

        formData.append("datos", JSON.stringify(datos));

        crear.mutate(formData);
    }

    if (marcas.isLoading || tipos.isLoading) {
        return <p>cargando...</p>;
    }
    if (marcas.isError || tipos.isError) {
        return <p>error</p>;
    }

    return (
        <div className="crear-moto-form-page">
            <h1>Crear Moto</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const errorEnImgs = searchErr();
                    handleSubmit((data) => {
                        if (!errorEnImgs) {
                            prepareSend(data);
                        }
                    })();
                }}
            >
                <div className="moto-box">
                    <h2>Moto</h2>
                    <CargarUnaImagen
                        motoImg={motoImg}
                        setMotoImg={setMotoImg}
                    />

                    <div className="label-input-err">
                        <label htmlFor="nombre-moto">Nombre de la Moto</label>
                        <input
                            id="nombre-moto"
                            type="text"
                            {...register("moto.nombre", {
                                required: "campo requerido",
                            })}
                        />
                        {errors.moto?.nombre && (
                            <p>{errors.moto.nombre.message}</p>
                        )}
                    </div>
                </div>

                <div className="imagenes-de-ficha">
                    <h2>Imagenes de Ficha</h2>
                    <CargarMultiplesImgs
                        setFichasImg={setFichasImg}
                        fichasImg={fichasImg}
                    />
                </div>
                <div className="select-div">
                    <div>
                        <h2>Marca</h2>
                        <select
                            {...register("moto.marca", {
                                required: "campo requerido",
                            })}
                        >
                            <option value={""}>seleccione una marca</option>
                            {marcas.data.map((v) => {
                                return (
                                    <option key={v._id} value={v._id}>
                                        {v.marca}
                                    </option>
                                );
                            })}
                        </select>
                        {errors.moto?.marca && (
                            <p>{errors.moto.marca.message}</p>
                        )}
                    </div>
                    <div>
                        <h2>Tipo</h2>
                        <select {...register("moto.estilo")}>
                            <option value={""}>seleccione un estilo</option>
                            {tipos.data.map((v) => {
                                return (
                                    <option key={v._id} value={v._id}>
                                        {v.estilo}
                                    </option>
                                );
                            })}
                        </select>
                        {errors.moto?.estilo && (
                            <p>{errors.moto.estilo.message}</p>
                        )}
                    </div>
                </div>

                <div className="mecanica">
                    <h2>Mecanica</h2>
                    <div className="contenedor">
                        {mecanica.map((v) => {
                            return (
                                <div key={v.value} className="casilla">
                                    <label htmlFor={v.value}>{v.value}</label>
                                    <input
                                        id={v.value}
                                        type={v.tipo}
                                        placeholder={v.placeholder}
                                        {...register(
                                            `mecanica.${v.value}`,
                                            v.validaciones
                                        )}
                                    />
                                    {errors.mecanica?.[v.value] && (
                                        <p>
                                            {errors.mecanica[v.value].message}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="configuracion">
                    <h2>Configuracion</h2>
                    <div className="contenedor">
                        {configuracion.map((v) => {
                            return (
                                <div key={v.value} className="casilla">
                                    <label htmlFor={v.value}>{v.value}</label>
                                    {v.tipo === "text" ? (
                                        <input
                                            id={v.value}
                                            type={v.tipo}
                                            placeholder={v.placeholder}
                                            {...register(
                                                `configuracion.${v.value}`,
                                                v.validaciones
                                            )}
                                        />
                                    ) : (
                                        <textarea
                                            id={v.value}
                                            rows={4}
                                            placeholder={v.placeholder}
                                            {...register(
                                                `configuracion.${v.value}`,
                                                v.validaciones
                                            )}
                                        />
                                    )}
                                    {errors.configuracion?.[v.value] && (
                                        <p>
                                            {
                                                errors.configuracion[v.value]
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="boton">
                    <button type="submit">enviar</button>
                </div>
            </form>
        </div>
    );
}
