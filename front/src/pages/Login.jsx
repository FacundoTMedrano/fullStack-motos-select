import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { base } from "../rutas";

const zodSchema = z.object({
    email: z
        .string()
        .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
        .max(40),
    password: z.string().max(25).min(5),
});

export default function Login() {
    // const { role, setRole, token, setToken, setName, setEmail } = useAuth();
    const {
        auth: { role, accessToken },
        setAuth,
    } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(zodSchema),
    });

    useEffect(() => {
        if (accessToken && role) {
            navigate(from, { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken, role]);

    const logIn = useMutation({
        mutationFn: async (datos) => {
            const { data } = await axios.post(`${base}/auth/login`, datos, {
                withCredentials: true,
            });
            return data;
        },
        onSuccess: (data) => {
            console.log("success, loageado");
            setAuth(data);
            reset();
            navigate("/")
        },
        onError: (error) => {
            //dependiendo el error podria ser que sea las credenciales malas
            console.log(error.message, error.response.data.msg);
        },
    });

    return (
        <div className="login-page">
            <div className="contenedor">
                <h1>Iniciar sesion</h1>
                <form onSubmit={handleSubmit(logIn.mutate)}>
                    <div>
                        <label htmlFor="email">Correo Electronico</label>
                        <input
                            placeholder="nombre@gmail.com"
                            type="email"
                            required
                            {...register("email")}
                        />
                        {errors.email?.message && (
                            <p>{errors.email?.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            required
                            placeholder="password"
                            type="password"
                            {...register("password")}
                        />
                        {errors.password?.message && (
                            <p>{errors.password?.message}</p>
                        )}
                    </div>
                    <button>ingresar</button>
                </form>
                {logIn.isError && <p>error</p>}
                {logIn.isPending && <p>loading...</p>}
            </div>
        </div>
    );
}
