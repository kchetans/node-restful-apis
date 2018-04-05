import uuid from "uuid";

let a = {

    prepareChatCardMessageForDB({employee_id, employer_id, message_guid = uuid.v1()}, type, job_posting,
                                pending_action_id = undefined){
        let for_user = employee_id;
        let sender = employer_id;
        let receiver = employee_id;
        let card_template = 'TEST';

        switch (type) {

        }

        let card = {job_posting, job_id: job_posting._id, card_template, pending_action_id};
        return {
            for_user, sender, receiver, type, message_guid, template: "card", card, text: "Sample Text",
        };
    },


    prepareChatCardMessageForUI(){

    },

};

export default a;