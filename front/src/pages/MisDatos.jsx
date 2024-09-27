import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

export default function MisDatos() {
    const {
        auth: { name, email, role },
    } = useAuth();

    return (
        <div>
            <p>name: {name}</p>
            <p>email: {email}</p>
            <p>role: {role}</p>
            <div>
                <p>password: *****</p>
                <Link to={`/${role}/change_password`}>change Password</Link>
            </div>
        </div>
    );
}
