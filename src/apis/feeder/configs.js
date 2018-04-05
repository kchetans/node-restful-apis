import ui_engine from "ui-schema";
import map from "lodash/map";

let {WxComponents, WebHookConstants} =  require('ui-schema/constants');
const errors                         = require('../../errors');

let headerInfo = {
    notificationCount: 10,
    messageCount     : '20+',
    imageUrl         : 'https://media.licdn.com/mpr/mpr/shrinknp_100_100/AAEAAQAAAAAAAAiOAAAAJGI3NjZkNWI4LWY3YTktNDQ0Zi05MzA4LTc2ZDQ2OTY1ZDY1Mw.jpg'
};

let newTickets = {
    imageUrl   : 'https://fallout2015.files.wordpress.com/2015/06/ticketicon.png',
    description: 'Tickets from last 3 days',
    tickets    : [
        {
            raisedBy: 'Richard hendricks',
            profile : 'Sr. Developer',
            time    : moment().subtract(1, 'days').fromNow(),
            imageUrl: 'https://s-media-cache-ak0.pinimg.com/564x/8d/a1/39/8da1395cce1ee57ebab406b72af11031.jpg',
            issue   : {
                description: 'Need extension cord for my desk, as electricity plug is too far',
                time       : moment().subtract(1, 'days').subtract(3, 'hours').format('MMMM Do YYYY, h:mm:ss a'),
            }
        },
        {
            raisedBy: 'Erlich Bachman',
            profile : 'Sr. Marketing Head',
            time    : moment().subtract(2, 'days').fromNow(),
            imageUrl: 'https://cdn0.iconfinder.com/data/icons/hipster/128/Hipster-03-512.png',
            issue   : {
                description: 'Yesterday food provided in mess was really mess',
                time       : moment().subtract(2, 'days').subtract(7, 'hours').format('MMMM Do YYYY, h:mm:ss a'),
            }
        }, {
            raisedBy: 'Gilfoyle',
            time    : moment().subtract(3, 'days').fromNow(),
            profile : 'Sr. Architecture Designer',
            imageUrl: 'http://www.iconninja.com/files/724/464/875/member-blond-person-profile-human-user-account-man-white-avatar-people-face-male-icon.png',
            issue   : {
                description: 'Require more 1000TB ram for our new server space',
                time       : moment().subtract(3, 'days').subtract(9, 'hours').format('MMMM Do YYYY, h:mm:ss a'),
            }
        }
    ]
};

