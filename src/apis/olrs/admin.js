import {fun as olrs} from "olrs/highLevel";
import * as _ from "lodash";

import {PAGE_NO, PAGE_SIZE} from "../../constants/application";
let excel_fns = require('excel_fns');
var path = require('path');
var api = require('_includes').api;

let obj = {

    async getAllOLRs(object, options){
        let {currentPage = PAGE_NO, pageSize = PAGE_SIZE} = options.query;

        object = object || {}
        // console.log("options",options.query)
        for (var property in options.query) {
            if (options.query.hasOwnProperty(property)) {
                object[property] = options.query[property]
            }
        }
        console.log("object", object)
        let allOLRs = await olrs.getAllOLRs(object, options.auth_user_id,
            {currentPage, pageSize});
        allOLRs = _.map(allOLRs, allOLR => Object.assign({}, allOLRs, {
            DOB: moment(allOLRs.DOB).format("MMM Do YY"),
            DOJ: moment(allOLRs.DOJ).format("MMM Do YY")
        }))
        let totalPages = await olrs.getPageCount(object, options.auth_user_id, pageSize);

        return {
            data: allOLRs,
            meta: {
                currentPage, pageSize, totalPages
            },
            message: "All olrs fetched successfully"
        }
    },
    async RejectOLR(object, options){
        let olr = await olrs.RejectOLR(options.query.olr_id, options.auth_user_id);
        return {
            data: olr,
            message: "OLR rejected successfully"
        }
    },
    async ApproveOLR(object, options){
        let olr = await olrs.ApproveOLR(options.query.olr_id, options.auth_user_id);
        return {
            data: olr,
            message: "OLR approved successfully"
        }
    }
}
export default  obj;
