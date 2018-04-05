import {fun as master} from "master";
import * as _ from "lodash";
import {fun as organisations} from "organisations/highLevel";
import {fun as facilities} from "facilities/highLevel";

let master_svc = {

    async fetchMaster(object, options){
      let master_data  = await master.fetchMaster(options);
      console.log(master_data)
      return {
          data   : master_data,
          message: "All data fetched successfully"
      }
    },
    async fetchSAMaster(object, options){
      let attributes = [['le_name','text'],['le_id','value']]
      let master_data  = await organisations.fetchVendors(attributes, options.auth_user_id, options);
      console.log(master_data)
      let data = []
      for(var i=0;i<master_data.length;i++){
        data.push({
          text: master_data[i].le_name,
          value: master_data[i].le_id
        })
      }
      return {
          data   : data,
          message: "All data fetched successfully"
      }
    },
    async positionsMaster(object, options){
      let attributes = [['designation','text'],['pos_id','value']]
      let master_data  = await organisations.fetchPositions(attributes, options.auth_user_id, options);
      let data = []
      for(var i=0;i<master_data.length;i++){
        data.push({
          text: master_data[i].designation,
          value: master_data[i].pos_id,
          callback_obj: {
            pe_le_id: master_data[i].le_id,
            pe_bu_id: master_data[i].bu_id,
            designation: master_data[i].designation
          }
        })
      }
      return {
          data   : data,
          message: "All data fetched successfully"
      }
    },
    async facilitiesMaster(object, options){
      let master_data  = await facilities.getAllFacilties(options.query, options.auth_user_id, options);
      let data = []
      for(var i=0;i<master_data.length;i++){
        data.push({
          text: master_data[i].facility_name,
          value: master_data[i].facility_id,
          callback_obj: {
            base_location_city: master_data[i].city,
            base_location_state: master_data[i].state,
            base_location_pincode: master_data[i].pincode,
            center_type: master_data[i].facility_type,
            region: master_data[i].region
          }
        })
      }
      return {
          data   : data,
          message: "All data fetched successfully"
      }
    },
    async facilityTypesMaster(object, options){
      let master_data  = await facilities.getAllFacilties(options.query, options.auth_user_id, options);
      console.log(master_data)
      let data = []
      for(var i=0;i<master_data.length;i++){
        data.push({
          text: master_data[i].facility_type,
          value: master_data[i].facility_type,
        })
      }
      return {
          data   : data,
          message: "All data fetched successfully"
      }
    }
};

export default master_svc;
