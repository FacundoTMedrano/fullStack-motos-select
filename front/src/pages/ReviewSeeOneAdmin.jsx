import { useParams, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import espaciado from "../utils/espaciado";

export default function ReviewSeeOneAdmin() {
    const { id } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [val, setVal] = useState("");

    const review = useQuery({
        queryFn: async () => {
            const { data } = await axiosPrivate(
                `reviews/get-single-review/${id}`
            );
            return data;
        },
        queryKey: ["reviews", "all", id],
        refetchOnWindowFocus: false,
        // enabled: !eliminar.isSuccess,
    });

    useEffect(() => {
        if (review.isSuccess) {
            setVal(review.data.state);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [review.isSuccess]);

    const actualizar = useMutation({
        mutationFn: async (data) => {
            await axiosPrivate.patch(`reviews/update-state-by-admin/${id}`, {
                state: data,
            });
        },
        onError: (error) => {
            console.log(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews", "all"] });
            queryClient.invalidateQueries({ queryKey: ["reviews", "all", id] });
            console.log("realizado");
        },
    });

    const eliminar = useMutation({
        mutationFn: async () => {
            await axiosPrivate.delete(`reviews/delete-by-admin/${id}`);
        },
        onError: (error) => {
            console.log(error.message);
        },
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["reviews", "all"] });
            navigate("/admin/all-reviews");
            console.log("realizado");
        },
    });

    if (review.isLoading) {
        return <div>cargando...</div>;
    }

    if (review.isError) {
        return <div>error</div>;
    }

    return (
        <div className="see-one-review-admin">
            <h1>Review</h1>
            <table>
                <tbody>
                    {Object.entries(review.data).map(([key, value]) => {
                        return (
                            <tr key={key}>
                                <th>{espaciado(key)}</th>
                                <td>{value}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="botones">
                <button
                    disabled={eliminar.isPending}
                    onClick={() => eliminar.mutate(id)}
                >
                    eliminar
                </button>
                <div className="cambio-estado">
                    <select
                        value={val}
                        onChange={(e) => setVal(e.target.value)}
                    >
                        <option value="approved">approved</option>
                        <option value="disapproved">disapproved</option>
                        <option value="pending">pending</option>
                    </select>

                    {val !== review.data.state && (
                        <button
                            disabled={actualizar.isPending}
                            onClick={() => actualizar.mutate(val)}
                        >
                            cambiar state
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
