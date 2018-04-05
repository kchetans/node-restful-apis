import ui_engine from "ui-schema";
import config from "config";
import {URLS} from "../../constants/application";
import facility from "../facility/api";
let empProfileView = require('./employeeProfile');
let serverUrl      = config.get('url');
let {WxComponents} = require('ui-schema/constants');
let includes = require('_includes')
let mdb = includes.mdb;

let someName = {

    async employeeList(object, options){
        let {configID} = options.query;

        if (configID.includes('emp'))
            return ui_engine.section.init()
                .setAvatar(URLS.profile_pic)
                .setTitle('WorkEx Solution Private Limited.')
                .setSubTitle('Employee List')
                .addContent(
                    ui_engine.table.init()
                        .setTitle('THIS IS TABLE TITLE')
                        .setHeaders(['Emp ID', 'Name', 'Joining Date', 'Email ID', 'Desigation'])
                        .addColumn('id', '$empID$', WxComponents.LINK)
                        .addColumn('name', '$name$')
                        .addColumn('DOJ', '$doj$')
                        .addColumn('email', '$email$')
                        .addColumn('desigation', '$desigation$')
                        .setPaging(1, 16, Math.ceil(empList.length / 16), false)
                        .setDataOptions(empList)
                ).render();

        switch (configID) {
            case "all-facility":
                return facility.getView();
            case "defaultView":
                return someName.getDefaultView();
            default :
                return empProfileView.getProfileView()
        }
    },

    async Page_Config(object, options){
      let {csid} = options.query;
      return new Promise((resolve, reject) => {
        mdb.collection('components').findOne({csid: csid},function (err,docs){
            if(err){
            reject(err);
            }
            else{
              resolve(docs);
            }
          });
      });

    },

    async employee_List(object, options){
      let currentPage = options.query.currentPage || 1;
      let pageSize = options.query.pageSize || 15;

      return new Promise((resolve, reject) => {
        mdb.collection('employees').find(function (err,docs){
            if(err){
            reject(err);
            }
            else{
              let documents = []
              for(var i=0;i<docs.length;i++){
                docs[i].fname = docs[i].fname + currentPage
                documents.push(docs[i])
              }
              resolve(documents);
            }
          });
      });

    },

    async facility_List(object, options){
      let currentPage = options.query.currentPage || 1;
      let pageSize = options.query.pageSize || 15;

      return new Promise((resolve, reject) => {
        mdb.collection('facilities').find(function (err,docs){
            if(err){
            reject(err);
            }
            else{
              let documents = []
              for(var i=0;i<docs.length;i++){
                docs[i].fname = docs[i].fname + currentPage
                documents.push(docs[i])
              }
              resolve(documents);
            }
          });
      });

    },

    getDefaultView(){
        return ui_engine.default_template.init()
            .setHeader(ui_engine.header.init().setTitle("Page Title").setSubTitle("Subtitle").setAvatar("http://www.iconsfind.com/wp-content/uploads/2015/10/20151012_561bac77eb9eb.png"))
            .setContentUrl(serverUrl + 'api/feeder/' + 'rightPanel/')
            .addRightAction(ui_engine.button_raised.init().setTitle('Action1'))
            .addRightAction(ui_engine.button_raised.init().setTitle('Action2'))
            .render()
    }
};

export default someName;
