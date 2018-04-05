import mail from "../apis/mail";
import JobPostingSchema from "../mongo-models/JobPostingSchema";
import UsersProfileSchema from "../mongo-models/UsersProfileSchema";

const CronJob = require('cron').CronJob;

// start all the jobs
export const init = () => {

    /**
     * Run every dat at 10 PM
     */
    let time = "00 00 23 * * *";
    // let time = "* * * * *";
    if (process.env.NODE_ENV === "production") {
        console.log("Cron Registered");
        new CronJob(time, () => {
            console.log("------------------------------>CRON STARTED");
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            Promise.all([
                JobPostingSchema.count({created_at: {$gte: today}}),
                UsersProfileSchema.count({created_at: {$gte: today}})
            ]).then(res => {
                console.log("res", res);
                let [jobs, users] = res;
                return mail.sendDailyStatsMail({jobs, users});
            }).then(res => {
                console.log("res", res);
            }).catch(err => {
                console.log("err", err);
            });
        }, () => {
            console.log("JOBS stop");
        }, true, 'Asia/Kolkata');
    }

    return Promise.resolve();
};