var tableDS = [
    {
        "id"       : "58dfb5370e3bf2730f51477f",
        "title"    : "Imperium",
        "updated"  : "Thu Jun 08 2006 09:49:25 GMT+0530 (IST)",
        "createdAt": "Sat Apr 17 1993 14:56:13 GMT+0530 (IST)",
        "name"     : "Mccullough Bass",
        "attempts" : 5,
        "status"   : "completed",
        "category" : "IT"
    },
    {
        "id"       : "58dfb537d004a256656d2322",
        "title"    : "Isologics",
        "updated"  : "Mon Jan 23 1984 01:31:42 GMT+0530 (IST)",
        "createdAt": "Sat Mar 04 1978 21:34:54 GMT+0530 (IST)",
        "name"     : "Bush Fitzpatrick",
        "attempts" : 10,
        "status"   : "completed",
        "category" : "HR"
    },
    {
        "id"       : "58dfb537c95944e58ad98b30",
        "title"    : "Scenty",
        "updated"  : "Wed Jul 05 1972 12:45:29 GMT+0530 (IST)",
        "createdAt": "Thu Apr 15 2010 16:59:09 GMT+0530 (IST)",
        "name"     : "Rice Flynn",
        "attempts" : 10,
        "status"   : "completed",
        "category" : "IT"
    },
    {
        "id"       : "58dfb537efc67f5cb95fef8b",
        "title"    : "Zilodyne",
        "updated"  : "Fri Apr 01 2016 20:01:04 GMT+0530 (IST)",
        "createdAt": "Sat Jan 26 1991 13:58:24 GMT+0530 (IST)",
        "name"     : "Cecile Stevenson",
        "attempts" : 8,
        "status"   : "completed",
        "category" : "IT"
    },
    {
        "id"       : "58dfb537c35be02395954b02",
        "title"    : "Xurban",
        "updated"  : "Fri May 13 1994 13:50:55 GMT+0530 (IST)",
        "createdAt": "Thu Oct 02 1986 17:01:01 GMT+0530 (IST)",
        "name"     : "Morse Neal",
        "attempts" : 9,
        "status"   : "completed",
        "category" : "HR"
    },
    {
        "id"       : "58dfb537d04bd53882f6bdbc",
        "title"    : "Irack",
        "updated"  : "Sat Jan 18 1975 13:24:10 GMT+0530 (IST)",
        "createdAt": "Wed Aug 14 1991 13:52:59 GMT+0530 (IST)",
        "name"     : "Eddie Velazquez",
        "attempts" : 5,
        "status"   : "pending",
        "category" : "HR"
    },
    {
        "id"       : "58dfb5376207617fe92538ab",
        "title"    : "Magnemo",
        "updated"  : "Wed Jul 16 2014 07:08:28 GMT+0530 (IST)",
        "createdAt": "Mon Jan 12 1976 09:38:17 GMT+0530 (IST)",
        "name"     : "Vicki Norton",
        "attempts" : 9,
        "status"   : "pending",
        "category" : "HR"
    },
    {
        "id"       : "58dfb5377412b7b4a3ab01de",
        "title"    : "Cinesanct",
        "updated"  : "Thu Sep 05 2002 08:25:06 GMT+0530 (IST)",
        "createdAt": "Fri Aug 12 2011 08:54:16 GMT+0530 (IST)",
        "name"     : "Arnold Bowman",
        "attempts" : 3,
        "status"   : "pending",
        "category" : "IT"
    },
    {
        "id"       : "58dfb5377d79d6b9440f124c",
        "title"    : "Zillan",
        "updated"  : "Sat Aug 22 1992 18:33:04 GMT+0530 (IST)",
        "createdAt": "Wed Feb 21 1990 22:09:10 GMT+0530 (IST)",
        "name"     : "James Fitzgerald",
        "attempts" : 5,
        "status"   : "pending",
        "category" : "HR"
    },
    {
        "id"       : "58dfb53771ecb7523ad709da",
        "title"    : "Boilicon",
        "updated"  : "Sat Jul 04 1998 01:56:06 GMT+0530 (IST)",
        "createdAt": "Fri Mar 02 1979 19:22:00 GMT+0530 (IST)",
        "name"     : "Parker Bean",
        "attempts" : 5,
        "status"   : "pending",
        "category" : "IT"
    },
    {
        "id"       : "58dfb537652f3e4eee474eb7",
        "title"    : "Euron",
        "updated"  : "Thu Nov 26 1970 05:01:32 GMT+0530 (IST)",
        "createdAt": "Thu Oct 10 1996 19:40:15 GMT+0530 (IST)",
        "name"     : "Mcneil Taylor",
        "attempts" : 6,
        "status"   : "pending",
        "category" : "IT"
    },
    {
        "id"       : "58dfb537b100db67dd5703f5",
        "title"    : "Geekol",
        "updated"  : "Mon Feb 18 2008 00:41:01 GMT+0530 (IST)",
        "createdAt": "Tue Apr 18 1972 17:39:37 GMT+0530 (IST)",
        "name"     : "Ora Peck",
        "attempts" : 3,
        "status"   : "completed",
        "category" : "IT"
    },
    {
        "id"       : "58dfb537d442227a476e779c",
        "title"    : "Enerforce",
        "updated"  : "Thu Nov 04 2010 20:29:23 GMT+0530 (IST)",
        "createdAt": "Sat May 06 1989 18:35:47 GMT+0530 (IST)",
        "name"     : "Shawna Wyatt",
        "attempts" : 3,
        "status"   : "pending",
        "category" : "HR"
    },
    {
        "id"       : "58dfb537a35184d487612674",
        "title"    : "Splinx",
        "updated"  : "Thu Dec 11 1986 17:01:46 GMT+0530 (IST)",
        "createdAt": "Tue Mar 09 2004 22:09:14 GMT+0530 (IST)",
        "name"     : "Warren Kelley",
        "attempts" : 6,
        "status"   : "pending",
        "category" : "IT"
    },
    {
        "id"       : "58dfb53707edb34fc86eacb4",
        "title"    : "Zolar",
        "updated"  : "Mon Jul 04 1994 12:21:00 GMT+0530 (IST)",
        "createdAt": "Tue Feb 08 2005 08:48:33 GMT+0530 (IST)",
        "name"     : "Maxine Townsend",
        "attempts" : 9,
        "status"   : "completed",
        "category" : "IT"
    },
    {
        "id"       : "58dfb537dd051b81453cee6b",
        "title"    : "Maxemia",
        "updated"  : "Mon Feb 17 2014 19:03:24 GMT+0530 (IST)",
        "createdAt": "Tue Jul 11 2000 12:44:35 GMT+0530 (IST)",
        "name"     : "Wells Rich",
        "attempts" : 9,
        "status"   : "pending",
        "category" : "IT"
    },
    {
        "id"       : "58dfb53777f9ca4ffdade70c",
        "title"    : "Zilencio",
        "updated"  : "Fri Feb 18 1972 03:06:09 GMT+0530 (IST)",
        "createdAt": "Sun Jul 17 2016 03:13:30 GMT+0530 (IST)",
        "name"     : "Brooke Paul",
        "attempts" : 10,
        "status"   : "pending",
        "category" : "HR"
    },
    {
        "id"       : "58dfb537e1d6b866f4abd22b",
        "title"    : "Magmina",
        "updated"  : "Sun Jun 08 1986 03:11:02 GMT+0530 (IST)",
        "createdAt": "Sun Apr 01 2012 19:15:31 GMT+0530 (IST)",
        "name"     : "Cain Merrill",
        "attempts" : 5,
        "status"   : "pending",
        "category" : "IT"
    },
    {
        "id"       : "58dfb537deaa1cb0df551338",
        "title"    : "Qnekt",
        "updated"  : "Sun Feb 12 1989 03:33:54 GMT+0530 (IST)",
        "createdAt": "Sun Aug 16 1970 10:39:51 GMT+0530 (IST)",
        "name"     : "Lucas Wiley",
        "attempts" : 5,
        "status"   : "pending",
        "category" : "HR"
    },
    {
        "id"       : "58dfb5370f1ba319a0ad73b7",
        "title"    : "Goko",
        "updated"  : "Mon Dec 09 2002 05:40:33 GMT+0530 (IST)",
        "createdAt": "Wed Dec 14 1977 11:06:40 GMT+0530 (IST)",
        "name"     : "Daugherty Berger",
        "attempts" : 8,
        "status"   : "pending",
        "category" : "IT"
    },
    {
        "id"       : "58dfb537f7461245d08a6704",
        "title"    : "Roughies",
        "updated"  : "Wed Nov 19 2003 17:32:24 GMT+0530 (IST)",
        "createdAt": "Sat Mar 12 1983 21:40:17 GMT+0530 (IST)",
        "name"     : "Saunders Moody",
        "attempts" : 9,
        "status"   : "pending",
        "category" : "HR"
    }
];

