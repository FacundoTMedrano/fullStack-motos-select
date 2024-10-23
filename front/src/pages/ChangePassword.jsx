import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useMutation } from "@tanstack/react-query";
import zodSchema from "../schemas/changePassword.js";

export default function ChangePassword() {
    const axiosPrivate = useAxiosPrivate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(zodSchema),
    });

    const change = useMutation({
        mutationFn: async (dato) => {
            const { data } = await axiosPrivate.post(
                "auth/change_password",
                dato
            );
            console.log(data);
        },
        onError: (error) => {
            console.log(error.message);
        },
    });

    return (
        <div className="change-password-page">
            <div className="contenedor">
                <h1>Cambiar Contraseña</h1>
                <form
                    onSubmit={handleSubmit(change.mutate)}
                    style={{ display: "flex", flexDirection: "column" }}
                >
                    <div>
                        <label htmlFor="old-password">Contraseña actual</label>
                        <input
                            id="old-password"
                            type="password"
                            {...register("oldPassword")}
                        />
                        {errors?.oldPassword?.message && (
                            <p>{errors.oldPassword.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password">Nueva contraseña</label>
                        <input
                            id="password"
                            type="password"
                            {...register("newPassword")}
                        />
                        {errors?.newPassword?.message && (
                            <p>{errors.newPassword.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="new-password">
                            Repetir nueva contraseña
                        </label>
                        <input
                            id="new-password"
                            type="password"
                            {...register("repetNewPassword")}
                        />
                        {errors?.repetNewPassword?.message && (
                            <p>{errors.repetNewPassword.message}</p>
                        )}
                    </div>
                    <div className="boton">
                        <button disabled={change.isPending || change.isSuccess}>
                            Aceptar
                        </button>
                    </div>
                </form>
                {change.isError && <p>error en los datos</p>}
                {change.isSuccess && <p>exito al cambiar la contraseña</p>}
            </div>
        </div>
    );
}
