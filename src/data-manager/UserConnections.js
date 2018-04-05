import UserConnectionsSchema from "../mongo-models/UserConnectionsSchema";
import UserPendingConnectionsSchema from "../mongo-models/UserPendingConnectionsSchema";
let redis = require("../redis-module");

let UserConnections = {

    async sendConnectionRequest(from_user, to_user){
        return await UserPendingConnectionsSchema({
            from_user, to_user
        }).save();
    },

    /**
     * check, given user is connected or not
     * @param from_user
     * @param to_user
     * @returns {Promise.<boolean>}
     *
     * return true, of users are connected,
     * else return false
     */
    async isConnected(from_user, to_user){
        return await !!UserConnectionsSchema.count({
            $or: [
                {from_user, to_user},
                {from_user: to_user, to_user: from_user}
            ]
        })
    },

    /**
     * connect 2 users,
     * @param from_user , user_id, who has send request
     * @param to_user , user_id who has accept request
     * @returns {Promise.<boolean>}
     *
     * return true, if they are connected successfully,
     * else return false
     */
    async connect(from_user, to_user){
        if (from_user === to_user)
            return false;
        if (await UserConnections.isConnected(from_user, to_user))
            return false;
        await UserPendingConnectionsSchema.delete({
            from_user, to_user
        });
        await new UserConnectionsSchema({
            from_user, to_user
        }).save();
        return true;
    },

    async disconnect(from_user, to_user){
        return await UserConnectionsSchema.deleteOne({
            $or: [
                {from_user, to_user},
                {from_user: to_user, to_user: from_user}
            ]
        })
    }

};

export default UserConnections;