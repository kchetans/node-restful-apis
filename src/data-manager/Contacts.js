import ContactsSchema from "../mongo-models/ContactsSchema";
let redis = require("../redis-module");

let contacts = {

    /**
     * add user contacts, for user
     * @param user_id
     * @param contacts
     * @returns {Promise.<void>}
     */
    async addContacts(user_id, contacts){
        if (Array.isArray(contacts)) {
            let objectToSave = _.map(contacts, ({contact_no, contact_name}) => {
                return {
                    user_id,
                    contact_no,
                    contact_name
                }
            });
            await ContactsSchema.insertMany(objectToSave);
        } else {
            let {contact_no, contact_name} = contacts;
            await new ContactsSchema({
                user_id,
                contact_no,
                contact_name
            }).save();
        }
    }

};

export default contacts;