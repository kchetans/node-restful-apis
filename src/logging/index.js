import path from "path";
import config from "config";
import WorkExLogger from "./MainLogger";

let logsPath = path.join(config.get('paths:appRoot'), 'tmp', 'logs', 'workex-log-');

let logger = new WorkExLogger({
    env: config.get('env'),
    domain: config.get('server').host_name || "localhost",
    mode: process.env.NODE_MODE || config.get('logging:mode'),
    level: process.env.NODE_LEVEL || config.get('logging:level'),
    transports: config.get('logging:transports'),
    rotation: config.get('logging:rotation'),
    path: logsPath
});

module.exports = logger;
