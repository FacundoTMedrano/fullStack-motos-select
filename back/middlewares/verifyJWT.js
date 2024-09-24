import { verifyReturnData } from "../utils/jwt.js";
import CustomAPIErrors from "../errors/index.js";

export async function verifyJWT(req, res, next) {
    const authHeader = req.headers?.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        throw new CustomAPIErrors.UnauthenticatedError("require token verify"); //401
    }
    const token = authHeader.split(" ")[1];
    const decoded = await verifyReturnData(
        token,
        process.env.ACCESS_TOKEN_SECRET,
    );
    if (!decoded) throw new CustomAPIErrors.UnauthorizedError("invalid token"); //403
    req.id = decoded.user.id;
    req.role = decoded.user.role;
    next();
}
