/**
 * Created by Raghvendra Srivastava
 * on 16 June 2017
 */
import NotificationSchema from "../../../mongo-models/NotificationSchema";
import UserProfileDataManager from "../../../data-manager/UserProfileDataManager";


let notifications = {

    async getNotifications(object, options) {
        let {user} = options;
        let {_id: forUser} = user;
        let {pageSize = 15, pageNo = 0} = options.query;
        pageSize = parseInt(pageSize);
        pageNo = parseInt(pageNo);

        let notifications = await NotificationSchema.find({
            forUser,
            read: false
        }, ["type", "body", 'created_at']).skip(pageSize * pageNo).limit(pageSize).sort({created_at: -1}).lean();

        notifications = _.map(notifications, notification => {
            return Object.assign({}, {
                type: notification.type,
                body: notification.body,
                created_at: moment(notification.created_at).fromNow()
            });
        });

        return {
            data: {
                notifications,
                meta: {
                    pageSize,
                    pageNo
                }
            },
            message: "Notification fetched successfully"
        }
    },

    async setNotificationsAsSeen(object, options) {
        let notificationIds = _.map(object, item => item.notification_id);
        await NotificationSchema.update({_id: {$in: notificationIds}, read: false}, {$set: {read: true}}).exec();

        return {
            message: "Notification set as seen successfully"
        }
    },

    async getFeedNotification(object, options){
        let {user} = options;
        let profile_percentage = await UserProfileDataManager.getProfilePercentage(user._id);
        let data = [];

        if (!user.name) {
            // not need to send notification
        }
        else if (profile_percentage < 60) {
            data.push({
                image: 'http://icons.iconarchive.com/icons/dtafalonso/ios8/512/Tips-icon.png',
                title: 'Complete your profile',
                text: 'Completing the profile will enhance your chances of success by 10x.',
                action: {code: 'profile', args: {}}
            });
        }

        return {
            data,
            message: ""
        }
    }

};

export default notifications;