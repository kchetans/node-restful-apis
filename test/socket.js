// let host = 'http://localhost:3000';
// let host = 'http://jobs.api.workex.in:3000';
let host = 'http://job.workex.in:9005';

let socket = require('socket.io-client')(host, {query: 'user_id=5965aec7bc3ccd71b85af015'});

console.log("ok");

const socket_constants = {
    TEST: 'test',
    CHAT: 'chat',
    CHAT_STATUS: 'chat_status',
    USER_STATUS: 'user_status',
    DISCONNECT: 'disconnect',
    CONNECTED: 'connect',
    OFFER_LETTER: 'offer_letter',
    JOB_APPLICATION_INTEREST: 'job_application', // => Employer end
    JOB_INTEREST: 'job_interest',
    INTERVIEW: 'interview',
    ERROR: 'error',
    ECHO: 'echo',
    connect_error: "connect_error",
    reconnect: "reconnect",
    reconnecting: "reconnecting",
    reconnect_attempt: "reconnect_attempt",
    reconnect_error: "reconnect_error",
    reconnect_failed: "reconnect_failed",
    connect_timeout: "connect_timeout"
};


for (let key in socket_constants) {
    socket.on(socket_constants[key], data => {
        console.log(key, data);
    });
}

// socket.emit(socket_constants.CHAT, {a: "ok"});
socket.emit(socket_constants.ECHO, "HELLO");


