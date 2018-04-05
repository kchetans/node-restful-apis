import {fun as organisations} from "organisations/highLevel";
import {getOrgCode} from "./utils";
import _ from "lodash";

let obj = {

    async getAllOrganisations(object, options){

        let {org_code} = options.query;
        let org = await organisations._getAllOrganisations(undefined, {org_code});

        return {
            data   : org,
            message: "All Organisations fetched successfully"
        }
    },

    async createOrganisation(object, options){
        let keys   = ["org_name", "logo_file", "description", "org_code", "address_line1", "city", "state", "country", "pincode"];
        let newOrg = _.pick(object, keys);

        //TODO check orgCode, orgName

        if (!newOrg.org_code)
            newOrg.org_code = getOrgCode(newOrg.org_name);

        let org = await organisations.createNewOrganisation(newOrg);
        return {
            data   : org,
            message: "New Organisations created successfully"
        }
    }
};

export default  obj;
