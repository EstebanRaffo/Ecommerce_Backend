export const authorize = (roles) => {
    return async (req, res, next) => {
        console.log("req.user: ", req.user)
        if(!req.user) res.status(401).json({error: "Usuario no autenticado"});
        if(!roles.includes(req.user.role)) res.status(403).json({error:"El usuario no tiene permisos para acceder a este recurso"});
        next();
    }
}