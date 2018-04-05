import {fun as employees} from "employees/highLevel";
import {fun as employeesAnalytics} from "employees/analytics";
import * as _ from "lodash";
import {PAGE_NO, PAGE_SIZE} from "../../constants/application";
let excel_fns = require('excel_fns');
var path = require('path');
var api = require('_includes').api;

let obj = {

    async getAllEmployees(object, options){
        let {currentPage = PAGE_NO, pageSize = PAGE_SIZE} = options.query;

        object = object || {}
        // console.log("options",options.query)
        for (var property in options.query) {
            if (options.query.hasOwnProperty(property)) {
                object[property] = options.query[property]
            }
        }
        console.log("object", object)
        let allUsers = await employees.getAllEmployees(object, options.auth_user_id,
            {currentPage, pageSize});
        let totalPages = await employees.getPageCount(object, options.auth_user_id, pageSize);

        return {
            data: allUsers,
            meta: {
                currentPage, pageSize, totalPages
            },
            message: "All user fetched successfully"
        }
    },
    async getSummary(object, options){
        return [
            {
                title: "Employees",
                count: await employeesAnalytics.getEmployeeCount(options.auth_user_id),
                type: "widget_p01",
                icon_name: "fa-users",
                bgcolor: "#27C24C"
            },
            {
                title: "Agencies",
                count: await employeesAnalytics.getAgenciesCount(options.auth_user_id),
                type: "widget_p01",
                icon_name: "fa-building-o",
                bgcolor: "#F05050"
            },
            {
                title: "New Joinees",
                count: await employeesAnalytics.getNewJoineesCount(options.auth_user_id),
                type: "widget_p01",
                icon_name: "icon-user-follow",
                bgcolor: "#FF902B"
            },
            {
                title: "Exits",
                count: await employeesAnalytics.getExitsCount(options.auth_user_id),
                type: "widget_p01",
                icon_name: "fa-sign-out",
                bgcolor: "#1F983B"
            }
        ]
    },
    async exportAllEmployees(object, options){
        let allUsers = await employees.getAllEmployeesForExport(options.query);
        var columns =
            [
                {header: 'Employee_Code', key: 'Employee_Code'},
                {header: 'Employee_name', key: 'Employee_name'},
                {header: 'DOJ', key: 'DOJ'},
                {header: 'Designation', key: 'Designation'},
                {header: 'Agency', key: 'Agency'},
                {header: 'Center_Name', key: 'Center_Name'},
                {header: 'City', key: 'location'},
                {header: 'Contact_No', key: 'Contact_No'},
                {header: 'Last_Working_Date', key: 'Last_Working_Date'}
            ]
        // console.log("directory",__dirname)
        let filename = 'downloads/emp_list';
        let timestamp = new Date().getTime()
        filename = filename + timestamp + '.xlsx';
        await excel_fns.download_excel({
            data: allUsers,
            validations: [],
            columns: columns,
            filename: filename,
            //  complete: function(fname){
            //    'Complete Called'
            //    return fname;
            //  }
        });
        return filename
    },

    async handleAllEmployees(object, options){
        if (options.query.mode == "export") {
            return await obj.exportAllEmployees(object, options)
        }
        else {
            return await obj.getAllEmployees(object, options)
        }
    },

    async createNewEmployee(object, options){

        if (object instanceof Array) {
            /**
             * Bulk insert
             */
            return {
                data: await employees.createNewEmployees(object),
                message: "Employees created successfully"
            };
        }

        let keys = ["emp_id", "user_id", "pe_org_id", "pe_le_id", "pe_dm", "pe_facility_id", "pe_emp_code",
            "pe_pos_id", "pe_bu_id", "is_offroll", "emp_type", "DOJ", "DOL", "permanent_address",
            "correspondence_address", "DOB", "fname", "lname", "display_name", "mobile", "per_email",
            "work_email", "aadhar_no", "aadhar_file_url", "base_location_city", "base_location_state",
            "base_location_pincode", "gender", "fathers_name", "mothers_name", "marital_status", "spouse_name",
            "is_active"
        ];

        let newEmp = _.pick(object, keys);

        //TODO check validation

        let emp = await employees.createNewEmployee(newEmp)

        return {
            data: emp,
            message: "Employee created successfully"
        }
    },

    async GetActiveEmployeeByEmpcode(object, options){
        let {empcode} = options.query;
        let user = await employees.GetEmployeeByEmpcode(empcode)
        if (!user) {
            return {
                message: "Emp Code is invalid"
            }
        }
        else if (user.is_active) {
            return {
                data: user,
                message: "User fetched successfully"
            }
        }
        else return {
                message: "User is inactive"
            }
    },

    async GetEmployeeByEmpId(object, options){
        let {emp_id} = options.query;
        let user = await employees.GetEmployeeByEmpId(emp_id)
        if (!user) {
            return {
                message: "Emp Id is invalid"
            }
        }
        else return {
            data: user,
            message: "User fetched successfully"

        }
    },
    async createGA(object, options){
        let emp = await employees.createGA(object, options.auth_user_id)

        return {
            data: emp,
            message: "Employee created successfully"
        }
    },

    async createLeaver(object, options){
        let emp = await employees.createLeaver(object, options.auth_user_id)

        return {
            data: emp,
            message: "Employee exited successfully"
        }
    }
};

export default  obj;
