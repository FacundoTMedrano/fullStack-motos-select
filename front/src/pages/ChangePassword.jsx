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
        <form
            onSubmit={handleSubmit(change.mutate)}
            style={{ display: "flex", flexDirection: "column" }}
        >
            <label>
                old password
                <input
                    type="password"
                    autoComplete="false"
                    {...register("oldPassword")}
                />
                {errors?.oldPassword?.message && (
                    <p>{errors.oldPassword.message}</p>
                )}
            </label>
            <label>
                new password
                <input
                    type="password"
                    autoComplete="false"
                    {...register("newPassword")}
                />
                {errors?.newPassword?.message && (
                    <p>{errors.newPassword.message}</p>
                )}
            </label>
            <label>
                repeat new password
                <input
                    type="password"
                    autoComplete="false"
                    {...register("repetNewPassword")}
                />
                {errors?.repetNewPassword?.message && (
                    <p>{errors.repetNewPassword.message}</p>
                )}
            </label>
            {change.isError && <p>error en los datos</p>}
            {change.isSuccess && <p>exito al cambiar la contraseña</p>}
            <button disabled={change.isPending || change.isSuccess}>submit</button>
        </form>
    );
}
