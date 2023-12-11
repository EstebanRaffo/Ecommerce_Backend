import winston from "winston";
import path from "path";
import { __dirname } from "../utils.js";
import { config } from "../config/config.js";

const environment = config.server.environment; 

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'magenta',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        http: 'grey',
        debug: 'white'
    }
}

const formatConsole = winston.format.combine(
    winston.format.colorize({colors: customLevelsOptions.colors}),
    winston.format.simple()
)

const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports:[
        new winston.transports.Console({
            level:"debug",
            format: formatConsole
        })
    ]
});

const prodLogger = winston.createLogger({
    transports:[
        new winston.transports.Console({
            level:"info",
            format: formatConsole
        }),
        new winston.transports.File({
            filename:path.join(__dirname,"/logs/errors.log"), 
            level:"error",
            format:winston.format.simple()
        })
    ]
});

let logger;
if(environment === "development"){
    logger = devLogger;
}else{
    logger = prodLogger;
}

export {logger};