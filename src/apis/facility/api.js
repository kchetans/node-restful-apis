const errors = require('../../errors');
import config from "config";
import {filtersToJSON} from "./utils";
import {WxComponents} from "ui-schema/constants";
// import FacilityList from "./facility-list";
import {fun as facilties} from "facilities/highLevel";
import _ from "lodash";
import ui_engine from "ui-schema";
let serverUrl = config.get('url');
let excel_fns = require('excel_fns');
var path      = require('path');

let facilityApi = {

    async getAllFacilities(object, options){
        let {currentPage = 0, pageSize = 15} = options.query;

        if (options.query.mode == 'export') {
            let allfacilties = await facilties.getAllFacilties(options.query, options.auth_user_id)
            console.log("allfacilties", allfacilties)
            var columns   =
                    [
                        {header: 'Facility_Name', key: 'facility_name'},
                        {header: 'Facility_Type', key: 'facility_type'},
                        {header: 'Address', key: 'address_line1'},
                        {header: 'Location', key: 'location'},
                        {header: 'Manager_Name', key: 'mgr_name'},
                        {header: 'Manager_ContactNo', key: 'mgr_contact'},
                    ]
            // console.log("directory",__dirname)
            let filename  = 'downloads/facility_list';
            let timestamp = new Date().getTime()
            filename      = filename + timestamp + '.xlsx';
            await excel_fns.download_excel({
                data       : allfacilties,
                validations: [],
                columns    : columns,
                filename   : filename
            });
            return filename
        }
        else {
            let allfacilties = await facilties.getAllFacilties(options.query, options.auth_user_id,
                {currentPage, pageSize});
            let totalPages   = await facilties.getPageCount(options.query, pageSize);

            return {
                data   : allfacilties,
                meta   : {
                    currentPage, pageSize, totalPages
                },
                message: "All facilities fetched successfully"
            }
        }
    },

    async getFacilityByID(object, options){
        let {facility_id} = options.query;
        let facility      = await facilties.getFacilityByID(facility_id)
        if (!facility) {
            return {
                message: "Id is invalid"
            }
        }
        else return {
            data   : facility,
            message: "Facility fetched successfully"

        }
    },

    async createFacility(object, options){
        return await facilties.createFacility(object);
    }
};

export default  facilityApi;
