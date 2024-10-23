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

    return (
        <div className="signed-review-page">
            <h1>Mis Reviews</h1>
            {reviews.data.length === 0 ? (
                <div className="sin-reviews">
                    <h1>sin reviews para mostrar</h1>
                </div>
            ) : (
                <div className="casillas">
                    {reviews.data.map((v) => {
                        return (
                            <div key={v._id} className="casilla">
                                <div className="valores">
                                    <h2>Opinion negativa</h2>
                                    <span>:</span>
                                    <p>{v.opinionNegativa}</p>
                                </div>
                                <div className="valores">
                                    <h2>Opinion positiva</h2>
                                    <span>:</span>
                                    <p>{v.opinionPositiva}</p>
                                </div>
                                <div className="valores">
                                    <h2>Nombre de moto</h2>
                                    <span>:</span>
                                    <p>{v.moto.nombre}</p>
                                </div>
                                <div className="valores">
                                    <h2>Nombre de marca</h2>
                                    <span>:</span>
                                    <p>{v.moto.marca.marca}</p>
                                </div>
                                <div className="botones">
                                    <button
                                        onClick={() =>
                                            eliminarReview.mutate(v._id)
                                        }
                                    >
                                        borrar
                                    </button>
                                    <button
                                        onClick={() =>
                                            navi(`/${role}/reviews/${v._id}`)
                                        }
                                    >
                                        editar
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
