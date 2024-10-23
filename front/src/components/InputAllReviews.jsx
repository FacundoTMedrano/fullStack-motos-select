import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

// eslint-disable-next-line react/prop-types
export default function InputAllReviews({ valor, id }) {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    const [val, setVal] = useState(valor);

    useEffect(() => {
        setVal(valor);
    }, [valor]);

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
            console.log("realizado");
        },
    });

    return (
        <>
            <select value={val} onChange={(e) => setVal(e.target.value)}>
                <option value="approved">approved</option>
                <option value="disapproved">disapproved</option>
                <option value="pending">pending</option>
            </select>
            <button
                disabled={val === valor || actualizar.isPending}
                type="button"
                onClick={() => actualizar.mutate(val)}
            >
                aceptar
            </button>
        </>
    );
}
