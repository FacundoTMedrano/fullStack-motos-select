import { NavLink, Outlet } from "react-router-dom";
export default function User() {
    return (
        <div className="dashboard-logeado">
            <nav>
                <NavLink to={"/"}>Inicio</NavLink>
                <NavLink to={"/user"}>Datos</NavLink>
                <NavLink to={"/user/reviews"}>Reviews</NavLink>
            </nav>
            <Outlet />
        </div>
    );
}
