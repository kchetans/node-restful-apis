import {fun as exits} from "exits/highLevel";
import {PAGE_NO, PAGE_SIZE} from "../../constants/application";
let excel_fns = require('excel_fns');
var path = require('path');
var api = require('_includes').api;

let obj = {

    async getAllExits(object, options){
        let {currentPage = PAGE_NO, pageSize = PAGE_SIZE} = options.query;

        object = object || {}
        // console.log("options",options.query)
        for (var property in options.query) {
            if (options.query.hasOwnProperty(property)) {
                object[property] = options.query[property]
            }
        }
        console.log("object", object)
        let allExits = await exits.getAllExits(object, options.auth_user_id,
            {currentPage, pageSize});
        let totalPages = await exits.getPageCount(object, options.auth_user_id, pageSize);

        return {
            data: allExits,
            meta: {
                currentPage, pageSize, totalPages
            },
            message: "All exits fetched successfully"
        }
    },
    async RejectExit(object, options){
        let exit = await exits.RejectExit(options.query.exit_id, options.auth_user_id);
        return {
            data: exit,
            message: "Exit rejected successfully"
        }
    },
    async ApproveExit(object, options){
        let exit = await exits.ApproveExit(options.query.exit_id, options.auth_user_id);
        return {
            data: exit,
            message: "Exit approved successfully"
        }
    }
}
export default  obj;
