import Constant from "./utils/consants";
import _ from "lodash";
import * as errors from "../../errors";
import Guid from "guid";
import cache from "memory-cache";
import eventsBus from "../../events";
import apiMail from "../mail";
import mail from "../../mail";
import {fun as users} from "auth-module/UserFunction";
import {getUserName} from "./utils/utils";
import {PAGE_NO, PAGE_SIZE} from "../../constants/application";

let ErrorCode = Constant.ErrorCode;

let login = {

    async getAllUsers(object, options){
        let {currentPage = PAGE_NO, pageSize = PAGE_SIZE} = options.query;

        let allUsers = await users.getAllUser(null, {currentPage, pageSize});

        let totalPages = await users.getPageCount(pageSize);

        return {
            data: allUsers,
            meta: {
                currentPage, pageSize, totalPages
            },
            message: "All user fetched successfully"
        }
    },

    async getEmployee(object, options){

        let {user_id} = options.query;
        let emp = await users.getEmployee(user_id);
        return emp;
    },

    async login(object, options){
        let {key, password} = object;
        console.log("object", object);
        if (!key)
            throw new errors.ValidationError({message: 'Username Required', code: ErrorCode.USERNAME_REQUIRED});
        if (!password)
            throw new errors.ValidationError({message: 'Password Required', code: ErrorCode.PASSWORD_REQUIRED});

        let user = await users.getUserFromKey(key);

        // console.log("user => ", user);

        if (!(user && user.password)) {
            throw new errors.ValidationError({message: 'Invalid Username', code: ErrorCode.INVALID_USERNAME});
        }
        else if (!(user.password === password)) {
            throw new errors.ValidationError({message: 'Invalid Key and Password', code: ErrorCode.INVALID_PASSWORD});
        }

        let guid = Guid.create();
        cache.put(guid, user);
        console.log("guid user", cache.get(guid).user_id);

        return {
            user: user,
            auth_token: guid,
            message: "Login Successfully"
        }

    },

    async action(object, options){
        let {headers} = options;
        let userID = headers["wx-user-token"];

        let sql = 'select wx_modules.module_name,wx_modules.nav,wx_modules.subtitle,wx_modules.backgroundColor,wx_modules.textColor from wx_auth_role_assignment, wx_role_module_assignment, wx_modules where wx_auth_role_assignment.role_code = wx_role_module_assignment.role_code and wx_role_module_assignment.module_id= wx_modules.module_id and wx_auth_role_assignment.user_id=' + userID
        let modules = await users.findModules(sql);
        console.log("test data", modules)


        return modules[0];
    },

    async register(object, options){

        if (object instanceof Array) {
            /**
             * Bulk insert
             */
            let userObjects = _.map(object, userObject => {
                if (!userObject.username) {
                    userObject.username = getUserName(userObject.display_name);
                }
                return userObject;
            });


            let createdUsers = await users.createNewUsers(userObjects);
            // console.log("ok => ");
            return {
                data: createdUsers,
                message: "Users created successfully"
            };
        }


        let keys = ["display_name", "mobile", "work_email", "username", "password", "mobile2", "personal_email", "display_pic", "cover_pic", "is_active"];

        let userObject = _.pick(object, keys);

        if (!userObject.username) {
            userObject.username = getUserName();
        }

        let user = await users.createNewUser(userObject);

        if (false && userObject.work_email) {
            // send userObject in the background
            eventsBus.emit("SEND_USER_MAIL_EVENT", {
                subject: `Welcome to Workex`,
                email: userObject.work_email,
                template: `welcome`,
                tags: ['email-verification'],
                emailID
            }, {ownerEmail: "wokex@yzyz", siteUrl: "http://localhost:9000"});

        }
        if (userObject.mobile) {
            //TODO send Message
        }

        return {
            data: user,
            message: "User Created Successfully"
        }
    },


    async testCallBack(){
        return new Promise((resolve, reject) => {
            itsACallback(50, respose => {
                resolve(respose);
            });
        });
    },

    async testCallBack2(){
        itsACallback(50, respose => {
            return respose;
        });
    },
};

function itsACallback(val, callback) {
    setTimeout(() => {
        callback(val);
    }, 1000);
}


/**
 * Send email to the user asynchronously
 */
eventsBus.on("SEND_USER_MAIL_EVENT", async function (mailData, templateData) {
    let {subject, template, email, tags} = mailData;

    let content = await mail.utils.generateContent({
        data: templateData,
        template: template
    });

    // schedule reset password email for the user
    await apiMail.send({
        mail: {
            message: {
                to: email,
                subject: subject,
                html: content.html,
                text: content.text,
                tags: tags
            },
            options: {}
        }
    });
});


export default login;
