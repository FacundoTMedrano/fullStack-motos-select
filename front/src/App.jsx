import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import ContextoProvider from "./context/ContextoBase";
import { Route, Routes } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import useRefresh from "./hooks/useRefresh";
import { useEffect } from "react";
import Marcas from "./pages/Marcas";
import MotosPorMarca from "./pages/MotosPorMarca";
import MotosPorCilindrada from "./pages/MotosPorCilindrada";
import MotosPorEstilo from "./pages/MotosPorEstilo";
import FichaTecnicaPage from "./pages/FichaTecnicaPage";

export default function App() {
    const { setLoading } = useAuth();
    const refresh = useRefresh();

    async function cargarUsuario() {
        try {
            await refresh();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        cargarUsuario();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ContextoProvider>
                        <Dashboard />
                    </ContextoProvider>
                }
            >
                <Route index element={<Marcas />} />
                <Route path="marca/:marca" element={<MotosPorMarca />} />
                <Route
                    path="cilindrada/:cilindrada"
                    element={<MotosPorCilindrada />}
                />
                <Route path="estilo/:estilo" element={<MotosPorEstilo />} />
                <Route
                    path="ficha_tecnica/:moto"
                    element={<FichaTecnicaPage />}
                />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
