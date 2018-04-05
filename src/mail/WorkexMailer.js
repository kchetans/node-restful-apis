// # Mail
// Handles sending email for Ghost
let _ = require('lodash'),
    Promise = require('bluebird'),
    validator = require('validator'),
    config = require('config');
import nodemailer from "nodemailer";
import * as nodeUtils from "../utils/utils";
import smtpTransport from "nodemailer-smtp-transport";
import {DEFAULT_EMAIL_FROM, MAIL_SERVICE} from "../constants/application";
import xoauth from "xoauth2";

// setup transport for gmail service
function _createGmailTransport(options) {
    const xoauthOptions = {
        user: options.user,
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        refreshToken: options.refreshToken
    };
    const generatorGmail = xoauth.createXOAuth2Generator(xoauthOptions);

    return nodemailer.createTransport(smtpTransport({
        /* use a pooled connection */
        pool: true,
        service: "gmail",
        auth: {
            xoauth2: generatorGmail
        }
    }));
}


export class WorkexMailer {

    constructor(mailConfig) {
        mailConfig = mailConfig || config.get('mail');

        let configArray = nodeUtils.makeArray(mailConfig);
        this.transportMap = {};
        for (let transportOptions of configArray) {
            let {from, options, service} = transportOptions;
            if (!from) throw new Error(`Invalid from email id.`);

            this.transportMap[from] = WorkexMailer._getTransport(service, options);
        }
    }


    /**
     * Create transport for thr given options
     * @param service
     * @param options
     * @return {*}
     */
    static _getTransport(service, options) {
        let mailService = service || MAIL_SERVICE.MAILGUN;
        let transport;

        _.extend(options, {
            /* pooled connection reuses the same connection */
            pool: true,
            /* maximum simultaneous connections to make against the SMTP server */
            maxConnections: 10,
            /*
             * message count to be sent using a single connection.
             * After maxMessages messages the connection is dropped and a new one is created for
             * the following messages
             */
            maxMessages: 10000
        });

        switch (mailService) {
            case MAIL_SERVICE.MAILGUN:
                transport = nodemailer.createTransport(options);
                break;

            case MAIL_SERVICE.GMAIL:
                transport = _createGmailTransport(options);
                break;
        }

        return transport;
    }

    static defaultFrom() {
        return DEFAULT_EMAIL_FROM;
    }

    /**
     * Sends an email message
     * @param messageInfo
     * @return {*}
     */
    async send(messageInfo) {

        // important to clone message as we modify it
        let message = _.clone(messageInfo) || {};
        let to = message.to || false;
        let from = message.from || WorkexMailer.defaultFrom();

        if (!(message && message.subject && message.html && message.to)) {
            throw new Error(`Invalid message object.`);
        }

        message = _.extend(message, {
            from, to, generateTextFromHTML: true, encoding: 'base64'
        });


        if (_.has(message, 'tags')) {
            let allTags = nodeUtils.makeArray(message.tags);
            allTags = allTags.slice(0, 3);
            delete message.tags;
            _.extend(message, {
                headers: {
                    "X-Mailgun-Tag": allTags
                }
            });
        }

        // console.log("this.transportMap", this.transportMap);
        // console.log("from", from);

        let mailTransport = this.transportMap[from];

        if (!mailTransport) throw new Error(`Invalid from email. No transport setup.`);

        return await mailTransport.sendMail(message);

    }
}
