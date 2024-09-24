import { useQueries } from "@tanstack/react-query";
import { axiosPublic } from "../services/api";

export default function useDatos() {
    const listaUrls = ["motos", "marcas", "estilos", "cilindradas"];
    const queriesData = useQueries({
        queries: listaUrls.map((v) => {
            return {
                queryKey: [v],
                queryFn: async () => {
                    const { data } = await axiosPublic(v);
                    return data;
                },
                refetchOnWindowFocus: false,
                refetchOnMount: false,
                staleTime: Infinity,
            };
        }),
    });

    const datos = {
        motos: queriesData[0].data ?? [],
        marcas: queriesData[1].data ?? [],
        estilos: queriesData[2].data ?? [],
        cilindradas: queriesData[3].data ?? [],
    };

    const loading = queriesData.some((v) => v.isLoading);
    const error = queriesData.some((v) => v.isError);
    return { datos, error, loading };
}
