import dotenv from "dotenv";
dotenv.config();

export const config = {
    server:{
        secretSession: process.env.SECRET_SESSION,
        port: process.env.PORT,
        environment: process.env.NODE_ENV,
        productionDomain: process.env.DOMAIN_PROD
    },
    mongo:{
        url: process.env.MONGO_URL
    },
    github:{
        callbackUrl: process.env.GITHUB_CALLBACK_URL,
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET
    },
    admin:{
        user: process.env.USER_ADMIN,
        password: process.env.PASS_ADMIN,
        rol: process.env.ROL_ADMIN
    },
    gmail:{
        account: process.env.GMAIL_ACCOUNT,
        password: process.env.GMAIL_PASSWORD
    },
    stripe:{
        secretKey:process.env.STRIPE_SECRET_KEY,
        publicKey:process.env.JS_APP_STRIPE_KEY
    }
};