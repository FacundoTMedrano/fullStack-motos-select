import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function AllReviews() {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    const [marcaSelect, setMarcaSelect] = useState("");
    const [motoSelect, setMotoSelect] = useState("");
    const [estadoSelect, setEstadoSelect] = useState("");

    const motos = useQuery({
        queryKey: ["motos"],
        queryFn: async () => {
            const { data } = await axiosPrivate("motos");
            return data;
        },
        refetchOnWindowFocus: false,
    });

    const marcas = useQuery({
        queryFn: async () => {
            const { data } = await axiosPrivate("marcas");
            return data;
        },
        queryKey: ["marcas"],
        refetchOnWindowFocus: false,
    });

    const reviews = useQuery({
        queryFn: async () => {
            const { data } = await axiosPrivate("reviews/get-all");
            return data;
        },
        queryKey: ["reviews", "all"],
        refetchOnWindowFocus: false,
    });

    const eliminar = useMutation({
        mutationFn: async (id) => {
            await axiosPrivate.delete(`reviews/delete-by-admin/${id}`);
        },
        onError: (error) => {
            console.log(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews", "all"] });
            console.log("realizado");
        },
    });

    function handleChangeMarca(e) {
        const valor = e.target.value;
        setMotoSelect("");
        setMarcaSelect(valor);
    }

    function handleChangeMoto(e) {
        const valor = e.target.value;
        setMotoSelect(valor);

        if (marcaSelect === "") {
            const moto = motos.data.find((v) => v._id === valor);
            setMarcaSelect(moto.marca);
        }
    }
    if (motos.isLoading || marcas.isLoading || reviews.isLoading) {
        return <div>cargando</div>;
    }

    if (motos.isError || marcas.isError || reviews.isError) {
        return <div>error</div>;
    }

    console.log(marcaSelect, motoSelect, estadoSelect);

    const motosFiltradas = motos.data.filter(
        (v) => !marcaSelect || v.marca === marcaSelect
    );

    let reviewsFiltrados = reviews.data.filter(
        (v) =>
            (!estadoSelect || estadoSelect === v.state) &&
            (!marcaSelect || marcaSelect === v.marca.marca) &&
            (!motoSelect || motoSelect === v.moto.nombre)
    );

    return (
        <div className="All-reviews-page">
            <h1>Todos los Reviews</h1>
            <form>
                <div>
                    <label htmlFor="marcaSelect">Marca</label>
                    <select
                        id="marcaSelect"
                        onChange={handleChangeMarca}
                        value={marcaSelect}
                    >
                        <option value="">selecciona una marca</option>
                        {marcas.data.map((v) => {
                            return (
                                <option key={v._id} value={v._id}>
                                    {v.marca}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div>
                    <label htmlFor="motoSelect">Moto</label>
                    <select
                        id="motoSelect"
                        onChange={handleChangeMoto}
                        value={motoSelect}
                    >
                        <option value="">selecciona una moto</option>
                        {motosFiltradas.map((v) => {
                            return (
                                <option key={v._id} value={v._id}>
                                    {v.nombre}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div>
                    <label htmlFor="estadoSelect">Estado</label>
                    <select
                        id="estadoSelect"
                        onChange={(e) => setEstadoSelect(e.target.value)}
                        value={estadoSelect}
                    >
                        <option value="">selecciona un estado</option>
                        <option value="approved">approved</option>
                        <option value="disapproved">disapproved</option>
                        <option value="pending">pending</option>
                    </select>
                </div>
            </form>
            <div className="contenedor">
                <ul>
                    {reviewsFiltrados.map((v) => {
                        return (
                            <li key={v._id} className="casilla">
                                <div className="info">
                                    <p>Opinion positiva</p>
                                    <span>:</span>
                                    <p>{v.opinionPositiva?.slice(0, 15)}</p>
                                </div>
                                <div className="info">
                                    <p>Opinion Negativa</p>
                                    <span>:</span>
                                    <p>{v.opinionNegativa?.slice(0, 15)}</p>
                                </div>
                                <div className="info">
                                    <p>Moto</p>
                                    <span>:</span>
                                    <p>{v.moto.nombre}</p>
                                </div>
                                <div className="info">
                                    <p>Marca</p>
                                    <span>:</span>
                                    <p>{v.marca.marca}</p>
                                </div>
                                <div className="info">
                                    <p>Estado</p>
                                    <span>:</span>
                                    <p>{v.state}</p>
                                </div>
                                <div className="link">
                                    <p>Ver Review</p>
                                    <span>:</span>
                                    <Link to={v._id}>Link</Link>
                                </div>
                                <div className="boton">
                                    <button
                                        disabled={eliminar.isPending}
                                        onClick={() => eliminar.mutate(v._id)}
                                    >
                                        eliminar
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                {!reviewsFiltrados.length && (
                    <div className="sin-reviews">
                        <h2>sin reviews para mostrar</h2>
                    </div>
                )}
            </div>
        </div>
    );
}
