import chalk from "chalk";
let showLog = true;

let socketLog = {

    __log(type, event_name, data){
        if (showLog)
            console.log(chalk.blue(`SOCKET : ${event_name}  ${type}  ${JSON.stringify(data)}`));
    },

    logEmit(type, data){
        socketLog.__log(type, "emit", data);
    },

    logError(message, socket){
        if (!message)
            console.log(chalk.blue(`SOCKET :  Socket not found for give user:  ${socket}`));
        else
            console.log(chalk.blue(`SOCKET :  ${message}`));
    },

    logSocketDisconnected(user_id, sSize){
        console.log(chalk.blue(`SOCKET :  Socket Disconnected with user_id : ${user_id} now socket map size id ${sSize}`));
    },

    logList(message, userIdToSocketMap){
        let usersIds = " ";
        for (let [key, value] of userIdToSocketMap) {
            usersIds += key + " ";
        }
        console.log(chalk.blue(`SOCKET : ${message} size : ${userIdToSocketMap.size} =>`, usersIds));
    },

};

export default socketLog;
