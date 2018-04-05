import {fun as master} from "master";
let error = require('../../errors');
let master_svc = {

    async getCSID(object, options){
        let {org_id, le_id}        =  options.query;
        if (!org_id && !le_id)
            throw  new error.ValidationError({message: "both org_id, le_id is required"});
        return await master.getCSID({org_id, le_id});
    },

    async  createCSID(object, options){
        let {org_id, le_id} = object;
        return await master.createCSID({org_id, le_id});
    },

    async getMaster(object, options){
        let {csid}        =  options.params;
        if (!csid)
            throw  new error.ValidationError({message: "csid is required"});
        return await master.getMasters({csid});
    },

    async createMaster(object, options){
        let {csid}              =  options.params;
        let {title, code}       = object;

        if (!csid)
            throw  new error.ValidationError({message: "csid is required"});
        if (!title)
            throw  new error.ValidationError({message: "title is required"});
        if (!code)
            code = _.snakeCase(title);

        return await master.createMaster({code, title, csid});
    },

    async getHeader(object, options){
        let {master_id}        =  options.params;
        return await master.getHeader({master_id});
    },

    async createHeader(object, options){
        let {master_id}                                                =  options.params;
        let {code, title, type, typeMasterId, typeMasterHeaderId}      = object;

        if (!master_id)
            throw  new error.ValidationError({message: "master_id is required"});
        if (!title)
            throw  new error.ValidationError({message: "title is required"});
        if (!code)
            code = _.snakeCase(title);
        if (type.toLowerCase() == 'master') {
            if (!typeMasterId)
                throw  new error.ValidationError({message: "typeMasterId is required"});
            if (!typeMasterHeaderId)
                throw  new error.ValidationError({message: "typeMasterHeaderId is required"});
        }

        return master.createHeader({code, title, master_id, type, typeMasterId, typeMasterHeaderId});
    },

    async getData(object, options){
        let {master_id} = options.params;
        return await master.getEntry({master_id});
    },

    async postData(object, options){
        let {master_id, row_id} = options.params;
        return await master.createEntity(master_id, object, row_id);
    },

    async getHeaderData(object, options){
        let {header_id} =  options.params;
        return await master.getHeaderData({header_id});
    },

    async createData(object, options){
        let {header_id}          =  options.params;
        let {value, row_id}      = object;
        //TODO validation check
        return await master.createEntry({value, row_id, header_id});
    },

    async getDataFromCode(object, options){
        let {header_code} = options.params;
        return await master.getHeaderData({header_code});
    },
};

export default master_svc;
