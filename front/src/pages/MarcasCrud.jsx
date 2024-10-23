import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { base } from "../rutas";
import { useNavigate } from "react-router-dom";

export default function MarcasCrud() {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const marcas = useQuery({
        queryKey: ["marcas"],
        queryFn: async () => {
            const { data } = await axiosPrivate("marcas");
            return data;
        },
        refetchOnWindowFocus: false,
    });

    const eliminar = useMutation({
        mutationFn: async (id) => {
            await axiosPrivate.delete(`marcas/${id}`);
        },
        onError: (error) => {
            console.log(error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["marcas"] });
        },
    });

    if (marcas.isLoading) {
        return <div>cargando...</div>;
    }

    if (marcas.isError) {
        return <p>error</p>;
    }

    return (
        <div className="marcas-crud-page">
            <h1>Administrar Marcas</h1>
            <button onClick={() => navigate("crear")}>crear marca</button>
            <div className="contenedor-grid">
                {marcas.data.map((v) => {
                    return (
                        <div className="casilla-val" key={v._id}>
                            <img src={`${base}/imgs/basics/${v.img}`} />
                            <div className="botones">
                                <button onClick={() => navigate(v._id)}>
                                    editar
                                </button>
                                <button onClick={() => eliminar.mutate(v._id)}>
                                    eliminar
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
