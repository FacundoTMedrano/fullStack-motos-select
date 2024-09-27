import { Outlet, Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function RoleReq({ rolePermitido }) {
    const {
        auth: { role },
    } = useAuth();
    const location = useLocation();

    let navi;

    if (role === null) {
        navi = (
            <Navigate to={"/login"} state={{ from: location }} replace={true} />
        );
    }

    if (role !== rolePermitido) {
        navi = <Navigate to={"/no_autorizado"} replace={true} />;
    }
    if (role === rolePermitido) {
        navi = <Outlet />;
    }

    return navi;
}