let builderConfig = {

    async getAgentConfig(){
        let {imageUrl, messageCount, notificationCount} = headerInfo;

        /************************************HEADER******************************/
        let profileBadge        = ui_engine.avatar.init()
            .setUrl(imageUrl);
        let notificationBadge   = ui_engine.badge.init()
            .setBadgeBody(ui_engine.button_icon.init().setIcon('notifications')).setBadgeContent(notificationCount);
        let messagesBadge       = ui_engine.badge.init()
            .setBadgeBody(ui_engine.button_icon.init().setIcon('message')).setBadgeContent(messageCount);
        let topBar              = ui_engine.row_col_container.init().setColumnCount(3).setOffset(6)
            .addContent(notificationBadge)
            .addContent(messagesBadge)
            .addContent(profileBadge);
        let notificationSection = ui_engine.section.init();
        // .addContent(topBar);

        /************************************NEW TICKETS******************************/
        let {description, tickets} = newTickets;

        let newTicketReceived = ui_engine.section.init().setTitle('Recent Tickets').makeExpandable()
            .setAvatar(newTickets.imageUrl)
            .setSubTitle(description);

        map(tickets, (ticket, index) => {
            let {raisedBy, profile, imageUrl, issue, time} = ticket;
            let {time : issueTime, description}            = issue;
            newTicketReceived.addContent(
                ui_engine.section.init().setTitle(raisedBy).setSubTitle(`${profile} - ${time}`).setAvatar(imageUrl).makeExpandable()
                    .addContent(
                        ui_engine.row_col_container.init().setColumnCount(2).setColWidth([9, 3])
                            .addContent(ui_engine.span.init().setText(description))
                            .addContent(ui_engine.span.init().setText(issueTime))
                            .addContent(ui_engine.button_raised.init().setTitle('CLOSE'))
                            .addContent(ui_engine.drop_down.init().setTitle('Assign To').addDataOption(['PERSON 1', 'PERSON 2', 'PERSON 2']))
                    )
            )
        });

        let tabbleViews = ui_engine.row_col_container.init().setColumnCount(6)
            .addContent(ui_engine.button_raised.init().setTitle('All'))
            .addContent(ui_engine.button_flat.init().setTitle('Pending'))
            .addContent(ui_engine.button_flat.init().setTitle('In Processing'))
            .addContent(ui_engine.button_flat.init().setTitle('Completed'))
            .addContent(ui_engine.button_flat.init().setTitle('Abandoned'));

        let tableTicket = ui_engine.table.init()
            .setTitle('TICKET SYSTEM')
            .setHeaders(['Id', 'Title', 'Category', 'Content'])
            // .addColumn('status', '$status$')
            .addColumn('Id', '$id$')
            .addColumn('Title', '$title$')
            .addColumn('category', '$category$')
            .addColumn('content', '$content$')
            // .addColumn('createdAt', '$createdAt$')
            // .addColumn('updated', '$updated$')
            // .addColumn('attempts', '$attempts$')
            .setPaging(1, 13, 3, true)
            .setWebhook('http://localhost:9000/apis/ticket-system')
        // .setPaging(4, 10, 40)
        // .setDataOptions(tableDS);

        let raise_ticket = ui_engine.section.init().makeExpandable()
            .setTitle('Raise New Ticket')
            .setAvatar('http://icons.iconarchive.com/icons/custom-icon-design/flatastic-5/512/Create-ticket-icon.png')
            .addContent(ui_engine.form.init()
                .setWebhook('http://localhost:9000/apis/ticket-system/',
                    WebHookConstants.POST_METHOD, {
                        'Content-Type': 'application/json'
                    }, {})
                .addContent(
                    ui_engine.text_field.init().setName('category').setTitle('Tags').setWidthFull()
                )
                .addContent(
                    ui_engine.text_field.init().setName('title').setTitle('Subject').setWidthFull()
                )
                .addContent(
                    ui_engine.text_area.init().setName('content').setTitle('Description').setWidthFull()
                )
            );
        // .addContent(notificationSection)
        return ui_engine.page.init()
            .setHeader(ui_engine.header.init()
                .setTitle('Grievances Desk')
                .setSubTitle('Workex Solutions & Services Pvt Ltd')
                .setAvatar('http://www.nkhome.com/content-img/customer_service.png')
            )
            .addContent(raise_ticket)
            .addContent(newTicketReceived)
            .addContent(ui_engine.section.init().addContent(tabbleViews).addContent(tableTicket))
            .render();
    }
};

export default  builderConfig;
