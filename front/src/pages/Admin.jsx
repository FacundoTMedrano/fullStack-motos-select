import { NavLink, Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { useState } from "react";

export default function Admin() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="dashboard-logeado">
            <div className="dash">
                <FaBars
                    className={!isOpen ? "burger" : "burger close"}
                    onClick={() => setIsOpen((prev) => !prev)}
                />
                <div className={!isOpen ? "menu" : "menu open"}>
                    <nav>
                        <NavLink
                            onClick={() => setIsOpen((prev) => !prev)}
                            to={"/"}
                        >
                            Inicio
                        </NavLink>
                        <NavLink
                            onClick={() => setIsOpen((prev) => !prev)}
                            to={"/admin"}
                        >
                            Datos
                        </NavLink>
                        <NavLink
                            onClick={() => setIsOpen((prev) => !prev)}
                            to={"/admin/motos"}
                        >
                            motos
                        </NavLink>
                        <NavLink
                            onClick={() => setIsOpen((prev) => !prev)}
                            to={"/admin/reviews"}
                        >
                            Reviews
                        </NavLink>
                        <NavLink
                            onClick={() => setIsOpen((prev) => !prev)}
                            to={"/admin/marcas"}
                        >
                            Marcas
                        </NavLink>
                        <NavLink
                            onClick={() => setIsOpen((prev) => !prev)}
                            to={"/admin/tipos"}
                        >
                            Tipos
                        </NavLink>
                        <NavLink
                            onClick={() => setIsOpen((prev) => !prev)}
                            to={"/admin/cilindradas"}
                        >
                            Cilindradas
                        </NavLink>
                        <NavLink
                            onClick={() => setIsOpen((prev) => !prev)}
                            to={"/admin/all-reviews"}
                        >
                            All Reviews
                        </NavLink>
                        <NavLink
                            onClick={() => setIsOpen((prev) => !prev)}
                            to={"/admin/ver-usuarios"}
                        >
                            Ver Usuarios
                        </NavLink>
                    </nav>
                    <IoIosCloseCircle
                        className="close"
                        onClick={() => setIsOpen((prev) => !prev)}
                    />
                </div>
            </div>
            <Outlet />
        </div>
    );
}
