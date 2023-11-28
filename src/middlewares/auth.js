export const authorize = (role) => {
    return async (req, res, next) => {
        console.log("req.user.role: ", req.user.role)
        if(!req.user) return res.status(401).json({error: "Usuario no autenticado"});
        if(req.user.role !== role) return res.status(403).json({error:"El usuario no tiene permisos para acceder a este recurso"});
        next();
    }
}