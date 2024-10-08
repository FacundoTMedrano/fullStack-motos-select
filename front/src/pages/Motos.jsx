import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState } from "react";
import { base } from "../rutas";
import { useNavigate } from "react-router-dom";

export default function Motos() {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const [selectMarca, setSelectMarca] = useState("");

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

    const motos = useQuery({
        queryKey: ["motos"],
        queryFn: async () => {
            const { data } = await axiosPrivate("motos");
            return data;
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });

    if (marcas.isLoading || motos.isLoading) {
        return <div>cargando...</div>;
    }
    if (marcas.isError || motos.isError) {
        return <div>error</div>;
    }

    let motosFiltradas;
    if (selectMarca === "") {
        motosFiltradas = [];
    } else {
        motosFiltradas = motos.data.filter((v) => v.marca === selectMarca);
    }

    return (
        <div>
            <button onClick={()=>navigate("crear")}>crear moto</button>
            <select onChange={(e) => setSelectMarca(e.target.value)}>
                <option value="">selecciona una marca</option>
                {marcas.data.map((v) => {
                    return (
                        <option key={v._id} value={v._id}>
                            {v.marca}
                        </option>
                    );
                })}
            </select>
            {motosFiltradas.map((v) => {
                const imgBig = `${base}/imgs/big/${v.img}`;
                const imgMedium = `${base}/imgs/medium/${v.img}`;
                return (
                    <div key={v._id}>
                        <img
                            src={imgBig}
                            srcSet={`${imgBig} 500w,${imgMedium} 1000w`}
                            style={{ width: "250px" }}
                        />
                        <p>{v.nombre}</p>
                    </div>
                );
            })}
        </div>
    );
}
