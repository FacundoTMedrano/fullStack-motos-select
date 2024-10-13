import { NavLink, Outlet } from "react-router-dom";

export default function Admin() {
    return (
        <div>
            <nav>
                <NavLink to={"/"}>Inicio</NavLink>
                <NavLink to={"/admin"}>Datos</NavLink>
                <NavLink to={"/admin/motos"}>motos</NavLink>
                <NavLink to={"/admin/reviews"}>Reviews</NavLink>
                <NavLink to={"/admin/marcas"}>Marcas</NavLink>
                <NavLink to={"/admin/tipos"}>Tipos</NavLink>
                <NavLink to={"/admin/cilindradas"}>Cilindradas</NavLink>
                <NavLink to={"/admin/all-reviews"}>All Reviews</NavLink>
                <NavLink to={"/admin/ver-usuarios"}>Ver Usuarios</NavLink>
            </nav>
            <Outlet />
        </div>
    );
}
