/**
 * Created by Kartik Agarwal.
 */
// # Main Server
// Handles the creation of an HTTP Server for
import chalk from "chalk";

import config from "config";
import * as errors from "./errors";
let env = process.env.NODE_ENV;
const debug = require('debug')('workex:server');


// import i18n from  './i18n'
// import logging from './logging'

/**
 * ## Workex server
 * @constructor
 * @param {Object} rootApp - parent express instance
 */
class WorkexServer {

    constructor(rootApp) {
        this.rootApp = rootApp;
        this.httpServer = null;
        this.connections = {};
        this.connectionId = 0;

        // Expose config module for use externally.
        this.config = config;
    }

    start(externalApp) {
        debug('Starting...');
        let self = this,
            rootApp = externalApp ? externalApp : self.rootApp;

        return new Promise(function (resolve, reject) {

            let port = config.get('server').port;
            let host = config.get('server').host;
            self.httpServer = rootApp.listen(port, host);

            self.httpServer.on('error', function (error) {
                let serverError;
                if (error.errno === 'EADDRINUSE') {
                    serverError = new errors.CustomError({
                        message: `(EADDRINUSE) Cannot start Server. Port  ${port}
                                is already in use by another program. Is another Server instance already running?`
                    });
                } else {
                    serverError = new errors.CustomError({
                        message: `Code: ' ${error.errno} 'There was an error starting your server. \n Please use the error code above to search for a solution.`
                    });
                }
                reject(serverError);
            });

            self.httpServer.on('connection', self.connection.bind(self));
            self.httpServer.on('listening', function () {
                debug('...Started');
                self.logStartMessages();
                resolve(self);
            });
        });
    }

    /**
     * ### Restart
     * Restarts the ghost application
     * @returns {Promise} Resolves once Ghost has restarted
     */
    restart() {
        return this.stop().then(this.start.bind(this));
    }

    /**
     * ### Stop
     * Returns a promise that will be fulfilled when the server stops. If the server has not been started,
     * the promise will be fulfilled immediately
     * @returns {Promise} Resolves once Ghost has stopped
     */
    stop() {
        return new Promise((resolve) => {
            if (this.httpServer === null) {
                resolve(this);
            } else {
                this.httpServer.close(() => {
                    this.httpServer = null;
                    this.logShutdownMessages();
                    resolve(this);
                });
                this.closeConnections();
            }
        });
    }

    /**
     * ## Private (internal) methods
     *
     * ### Connection
     * @param {Object} socket
     */
    connection(socket) {
        this.connectionId += 1;
        socket._ghostId = this.connectionId;

        socket.on('close', () => {
            delete this.connections[this._ghostId];
        });

        this.connections[socket._ghostId] = socket;
    }


    /**
     * ### Close Connections
     * Most browsers keep a persistent connection open to the server, which prevents the close callback of
     * httpServer from returning. We need to destroy all connections manually.
     */
    closeConnections() {
        Object.keys(this.connections).forEach((socketId) => {
            let socket = this.connections[socketId];
            if (socket) {
                socket.destroy();
            }
        });
    }

    /**
     * ### Log Start Messages
     */
    logStartMessages() {
        // Startup & Shutdown messages
        if (env === 'production') {
            console.log(
                chalk.green(`Server is running in  ${env} ...`),
                '\nYour are live on',
                config.get('url'),
                chalk.gray('\nCtrl+C to shut down')
            );
        } else {
            console.log(
                chalk.green(` 🚵  Server is running in ${env} ...`),
                `\n 🌎  Listening on`,
                config.get('server').host + ':' + config.get('server').port,
                '\nUrl configured as:',
                config.get('url'),
                chalk.gray('\nCtrl+C to shut down')
            );
        }

        function shutdown() {
            console.log(chalk.red('\nServer has shut down'));
            if (env !== 'production') {
                console.log(
                    '\nWorkex was running for',
                    moment.duration(process.uptime(), 'seconds').humanize()
                );
            }
            process.exit(0);
        }

        // ensure that Ghost exits correctly on Ctrl+C and SIGTERM
        process.removeAllListeners('SIGINT').on('SIGINT', shutdown).removeAllListeners('SIGTERM').on('SIGTERM', shutdown);
    }

    /**
     * ### Log Shutdown Messages
     */
    logShutdownMessages() {
        console.log(chalk.red('Server is closing connections'));
    }
}

export default WorkexServer;
