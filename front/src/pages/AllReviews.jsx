// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState } from "react";
// import InputAllReviews from "../components/InputAllReviews";
// import { Link } from "react-router-dom";

export default function AllReviews() {
    const axiosPrivate = useAxiosPrivate();
    // const queryClient = useQueryClient();

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

    // const eliminar = useMutation({
    //     mutationFn: async (id) => {
    //         await axiosPrivate.delete(`reviews/delete-by-admin/${id}`);
    //     },
    //     onError: (error) => {
    //         console.log(error.message);
    //     },
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({ queryKey: ["reviews", "all"] });
    //         console.log("realizado");
    //     },
    // });

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
            (!marcaSelect || marcaSelect === v.marca) &&
            (!motoSelect || motoSelect === v.moto)
    );

    return (
        <div>
            <form>
                <select onChange={handleChangeMarca} value={marcaSelect}>
                    <option value="">selecciona una marca</option>
                    {marcas.data.map((v) => {
                        return (
                            <option key={v._id} value={v._id}>
                                {v.marca}
                            </option>
                        );
                    })}
                </select>

                <select onChange={handleChangeMoto} value={motoSelect}>
                    <option value="">selecciona una moto</option>
                    {motosFiltradas.map((v) => {
                        return (
                            <option key={v._id} value={v._id}>
                                {v.nombre}
                            </option>
                        );
                    })}
                </select>

                <select
                    onChange={(e) => setEstadoSelect(e.target.value)}
                    value={estadoSelect}
                >
                    <option value="">selecciona un estado</option>
                    <option value="approved">approved</option>
                    <option value="disapproved">disapproved</option>
                    <option value="pending">pending</option>
                </select>
            </form>

            {reviewsFiltrados.map((v) => {
                return (
                    <div key={v._id}>
                        <p>{v.moto}</p>
                    </div>
                );
            })}

            {/* <table>
                <thead>
                    <tr>
                        <th>n°</th>
                        <th>Link</th>
                        <th>Opinion positiva</th>
                        <th>Opinion negativa</th>
                        <th>estado</th>
                        <th>moto</th>
                        <th>marca</th>
                        <th>eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {reviewsFiltrados.map((v, i) => {
                        const moto = motos.data.find(
                            (val) => val._id === v.moto
                        );
                        const marca = marcas.data.find(
                            (marca) => marca._id === v.marca
                        );
                        return (
                            <tr key={v._id}>
                                <td>{i + 1}</td>
                                <td>
                                    <Link to={v._id}>Link</Link>
                                </td>
                                <td>{v.opinionPositiva}</td>
                                <td>{v.opinionNegativa}</td>
                                <td>{v.state}</td>
                                <td>{moto.nombre}</td>
                                <td>{marca.marca}</td>
                                <td>
                                    <button
                                        disabled={eliminar.isPending}
                                        onClick={() => eliminar.mutate(v._id)}
                                    >
                                        eliminar
                                    </button>
                                </td>
                                <td>
                                    {
                                        <InputAllReviews
                                            valor={v.state}
                                            id={v._id}
                                        />
                                    }
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table> */}
            {/* {!reviewsFiltrados.length && <p>sin reviews para mostrar</p>} */}
        </div>
    );
}
