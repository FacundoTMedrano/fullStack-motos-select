import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import InputAllReviews from "../components/InputAllReviews";
import { Link } from "react-router-dom";

export default function AllReviews() {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();
    
    const [reviewsFiltrados, setReviewsFiltrados] = useState([]);
    const [motosFiltradas, setMotosFiltradas] = useState([]);

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

    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue,
        getValues,
    } = useForm();

    useEffect(() => {
        if (motos.isSuccess && marcas.isSuccess && reviews.isSuccess) {
            setReviewsFiltrados(reviews.data);
            setMotosFiltradas(motos.data);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        motos.isSuccess,
        marcas.isSuccess,
        reviews.isSuccess,
        reviews.isRefetching,
    ]);

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

    if (motos.isLoading || marcas.isLoading || reviews.isLoading) {
        return <div>cargando</div>;
    }

    if (motos.isError || marcas.isError || reviews.isError) {
        return <div>error</div>;
    }

    function handleDatos(datos) {
        console.log(datos);
        setReviewsFiltrados(() => {
            return reviews.data.filter(
                (v) =>
                    (!datos.state || datos.state === v.state) &&
                    (!datos.marcas || datos.marcas === v.marca) &&
                    (!datos.motos || datos.motos === v.moto)
            );
        });
    }

    return (
        <div>
            <form onSubmit={handleSubmit(handleDatos)}>
                <select
                    {...register("marcas", {
                        onChange: (e) => {
                            const valor = e.target.value;
                            setMotosFiltradas(() => {
                                if (valor === "") {
                                    return motos.data;
                                } else {
                                    return motos.data.filter(
                                        (v) => v.marca === valor
                                    );
                                }
                            });
                        },
                    })}
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
                {errors.marcas && <p>{errors.marcas.message}</p>}

                <select
                    {...register("motos", {
                        onChange: (e) => {
                            const valor = e.target.value;
                            const { marcas } = getValues();
                            if (marcas === "") {
                                const moto = motos.data.find(
                                    (v) => v._id === valor
                                );
                                setValue("marcas", moto.marca);
                                setMotosFiltradas(
                                    motos.data.filter(
                                        (v) => v.marca === moto.marca
                                    )
                                );
                            }
                        },
                    })}
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
                {errors.motos && <p>{errors.motos.message}</p>}

                <select {...register("state")}>
                    <option value="">selecciona un estado</option>
                    <option value="approved">approved</option>
                    <option value="disapproved">disapproved</option>
                    <option value="pending">pending</option>
                </select>
                {errors.state && <p>{errors.state.message}</p>}

                <button>buscar</button>
            </form>
            <table>
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
            </table>
            {!reviewsFiltrados.length && <p>sin reviews para mostrar</p>}
        </div>
    );
}
