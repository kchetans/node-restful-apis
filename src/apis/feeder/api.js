const errors = require('../../errors');
import config from "config";
import {userClass as User} from "auth-module/User";
let Feed =  require("Feed/Feed").fun;
var redis = require('redis');
let bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
//import redis from "wx-redis";
//let redisClient = redis.client;
import {WxComponents} from "ui-schema/constants";
import _ from "lodash";
// import feedSocket from "../../socket/feed";
// import {TicketSystemUtils} from "ticket-system/cassandra/util";
import ui_engine from "ui-schema";
let serverUrl = config.get('url');
// import {getFeed, createFeed} from "FeedStore";
// let feed_store = require('FeedStore');

let ticketsApi = {

    /** FEEDER APIS **/

    async postFeed(object, options){


     let {headers}  = options;
     let userID     = headers["wx-user-token"];

     let act = await Feed.createNewActivity(object)

     let activity_id= act.activity_id
     let act_log = {
       user_id: userID,
       activity_id :activity_id,
       description:"text",

    }


     let actlog = await Feed.createNewActivityLog(act_log)
     let obj =await Feed.findDirectManager(userID)
     console.log(" manager_id=> ", obj.dm_id);
     let client = redis.createClient();
     
     client.set("foo","bar")
     client.lpush([obj.dm_id,activity_id], function(err, reply) {
     console.log(reply);
     });

    client.lrange(obj.dm_id, 0, -1, function(err, reply) {
    console.log(reply);
    });
    client.quit();
    },

    async getFeed(object, options){
        let {headers}  = options;
        let userID     = headers["wx-user-token"];
        let activity =""
        let client = redis.createClient();
        let activitylist=  await client.lrangeAsync(userID, 0, -1);
        let arr=[]
	console.log('jsonActivity arr');
        for (let i = 0; i < activitylist.length; i++){
           let obj = activitylist[i];
           activity = await Feed.getActivity(obj)
	   console.log('parse activity', JSON.parse(activity.feed_data));
	   //let jsonActivity = JSON.parse(activity);
	  console.log('jsonActivity',activity);
           arr.push(JSON.parse(activity.feed_data))
          }
         return arr

        client.quit();
    },

    async getFeedPageConfig(){
        let page = ui_engine.row_col_container.init()
            .setColumnCount(3).setColWidth([2.5, 7, 2.5]).setRowTop('xs')
            .addContent(ui_engine.fetch_container.init().setWebhook(serverUrl + 'api/feeder/' + 'leftPanel/'))
            .addContent(ui_engine.fetch_container.init().setWebhook(serverUrl + 'api/feeder/' + 'feeds/'))
            .addContent(ui_engine.fetch_container.init().setWebhook(serverUrl + 'api/feeder/' + 'rightPanel/'));

        return page.render();
    },

    async leftPannel(object, options){

        let {headers}  = options;
        let userID     = headers["wx-user-token"];
        let userobject = new User();
        let user       = await userobject.getUserByID('d507bcc7-258d-11e7-971e-036b8157e331');

        let imageUrl = '';
        if (user.firstname == 'Tanya') {
            imageUrl = 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAo5AAAAJDZkYmI0Y2MyLTQ0ZDAtNDM3Mi1iYTk2LWEzOGIyN2EzNTkzZg.jpg';
        } else if (user.firstname == 'Kartik') {
            imageUrl = 'https://media.licdn.com/mpr/mpr/shrinknp_1000_1000/AAEAAQAAAAAAAAiOAAAAJGI3NjZkNWI4LWY3YTktNDQ0Zi05MzA4LTc2ZDQ2OTY1ZDY1Mw.jpg';
        } else if (user.firstname == 'Tarun') {
            imageUrl = 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/2/000/1e1/13f/07ff6a0.jpg';
        } else {
            imageUrl = 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/3/000/00b/2bd/3a55610.jpg';
        }

        return ui_engine.section.init()
        // .addContent(
        //     ui_engine.row_col_container.init().setColumnCount(1).setRowCenter('xs').setRowSpacing(10)
        //         .addContent(ui_engine.avatar.init().setSize(80).setUrl(imageUrl).setBorderRadius('25%'))
        //         .addContent(ui_engine.span.init().setTitle(`${user.fn} ${user.ln}`))
        // )
            .addContent(ui_engine.button_flat.init().setTitle("Feed").setIcon('rss_feed').setLabelPositionRight())
            .addContent(ui_engine.button_flat.init().setTitle("Offer Letter").setIcon('insert_drive_file').setLabelPositionRight())
            .addContent(ui_engine.button_flat.init().setTitle("Recruitment").setIcon('group_add').setLabelPositionRight())
            .addContent(ui_engine.button_flat.init().setTitle("Onboarding").setIcon('person').setLabelPositionRight())
            .addContent(ui_engine.button_flat.init().setTitle("Termination").setIcon('clear').setLabelPositionRight())
            .addContent(ui_engine.button_flat.init().setTitle("Attendance Regis.").setIcon('insert_invitation').setLabelPositionRight())
            .addContent(ui_engine.button_flat.init().setTitle("Attribution Anal.").setIcon('tune').setLabelPositionRight())
            .addContent(ui_engine.button_flat.init().setTitle("Invoicing").setIcon('attach_money').setLabelPositionRight())
            .render();
    },

    async rightPannel(){
        return ui_engine.section.init()
            .addContent(ui_engine.span.init().setTitle("Pending Items").setSize(2))
            .addContent(ui_engine.row_col_container.init().setColumnCount(2).setColWidth([2, 10]).setPadding('14px 0 0px 0').setRowSpacing(5).setRowMiddle('xs')
                .addContent(ui_engine.avatar.init().setSize(30).setText("4").setTextColor("white").setBackgroundColor("#9ccc65").setBorderRadius('25%'))
                .addContent(ui_engine.span.init().setTitle("Leave Request"))
                .addContent(ui_engine.avatar.init().setSize(30).setText("11").setTextColor("white").setBackgroundColor("#ef5350").setBorderRadius('25%'))
                .addContent(ui_engine.span.init().setTitle("Feed Backs"))
                .addContent(ui_engine.avatar.init().setSize(30).setText("13").setTextColor("white").setBackgroundColor("#ffa726").setBorderRadius('25%'))
                .addContent(ui_engine.span.init().setTitle("Offer Letter approvals"))
                .addContent(ui_engine.avatar.init().setSize(30).setText("7").setTextColor("white").setBackgroundColor("#ab47bc").setBorderRadius('25%'))
                .addContent(ui_engine.span.init().setTitle("Complaints to attend")))
            .render();
    },

    async getFeeds(object, options){
        let {headers}  = options;
        let {orgID}    = options.params;
        let userID     = headers["wx-user-token"];

        let feeds = [];

        let userobject = new User();
        try {
            let user = await userobject.getUserByID('d507bcc7-258d-11e7-971e-036b8157e331');
        } catch (err) {

        }

        let feedSection = ui_engine.vertical_stack.init().setRowSpacing('0px 0px 5px 0px');

        feedSection.addContent(
            ui_engine.section.init().setTitle('Feed1').addContent(ui_engine.span.init().setTitle('Sample Feed 1'))
        );
        feedSection.addContent(
            ui_engine.section.init().setTitle('Feed2').addContent(ui_engine.span.init().setTitle('Sample Feed 2'))
        );
        feedSection.addContent(
            ui_engine.section.init().setTitle('Feed3').addContent(ui_engine.span.init().setTitle('Sample Feed 3'))
        );
        feedSection.addContent(
            ui_engine.section.init().setTitle('Feed4').addContent(ui_engine.span.init().setTitle('Sample Feed 4'))
        );
        feedSection.addContent(
            ui_engine.section.init().setTitle('Feed5').addContent(ui_engine.span.init().setTitle('Sample Feed 5'))
        );

        // let postNewFeedSection = ui_engine.section.init()
        //     .setTitle(`${user.fn} ${user.ln}`)
        //     .setSubTitle("Lead Developer")
        //     .setAvatar('https://media.licdn.com/mpr/mpr/shrinknp_100_100/AAEAAQAAAAAAAAiOAAAAJGI3NjZkNWI4LWY3YTktNDQ0Zi05MzA4LTc2ZDQ2OTY1ZDY1Mw.jpg')
        //     .addContent();

        // let olrApproval = ui_engine.section.init().setTitle("OLR Approvals")
        //     .setAvatar("http://www.ntid.rit.edu/sites/default/files/letter-icon.gif")
        //     .setSubTitle("2 OLRs Need Immediate Action")
        //     .addContent(
        //         ui_engine.table.init()
        //             .setHeaders(['OLR No', 'NAME', 'Designation', 'DOJ', 'CTC', 'Location', 'Approve'])
        //             .addColumn('olrNO', '$olrNO$', WxComponents.LINK)
        //             .addColumn('name', '$name$')
        //             .addColumn('designation', '$designation$')
        //             .addColumn('doj', '$doj$')
        //             .addColumn('ctc', '$ctc$')
        //             .addColumn('location', '$location$')
        //             .addColumn('approve', '$approve$', WxComponents.BUTTON_FLAT)
        //             .setDataOptions([
        //                 {
        //                     "olrNO"      : ui_engine.link.init().setTitle('OLR/103d').setUrl('/olr/103d').render(),
        //                     "name"       : 'Tanya Gupta',
        //                     "designation": 'Sr. Manager',
        //                     "doj"        : "Mar 26, 2017",
        //                     "nod"        : "5 Days",
        //                     "location"   : "Delhi",
        //                     "ctc"        : "17 LPA",
        //                     'approve'    : ui_engine.button_flat.init().setTitle('Approve').setWebhook(
        //                         `${serverUrl}api/ticket-system/feeds/669274a0-200c-11e7-9e8b-fb86fcb3800e`,
        //                         "POST", {
        //                             'Content-Type': 'application/json'
        //                         },
        //                         {feed: "Hello Tanya Gupta, YOUR OLR APPROVED"}
        //                     ).render()
        //                 }, {
        //                     "olrNO"      : ui_engine.link.init().setTitle('OLR/102s').setUrl('/olr/102s').render(),
        //                     "name"       : "Tarun",
        //                     "designation": 'Area Manager',
        //                     "doj"        : "Mar 15, 2017",
        //                     "nod"        : "3 Days",
        //                     "location"   : "Mumbai",
        //                     "ctc"        : "15 LPA",
        //                     'approve'    : ui_engine.button_flat.init().setTitle('Approve').setWebhook(
        //                         `${serverUrl}api/ticket-system/feeds/6cfdd3c0-200c-11e7-8480-d0b0682bed21`,
        //                         "POST", {
        //                             'Content-Type': 'application/json'
        //                         },
        //                         {feed: "Hello Tarun, YOUR OLR APPROVED"}
        //                     ).render()
        //                 }
        //             ]));
        //
        // let leaveApproval = ui_engine.section.init().setTitle("Leave Approvals")
        //     .setAvatar("http://www.ntid.rit.edu/sites/default/files/letter-icon.gif")
        //     .setSubTitle("3 Leave Request Pending for Approval")
        //     .addContent(
        //         ui_engine.table.init()
        //             .setHeaders(['Employee Code', 'NAME', 'Designation', 'Leave Type', 'Leave From', 'No Of Days', 'Approve'])
        //             .addColumn('code', '$code$', WxComponents.LINK)
        //             .addColumn('name', '$name$')
        //             .addColumn('designation', '$designation$')
        //             .addColumn('leaveType', '$leaveType$')
        //             .addColumn('leaveFrom', '$leaveFrom$')
        //             .addColumn('nod', '$nod$')
        //             .addColumn('approve', '$approve$', WxComponents.BUTTON_FLAT)
        //             .setDataOptions([
        //                 {
        //                     "code"       : ui_engine.link.init().setTitle('WX/101').setUrl('/profile/name1').render(),
        //                     "name"       : 'Tanya Gupta',
        //                     "designation": 'Sr. Manager',
        //                     "leaveType"  : "CL",
        //                     "leaveFrom"  : "Mar 26, 2017",
        //                     "nod"        : "5 Days",
        //                     'approve'    : ui_engine.button_flat.init().setTitle('Approve')
        //                         .setWebhook(
        //                             `${serverUrl}api/ticket-system/feeds/669274a0-200c-11e7-9e8b-fb86fcb3800e`,
        //                             "POST", {
        //                                 'Content-Type': 'application/json'
        //                             },
        //                             {feed: "Hello Tanya Gupta, YOUR Leave approved"}
        //                         ).render()
        //                 }, {
        //                     "code"       : ui_engine.link.init().setTitle('WX/102').setUrl('/profile/name1').render(),
        //                     "name"       : "Chirag Mittal",
        //                     "designation": 'Area Manager',
        //                     "leaveFrom"  : "Mar 15, 2017",
        //                     "leaveType"  : "PL",
        //                     "nod"        : "3 Days",
        //                     'approve'    : ui_engine.button_flat.init().setTitle('Approve').setWebhook(
        //                         `${serverUrl}api/ticket-system/feeds/7a0e8dc0-200c-11e7-87cf-8efd8e39a565`,
        //                         "POST", {
        //                             'Content-Type': 'application/json'
        //                         },
        //                         {feed: "Hello Chirag Mittal, YOUR Leave approved"}
        //                     ).render()
        //                 }, {
        //                     "code"       : ui_engine.link.init().setTitle('WX/103').setUrl('/profile/name1').render(),
        //                     "name"       : "Kartik Agarwal",
        //                     "leaveType"  : "SL",
        //                     "nod"        : "15 Days",
        //                     "leaveFrom"  : "Mar 25, 2017",
        //                     "designation": "Zone Head",
        //                     'approve'    : ui_engine.button_flat.init().setTitle('Approve').setWebhook(
        //                         `${serverUrl}api/ticket-system/feeds/7422bee0-200c-11e7-a63f-a4dd84b25af0`,
        //                         "POST", {
        //                             'Content-Type': 'application/json'
        //                         },
        //                         {feed: "Hello Kartik Agarwal, Your leave approved"}
        //                     ).render()
        //                 }
        //             ]));
        //
        // feedSection.addContent(leaveApproval);
        // feedSection.addContent(olrApproval);

        return feedSection.render();
    },

};

export default  ticketsApi;
