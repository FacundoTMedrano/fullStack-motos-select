import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

export default function MisDatos() {
    const {
        auth: { name, email, role },
    } = useAuth();

    return (
        <div className="mis-datos-page">
            <div className="contenedor">
                <h1>Perfil de Usuario</h1>
                <div>
                    <h2>nombre</h2>
                    <p>{name}</p>
                </div>
                <div>
                    <h2>Correo Electronico</h2>
                    <p>{email}</p>
                </div>
                <div>
                    <h2>Rol</h2>
                    <p>{role === "admin" ? "Administrador" : "Usuario"}</p>
                </div>

                <Link to={`/${role}/change_password`}>Cambiar contraseña</Link>
            </div>
        </div>
    );
}
