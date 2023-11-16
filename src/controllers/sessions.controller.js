

export class SessionsController{

    static renderProfile = async (req,res)=>{
        const {first_name, last_name, email, age, rol} = req.user
        const isAdmin = rol === config.admin.rol; 
        res.render("profile",{message:"Usuario registrado correctamente", first_name, last_name, email, age, rol, isAdmin});
    }

    static renderFailSignup = (req,res)=>{
        res.render("signup",{error:"No se pudo registrar el usuario"});
    }

    static redirectToProducts = async(req,res)=>{
        res.redirect("/products");
    }

    static renderFailLogin = (req,res)=>{
        res.render("login",{error:"No se pudo iniciar sesion para el usuario"});
    }

    static logout = async(req,res)=>{
        try {
            req.session.destroy(err=>{
                if(err) return res.render("profile",{error:"No se pudo cerrar la sesion"});
                res.redirect("/login");
            })
        } catch (error) {
            res.render("profile",{error:"No se pudo cerrar la sesión"});
        }
    }

    static currentUser = (req,res)=>{
        if(req.user?.email){
            res.status(200).json({user:req.user});
        }else{
            res.redirect("/login");
        }
    }
}