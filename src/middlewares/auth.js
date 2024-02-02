export const authorize = (roles) => {
    return async (req, res, next) => {
        if(!req.user) return res.status(401).json({error: "Usuario no autenticado"});
        if(!roles.includes(req.user.rol)) return res.status(403).json({
            status: "error",
            message:"Usuario no autorizado para acceder a este recurso"
        });
        next();
    }
}