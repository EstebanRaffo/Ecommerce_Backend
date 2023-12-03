export default class CustomError{
    static createError({name="Error", cause, message, error_code=1}){
        const error = new Error(message, {cause});
        error.name = name;
        error.code = error_code;
        console.log("CustomError: ", error)
        throw error;
    }
}