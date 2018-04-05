import mongoose, {Schema} from "mongoose";
import baseModel from "./base";

/**
 * User Connections,
 * Connections are by directional
 */
const UserPendingConnectionsSchema = new Schema({

    from_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_profiles',
        require: true
    },

    to_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_profiles',
        require: true
    },

});

UserPendingConnectionsSchema.plugin(baseModel, {});

const UserConnectionsModel = mongoose.model('user_pending_connections', UserPendingConnectionsSchema);

// expose the access model
export default UserConnectionsModel;
