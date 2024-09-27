import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { base } from "../rutas";
import { useSearchParams } from "react-router-dom";

export default function VerificationEmail() {
    const [querySearch] = useSearchParams();

    //validar antes de enviar
    const token = querySearch.get("token");
    const email = querySearch.get("email");
    console.log(email,token)

    const verify = useMutation({
        mutationFn: async () => {
            const { data } = await axios.post(
                `${base}/auth/verify-email`,
                { verificationToken: token, email },
                {
                    withCredentials: true,
                }
            );
            console.log(data);
        },
    });

    return (
        <div>
            {verify.isError && <p>error</p>}
            {verify.isPending && <p>loading...</p>}
            {verify.isSuccess && <p>cuenta verificada</p>}
            por favor haga click para verificar
            <button disabled={verify.isSuccess} onClick={verify.mutate}>
                verificar
            </button>
        </div>
    );
}
