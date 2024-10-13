import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";

export default function SeeReviesOfUsers() {
    const axiosPrivate = useAxiosPrivate();
    const { id } = useParams();

    const reviews = useQuery({
        queryFn: async () => {
            const { data } = await axiosPrivate(
                `reviews/get-by-user-populate/${id}`
            );
            return data;
        },
        queryKey: ["users", id],
        refetchOnWindowFocus: false,
    });

    if (reviews.isLoading) {
        return <div>cargando...</div>;
    }
    if (reviews.isError) {
        return <div>error</div>;
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>comentario positivo</th>
                        <th>comentario negativo</th>
                        <th>moto</th>
                        <th>marca</th>
                        <th>state</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.data.map((v) => {
                        console.log(v)
                        return (
                            <tr key={v._id}>
                                <td>{v.opinionPositiva}</td>
                                <td>{v.opinionNegativa}</td>
                                <td>{v.moto.nombre}</td>
                                <td>{v.marca.marca}</td>
                                <td>{v.state}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
