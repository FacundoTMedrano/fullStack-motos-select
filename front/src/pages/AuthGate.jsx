import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function AuthGate() {
    const { loading } = useAuth();
    if (loading) {
        return <p>loading...</p>;
    } else {
        return <Outlet />;
    }
}
