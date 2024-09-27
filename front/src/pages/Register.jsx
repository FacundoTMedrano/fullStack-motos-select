import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
import axios from "axios";
import { base } from "../rutas";

const zodSchema = z.object({
    name: z.string().max(15),
    email: z
        .string()
        .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/)
        .max(40),
    password: z.string().max(25).min(5),
});

export default function Register() {
    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(zodSchema),
    });

    const registerMut = useMutation({
        mutationFn: async (datos) => {
            const { data } = await axios.post(`${base}/auth/register`, datos, {
                withCredentials: true,
            });
            console.log(data);
        },
        onSuccess: () => {
            reset();
        },
        onError: (error) => {
            //dependiendo el error podria ser que sea las credenciales malas
            console.log(error.message, error.response.data.msg);
        },
    });

    return (
        <div>
            {registerMut.error && <p>error</p>}
            {registerMut.isPending && <p>loading...</p>}
            {registerMut.isSuccess && <p>cuenta creada</p>}
            <form onSubmit={handleSubmit(registerMut.mutate)}>
                <input
                    placeholder="name"
                    type="text"
                    required
                    {...register("name")}
                />
                {errors.name?.message && <p>{errors.name?.message}</p>}
                <input
                    placeholder="email"
                    type="email"
                    required
                    {...register("email")}
                />
                {errors.email?.message && <p>{errors.email?.message}</p>}
                <input
                    required
                    placeholder="password"
                    type="password"
                    {...register("password")}
                />
                {errors.password?.message && <p>{errors.password?.message}</p>}
                <button disabled={registerMut.isSuccess}>enviar</button>
            </form>
        </div>
    );
}
