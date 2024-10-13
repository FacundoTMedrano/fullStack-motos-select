import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

export default function SeeUsers() {
    const axiosPrivate = useAxiosPrivate();
    const {
        auth: { id },
    } = useAuth();

    const users = useQuery({
        queryFn: async () => {
            const { data } = await axiosPrivate("user");
            return data;
        },
        queryKey: ["users"],
        refetchOnWindowFocus: false,
    });

    if (users.isLoading) {
        return <div>cargando...</div>;
    }
    if (users.isError) {
        return <div>error</div>;
    }

    console.log(users.data, "ss");
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>approved</th>
                        <th>desapproved</th>
                        <th>pending</th>
                        <th>total</th>
                        <th>Ver Reviews</th>
                    </tr>
                </thead>
                <tbody>
                    {users.data.map((v) => {
                        return (
                            <tr key={v._id}>
                                <td>{v._id === id ? "tu" : v.name}</td>
                                <td>{v.email}</td>
                                <td>{v.role}</td>
                                <td>{v.approvedCount}</td>
                                <td>{v.disapprovedCount}</td>
                                <td>{v.pendingCount}</td>
                                <td>{v.totalReviews}</td>
                                <td>
                                    <Link to={v._id}>Link</Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
