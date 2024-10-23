import { Link, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useContexto from "../hooks/useContexto";
import useAuth from "../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import espaciado from "../utils/espaciado";

export default function LogoutButon() {
    const {
        auth: { role },
        setAuth,
    } = useAuth();

    const { setSelectCaract, setSelectMoto } = useContexto();
    const navi = useNavigate();
    const axios = useAxiosPrivate();

    const [isOpen, setIsOpen] = useState(false);

    const salirMut = useMutation({
        mutationFn: async () => {
            const { data } = await axios.post("auth/logout");
            return data;
        },
        onSuccess: (data) => {
            console.log(data);
            setAuth((prev) => {
                const nuevo = {};
                for (let key in prev) {
                    nuevo[key] = null;
                }
                return nuevo;
            });
            setSelectCaract(() => {
                return JSON.stringify({ grupo: "", valor: "" });
            });
            setSelectMoto("");
            navi("/");
        },
        onError: (error) => {
            console.log(error.message);
        },
    });

    return (
        <div className="hamburgerMenu">
            {/* Icono de hamburguesa */}
            <div
                className={`hamburger-icon ${isOpen ? "--open" : ""}`}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>

            {/* Menú desplegable */}
            <div className="nav-burger">
                {!role ? (
                    <>
                        <Link to={"register"}>register</Link>
                        <Link to={"login"}>login</Link>
                    </>
                ) : (
                    <>
                        <Link to={`/${role}`}>{espaciado(role)}</Link>
                        <Link onClick={salirMut.mutate}>Salir</Link>
                    </>
                )}
            </div>
        </div>
    );
}
