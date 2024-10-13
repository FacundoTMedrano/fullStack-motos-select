import { useParams, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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
        <div>
            <table>
                <tbody>
                    {Object.entries(review.data).map(([key, value]) => {
                        return (
                            <tr key={key}>
                                <th>{key}</th>
                                <td>{value}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <button
                disabled={eliminar.isPending}
                onClick={() => eliminar.mutate(id)}
            >
                eliminar
            </button>
            <select value={val} onChange={(e) => setVal(e.target.value)}>
                <option value="approved">approved</option>
                <option value="disapproved">disapproved</option>
                <option value="pending">pending</option>
            </select>
            <button
                disabled={val === review.data.state || actualizar.isPending}
                onClick={() => actualizar.mutate(val)}
            >
                cambiar state
            </button>
        </div>
    );
}
