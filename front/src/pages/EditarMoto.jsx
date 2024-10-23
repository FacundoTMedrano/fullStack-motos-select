import { useParams, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import filterObj from "../utils/filterObj";
import {
    mecanica,
    configuracion,
} from "../constants/configuracion-mecanica-keys";
import { nanoid } from "nanoid";
import CargarUnaImagen from "../components/CargarUnaImagen";
import CargarMultiplesImgs from "../components/CargarMultiplesImgs";
import { base } from "../rutas";
import useAuth from "../hooks/useAuth";

export default function EditarMoto() {
    const axiosPrivate = useAxiosPrivate();
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {
        auth: { role },
    } = useAuth();

    const [eliminar, setEliminar] = useState([]);

    const [motoImg, setMotoImg] = useState({
        img: null,
        file: null,
        err: "",
    });

    //las imagenes ya subidas se cargaran en img como src con url y tendra el nombre base para poder
    // eliminarla luego, y las que carge desde el front guardaran el file y un url Object,
    // todos con id de nanoid para poder eliminarlos
    const [fichasImg, setFichasImg] = useState({
        files: [], //{file:File, nombreBase:"string", img:url.Createurlobject(file), id:nanoid()}
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
        queryKey: ["ficha", moto.data?.fichaTecnica],
        queryFn: async () => {
            const { data } = await axiosPrivate(
                `fichas/${moto.data?.fichaTecnica}`
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
            navigate(`/${role}/motos`);
        },
    });

    const {
        handleSubmit,
        formState: { errors },
        register,
    } = useForm({
        values: {
            moto: { ...moto.data },
            mecanica: {
                ...ficha.data?.mecanica,
                Cilindrada: moto.data?.cilindrada, //todo lo que no sea un numero por un espacio vacio
            },
            configuracion: {
                ...ficha.data?.configuracion,
                Equipamiento:
                    ficha.data?.configuracion?.Equipamiento.join(" | "),
            },
        },
    });

    function searchErr() {
        if (motoImg.err || fichasImg.err || fichasImg.files.length === 0) {
            if (motoImg.err) {
                setMotoImg((prev) => {
                    return { ...prev, err: "error en la imagen" };
                });
            }

            if (fichasImg.err) {
                setFichasImg((prev) => {
                    return { ...prev, err: "error en las imagenes" };
                });
            }

            if (fichasImg.files.length === 0) {
                setFichasImg((prev) => {
                    return { ...prev, err: "debe tener imagenes" };
                });
            }

            return true;
        }

        return false;
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

        const datos = { moto, mecanica, configuracion, eliminar };

        console.log(datos);

        const formData = new FormData();

        if (motoImg.file) {
            formData.append("motoImg", motoImg.file);
        }

        if (fichasImg.files.find((v) => v.file)) {
            const files = fichasImg.files.filter((v) => v.file);
            files.forEach((v) => {
                formData.append("fichaImgs", v.file);
            });
        }

        formData.append("datos", JSON.stringify(datos));

        actualizar.mutate(formData);
    }

    useEffect(() => {
        if (ficha.isSuccess) {
            setMotoImg((prev) => {
                return { ...prev, img: `${base}/imgs/big/${moto.data.img}` };
            });
            setFichasImg((prev) => {
                const listaImgs = ficha.data.imagenes.map((v) => {
                    return {
                        file: null,
                        img: `${base}/imgs/big/${v}`,
                        nombreBase: v,
                        id: nanoid(10),
                    };
                });
                return { ...prev, files: listaImgs };
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ficha.isSuccess]);

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
                                required: "Campo requerido",
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
                        setEliminar={setEliminar}
                    />
                </div>
                <div className="select-div">
                    <div>
                        <h2>Marca</h2>
                        <select
                            {...register("moto.marca", {
                                required: "Campo requerido",
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
