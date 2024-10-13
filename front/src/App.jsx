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
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerificationEmail from "./pages/VerificationEmail";
import NoAuthorized from "./pages/NoAuthorized";
import AuthGate from "./pages/AuthGate";
import RoleReq from "./pages/RoleReq";
import User from "./pages/User";
import Admin from "./pages/Admin";
import MisDatos from "./pages/MisDatos";
import ChangePassword from "./pages/ChangePassword";
import Reviews from "./pages/Reviews";
import EditarReview from "./pages/EditReview";
import Cilindradas from "./pages/Cilindradas";
import Tipos from "./pages/Tipos";
import MarcasCrud from "./pages/MarcasCrud";
import Motos from "./pages/Motos";
import CrearMoto from "./pages/CrearMoto";
import EditarMoto from "./pages/EditarMoto";
import AllReviews from "./pages/AllReviews";
import ReviewSeeOneAdmin from "./pages/ReviewSeeOneAdmin";
import SeeUsers from "./pages/SeeUsers";
import SeeReviesOfUsers from "./pages/SeeReviesOfUsers";

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
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="verificacion_email" element={<VerificationEmail />} />
            <Route path="no_autorizado" element={<NoAuthorized />} />
            <Route path="*" element={<NotFound />} />

            <Route element={<AuthGate />}>
                <Route element={<RoleReq rolePermitido={"admin"} />}>
                    <Route path="admin" element={<Admin />}>
                        <Route index element={<MisDatos />} />
                        <Route
                            path="change_password"
                            element={<ChangePassword />}
                        />
                        <Route path="reviews" element={<Reviews />} />
                        <Route path="reviews/:id" element={<EditarReview />} />
                        <Route path="cilindradas" element={<Cilindradas />} />
                        <Route path="tipos" element={<Tipos />} />
                        <Route path="marcas" element={<MarcasCrud />} />
                        <Route path="motos">
                            <Route index element={<Motos />} />
                            <Route path="crear" element={<CrearMoto />} />
                            <Route path="editar/:id" element={<EditarMoto />} />
                        </Route>
                        <Route path="all-reviews">
                            <Route index element={<AllReviews />} />
                            <Route path=":id" element={<ReviewSeeOneAdmin />} />
                        </Route>
                        <Route path="ver-usuarios" element={<SeeUsers />} />
                        <Route
                            path="ver-usuarios/:id"
                            element={<SeeReviesOfUsers />}
                        />
                    </Route>
                </Route>
                <Route element={<RoleReq rolePermitido={"user"} />}>
                    <Route path="user" element={<User />}>
                        <Route index element={<MisDatos />} />
                        <Route
                            path="change_password"
                            element={<ChangePassword />}
                        />
                        <Route path="reviews" element={<Reviews />} />
                        <Route path="reviews/:id" element={<EditarReview />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
}
