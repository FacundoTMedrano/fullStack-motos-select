//pagina reviews de dashboard del usuario/admin
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Reviews() {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();
    const navi = useNavigate();

    const {
        auth: { role },
    } = useAuth();
    const reviews = useQuery({
        queryKey: ["reviews"],
        queryFn: async () => {
            const { data } = await axiosPrivate.get("reviews/my-reviews");
            return data;
        },
        refetchOnWindowFocus: false,
    });

    const eliminarReview = useMutation({
        mutationFn: async (id) => {
            await axiosPrivate.delete(`reviews/delete/${id}`);
        },
        onError: (error) => {
            console.log(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
        },
    });

    if (reviews.isLoading) {
        return <div>Cargando...</div>;
    }

    if (reviews.isError) {
        return <p>error</p>;
    }

    if (reviews.data.length === 0) {
        return <div>sin reviews para mostrar</div>;
    }

    return reviews.data.map((v) => {
        return (
            <div
                key={v._id}
                style={{ border: "1px solid black", margin: "5px" }}
            >
                <p>{v.opinionNegativa}</p>
                <p>{v.opinionPositiva}</p>
                <p>{v.moto.nombre}</p>
                <p>{v.moto.marca.marca}</p>
                <button onClick={() => eliminarReview.mutate(v._id)}>
                    borrar
                </button>
                <button onClick={() => navi(`/${role}/reviews/${v._id}`)}>
                    editar
                </button>
            </div>
        );
    });
}
