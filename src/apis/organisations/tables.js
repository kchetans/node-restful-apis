import {fun as organisations} from "organisations/curd";
import * as errors from "../../errors";

let obj = {

    async getEntityTypes(object, options){

        let {le_id} = options.query;
        if (!le_id)
            throw new errors.ValidationError({message: 'le_id  is required'});
        let entityTypes = await organisations.getEntityTypes({le_id});

        return _.map(entityTypes, entityType => Object.assign({}, {
            key: entityType.type_code,
            value: entityType.type_name,
        }))
    },

};

export default  obj;
