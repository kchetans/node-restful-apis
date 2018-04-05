process.env.NODE_ENV = "development";
import mail from "../../src/apis/mail";

mail.sendWelcomeMail({
    user_name: "All",
    siteUrl: "workex.in",
    to_mail: "all@workex.xyz",
    inviting_user: "All",
    app_url: "http://workex.in"
}).then(res => console.log("res", res));