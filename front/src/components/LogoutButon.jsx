import { NavLink, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useContexto from "../hooks/useContexto";
import useAuth from "../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";

export default function LogoutButon() {
    const {
        auth: { role },
        setAuth,
    } = useAuth();
    const { setSelectCaract, setSelectMoto } = useContexto();
    const navi = useNavigate();
    const axios = useAxiosPrivate();

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

    let button;
    if (!role) {
        button = (
            <div>
                <NavLink to={"register"}>register</NavLink>
                <NavLink to={"login"}>login</NavLink>
            </div>
        );
    } else {
        button = (
            <div>
                <button onClick={() => navi(`/${role}`)}>{role}</button>
                <button disabled={salirMut.isPending} onClick={salirMut.mutate}>
                    salir
                </button>
            </div>
        );
    }

    return button;
}
