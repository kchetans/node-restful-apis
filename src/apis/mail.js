// # Mail API
// API for sending Mail
import _ from "lodash";
import mail from "../mail";
import config from "config";
import * as errors from "../errors";
import Communications from '../mongo-models/Communications';

const mode = process.env.NODE_ENV;
let env = process.env.NODE_ENV;
console.log("env", env);
let isSendCrashMail = config.get('sendCrashMail') || false;
let mailer, apiMail;

/**
 * Send mail helper
 */
function sendMail(object) {
    if (!mailer) {
        mailer = new mail.WorkexMailer();
    }

    let comm = new Communications({mode: 'email', type: 'promotional', template: '', to: object.mail.message.to, provider: '', status: 'pending'});
    comm.save();

    return mailer.send(object.mail.message)
        .then(res => {
            console.log("MAIL : Res", res);
            comm.status = 'delivered';
            comm.status_udpate_time = Date.now();
            comm.save();
        })
        .catch(function (err) {
            console.log("MAIL : err", err);
            comm.status = 'pending';
            comm.status_udpate_time = Date.now();
            comm.save();
            return Promise.reject(new errors.EmailError({err: err}));
        });
}

/**
 * ## Mail API Methods
 *
 * **See:** [API Methods](index.js.html#api%20methods)
 * @typedef Mail
 * @param mail
 */
apiMail = {

    /**
     * Send an email
     * @param object => {
        mail: {
            message: {
                to     : email,
                subject: subject,
                html   : content.html,
                text   : content.text,
                tags   : tags
            },
            options: {}
        }
    }
     * @param options
     * @returns {*}
     */
    async send(object, options) {
        let mailData = object.mail;
        if (_.isEmpty(mailData)) throw new errors.ValidationError({message: 'Mail body is required.'});

        let message = mailData.message;
        if (_.isEmpty(message)) throw new errors.ValidationError({message: 'Mail message info is missing.'});

        let result = await sendMail(object, options);

        return {
            "message": result.message
        };
    },

    /**
     * ### SendTest
     * Send a test email
     *
     * @public
     * @param {Object} options required property 'to' which contains the recipient address
     * @returns {Promise}
     */
    async sendTest(object, options) {

        let content = mail.utils.generateContent({template: 'test'});
        let payload = {
            mail: {
                message: {
                    to: result.get('email'),
                    subject: 'Test Mail',
                    html: content.html,
                    text: content.text
                }
            }
        };

        await sendMail(payload);
    },

    async sendServeCrashMail(message, stacktrace){

        let content = await mail.utils.generateContent({
            data: {stacktrace, message, time: moment().format('MMMM Do YYYY, h:mm:ss a')},
            template: 'crash-report'
        });
        let payload = {
            mail: {
                message: {
                    to: config.get('crash_mails_ids') || [],
                    subject: `Crash Report in ${process.env.NODE_ENV}`,
                    html: content.html,
                    text: content.text
                }
            }
        };

        if (isSendCrashMail)
            await sendMail(payload);
        else
            console.log("Crash mail are not supported for this env");
    },

    async sendDownloadAppInviteMail({siteUrl, app_url, user_name, inviting_user, to_mail}){
        let content = await mail.utils.generateContent({
            data: {siteUrl, app_url, user_name, inviting_user},
            template: 'invite-user'
        });
        let payload = {
            mail: {
                message: {
                    to: to_mail,
                    Subject: `${inviting_user} has invited you on WorkEx`,
                    html: content.html,
                    text: content.text,
                    tags: 'app-invite'
                }
            }
        };
        return await sendMail(payload);
    },

    async sendWelcomeMail({user_name, siteUrl, to_mail, app_url, inviting_user}){
        let content = await mail.utils.generateContent({
            data: {siteUrl, app_url, user_name, inviting_user},
            template: 'welcome'
        });
        let payload = {
            mail: {
                message: {
                    to: to_mail,
                    subject: `${user_name}, Welcome Aboard WorkEx`,
                    html: content.html,
                    text: content.text
                }
            }
        };
        return await sendMail(payload);
    },

    async sendConfirmEmailMail({link_url, user_name, to_mail, valid_time}){
        let content = await mail.utils.generateContent({
            data: {email_verification_link: link_url, user_name, valid_time},
            template: 'confirm-email'
        });
        let payload = {
            mail: {
                message: {
                    to: to_mail,
                    subject: `Please verify your WorkEx Account`,
                    html: content.html,
                    text: content.text
                }
            }
        };
        return await sendMail(payload);
    },


    async sendRequestReviewMail({to_mail, contact_name, review_request_link, user_name}){
        let content = await mail.utils.generateContent({
            data: {contact_name, review_request_link, user_name},
            template: 'request-review'
        });
        let payload = {
            mail: {
                message: {
                    to: to_mail,
                    subject: `Write review for ${user_name}`,
                    html: content.html,
                    text: content.text
                }
            }
        };
        return await sendMail(payload);
    },


    async sendDailyStatsMail({jobs, users}){
        let content = await mail.utils.generateContent({
            data: {jobs, users},
            template: 'daily-admin-report'
        });
        let payload = {
            mail: {
                message: {
                    to: ['kartik.agarwal@workex.xyz', 'apoorv@workex.xyz', 'anupam@workex.xyz',
                        'chirag@workex.xyz', 'nimish@workex.xyz', 'tarun@workex.xyz'],
                    subject: `Daily Stats`,
                    html: content.html,
                    text: content.text
                }
            }
        };
        return await sendMail(payload);
    },

    async sendDailyStatsMail({jobs, users}){
        let content = await mail.utils.generateContent({
            data: {jobs, users},
            template: 'daily-admin-report'
        });
        let payload = {
            mail: {
                message: {
                    to: ['kartik.agarwal@workex.xyz', 'apoorv@workex.xyz', 'anupam@workex.xyz',
                        'chirag@workex.xyz', 'nimish@workex.xyz', 'tarun@workex.xyz'],
                    subject: `Daily Stats`,
                    html: content.html,
                    text: content.text
                }
            }
        };
        return await sendMail(payload);
    },

};

export default apiMail
