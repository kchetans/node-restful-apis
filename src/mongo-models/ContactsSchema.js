import mongoose, {Schema} from "mongoose";
import baseModel from "./base";

/**
 * User Contacts
 */
const ContactsSchema = new Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_profiles',
        require: true
    },

    contact_no: {
        type: String,
        require: true
    },

    contact_name: {
        type: String,
        trim: true
    }

});

ContactsSchema.plugin(baseModel, {});

const ContactsModel = mongoose.model('user_contacts', ContactsSchema);

// expose the access model
export default ContactsModel;
