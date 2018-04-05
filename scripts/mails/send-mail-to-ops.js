process.env.NODE_ENV = "development";
import mail from "../../src/apis/mail";

mail.send({
    mail: {
        message: {
            to: "kartik.agarwal@workex.xyz",
            subject: "New APK",
            html: "Hello Ops Walo, https://drive.google.com/open?id=0Bwwi2snW6FNXNGd5QmtqRzc4ZTA"
        },
        options: {}
    }
}, {}).then(res => console.log("res", res));