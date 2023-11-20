export default class UserDto{
    constructor(user){
        this.fullname = `${user.first_name} ${user.last_name}`,
        this.email = user.email,
        this.age = user.age,
        this.rol = user.rol,
        this.cart = user.cart
    }
}