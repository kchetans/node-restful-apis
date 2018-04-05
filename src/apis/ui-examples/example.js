/**
 * This file contains api for sample WxComponents ,
 * go to http://localhost:3000/example to view
 * @type {*[]}
 */
import config from "config";
import ui_engine from "ui-schema";
import {URLS} from "../../constants/application";
let serverUrl      = config.get('url');
let {WxComponents} = require('ui-schema/constants');

let empList = [
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728a8e2825d5f87e61b').setUrl('/profile/58e61728cb7ca4016130bba9').render(),
        "name"      : "Summer Moody",
        "email"     : "summermoody@genmom.com",
        "doj"       : "Tue Nov 24 2015 21:50:20 GMT+0530 (IST)",
        "desigation": "Developer"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728dd29d78bb65a5cde').setUrl('/profile/58e61728217493a6cc009f1f').render(),
        "name"      : "Erma Lang",
        "email"     : "ermalang@genmom.com",
        "doj"       : "Sun Mar 30 1975 05:32:48 GMT+0530 (IST)",
        "desigation": "Temp Dev"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728e0d7763833839f5e').setUrl('/profile/58e61728c5d3801579d68054').render(),
        "name"      : "Reeves Bird",
        "email"     : "reevesbird@genmom.com",
        "doj"       : "Sun Jan 08 2012 11:27:38 GMT+0530 (IST)",
        "desigation": "Developer"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728547680c0154e06d8').setUrl('/profile/58e61728c8f7237e20c2bd73').render(),
        "name"      : "Elise Leonard",
        "email"     : "eliseleonard@genmom.com",
        "doj"       : "Sat May 19 1990 22:09:07 GMT+0530 (IST)",
        "desigation": "Developer"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e6172815fd27bc6d61d783').setUrl('/profile/58e61728dc2d31da77b089a3').render(),
        "name"      : "Erna Mcintyre",
        "email"     : "ernamcintyre@genmom.com",
        "doj"       : "Fri Nov 13 2009 04:01:14 GMT+0530 (IST)",
        "desigation": "Manager"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728ecad8c9477e7c5d0').setUrl('/profile/58e617284debfc1248ab535a').render(),
        "name"      : "Jacqueline Gardner",
        "email"     : "jacquelinegardner@genmom.com",
        "doj"       : "Thu Sep 28 2006 11:15:23 GMT+0530 (IST)",
        "desigation": "IT Head"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728c9bb545187fed573').setUrl('/profile/58e61728dd657aa6145ced60').render(),
        "name"      : "Monroe Fowler",
        "email"     : "monroefowler@genmom.com",
        "doj"       : "Fri Aug 10 2001 00:00:26 GMT+0530 (IST)",
        "desigation": "Temp Dev"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e617281c8413e65fca7fff').setUrl('/profile/58e6172884ca37944b6b1a18').render(),
        "name"      : "Mamie Everett",
        "email"     : "mamieeverett@genmom.com",
        "doj"       : "Mon Jun 11 2007 15:04:39 GMT+0530 (IST)",
        "desigation": "Temp Dev"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e6172858eef4bceace752c').setUrl('/profile/58e617280e3e9bb33268c5b1').render(),
        "name"      : "Jill Lewis",
        "email"     : "jilllewis@genmom.com",
        "doj"       : "Tue Feb 04 1997 03:07:16 GMT+0530 (IST)",
        "desigation": "Temp Dev"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728698f22c81ea3405f').setUrl('/profile/58e617281ba875a736d51ce8').render(),
        "name"      : "Brennan Watkins",
        "email"     : "brennanwatkins@genmom.com",
        "doj"       : "Tue Oct 21 2014 00:00:52 GMT+0530 (IST)",
        "desigation": "Temp Dev"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728428bb500efdc21cc').setUrl('/profile/58e61728af7da850c8129842').render(),
        "name"      : "Beulah Cantrell",
        "email"     : "beulahcantrell@genmom.com",
        "doj"       : "Wed Mar 24 1993 01:10:19 GMT+0530 (IST)",
        "desigation": "BD"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728a5feedb16d0f6926').setUrl('/profile/58e61728759953b978f3345c').render(),
        "name"      : "Lesley Vazquez",
        "email"     : "lesleyvazquez@genmom.com",
        "doj"       : "Thu Jul 21 1983 14:15:20 GMT+0530 (IST)",
        "desigation": "Developer"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e617287370ab48a4a2d0ef').setUrl('/profile/58e61728ab306aaec5b631d0').render(),
        "name"      : "Cole Terry",
        "email"     : "coleterry@genmom.com",
        "doj"       : "Sat Nov 18 2006 01:53:53 GMT+0530 (IST)",
        "desigation": "Developer"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e617281a49afdc2add26ac').setUrl('/profile/58e61728cb2a5fa9a141ea01').render(),
        "name"      : "Vazquez Collier",
        "email"     : "vazquezcollier@genmom.com",
        "doj"       : "Sat Jul 17 1993 07:59:25 GMT+0530 (IST)",
        "desigation": "Developer"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728febcac2a2dbcd281').setUrl('/profile/58e61728400022f632ba0f4c').render(),
        "name"      : "Willis Farley",
        "email"     : "willisfarley@genmom.com",
        "doj"       : "Tue Jun 01 2004 19:28:26 GMT+0530 (IST)",
        "desigation": "BD"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e617289b8ea0d854b677d7').setUrl('/profile/58e61728eecd486d288c485e').render(),
        "name"      : "Hunter Evans",
        "email"     : "hunterevans@genmom.com",
        "doj"       : "Sun Oct 20 1985 16:36:03 GMT+0530 (IST)",
        "desigation": "Manager"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e617282be1dda5f1ab2a40').setUrl('/profile/58e617284b1854c362937069').render(),
        "name"      : "Cortez Thomas",
        "email"     : "cortezthomas@genmom.com",
        "doj"       : "Sat Mar 31 2007 21:51:50 GMT+0530 (IST)",
        "desigation": "Developer"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e6172878f05f024f8a8ca7').setUrl('/profile/58e61728709beb55c61dbac4').render(),
        "name"      : "Church Stewart",
        "email"     : "churchstewart@genmom.com",
        "doj"       : "Mon Dec 01 2008 07:10:28 GMT+0530 (IST)",
        "desigation": "BD"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728dfa202611b421357').setUrl('/profile/58e6172826c0e32f4f00ef8d').render(),
        "name"      : "Aurelia Romero",
        "email"     : "aureliaromero@genmom.com",
        "doj"       : "Thu Mar 12 1970 03:20:00 GMT+0530 (IST)",
        "desigation": "IT Head"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728d017badb9caca994').setUrl('/profile/58e61728ed6f099fd4056b58').render(),
        "name"      : "Jensen Blair",
        "email"     : "jensenblair@genmom.com",
        "doj"       : "Sun Apr 07 1985 11:13:11 GMT+0530 (IST)",
        "desigation": "IT Head"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728da63cc4564b9874e').setUrl('/profile/58e61728d916d56148725ead').render(),
        "name"      : "Sampson Michael",
        "email"     : "sampsonmichael@genmom.com",
        "doj"       : "Fri Feb 01 2002 18:05:35 GMT+0530 (IST)",
        "desigation": "BD"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e617280f86e870282d18f2').setUrl('/profile/58e61728cd2e0d583ef7dea9').render(),
        "name"      : "Woods Alvarado",
        "email"     : "woodsalvarado@genmom.com",
        "doj"       : "Thu Feb 12 2015 01:16:14 GMT+0530 (IST)",
        "desigation": "BD"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e6172808778e21b5c43269').setUrl('/profile/58e61728d2d992db02d55750').render(),
        "name"      : "Liza Valdez",
        "email"     : "lizavaldez@genmom.com",
        "doj"       : "Wed Nov 21 1990 19:52:46 GMT+0530 (IST)",
        "desigation": "Developer"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e6172860a6d316d454db62').setUrl('/profile/58e617281ebf70bda4ed73dd').render(),
        "name"      : "Hogan Hood",
        "email"     : "hoganhood@genmom.com",
        "doj"       : "Thu Dec 15 1988 14:58:42 GMT+0530 (IST)",
        "desigation": "BD"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728eb3d58b5dd6af119').setUrl('/profile/58e61728aecfa06d0864cb2f').render(),
        "name"      : "Fletcher May",
        "email"     : "fletchermay@genmom.com",
        "doj"       : "Mon Mar 31 2003 06:05:17 GMT+0530 (IST)",
        "desigation": "BD"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728d173c9bcf4283789').setUrl('/profile/58e61728bee1b2122ce99e37').render(),
        "name"      : "Helena Hess",
        "email"     : "helenahess@genmom.com",
        "doj"       : "Fri Jun 16 1978 06:17:47 GMT+0530 (IST)",
        "desigation": "Manager"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e617285a4a911a08745627').setUrl('/profile/58e617283fefcfb538a5ba5b').render(),
        "name"      : "Lorraine Meyers",
        "email"     : "lorrainemeyers@genmom.com",
        "doj"       : "Sat Oct 09 1993 03:42:57 GMT+0530 (IST)",
        "desigation": "BD"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728b8576debd354934b').setUrl('/profile/58e61728b126a1c5cc124fcd').render(),
        "name"      : "Melody Mclean",
        "email"     : "melodymclean@genmom.com",
        "doj"       : "Fri May 16 1980 22:29:05 GMT+0530 (IST)",
        "desigation": "Manager"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728e4e3270a7ddae695').setUrl('/profile/58e6172822ac1df93fb7120f').render(),
        "name"      : "Silvia Montgomery",
        "email"     : "silviamontgomery@genmom.com",
        "doj"       : "Sun Oct 22 2000 19:02:08 GMT+0530 (IST)",
        "desigation": "BD"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728f368f3641e3230dd').setUrl('/profile/58e617282615c3ded88568d6').render(),
        "name"      : "Shanna Hoover",
        "email"     : "shannahoover@genmom.com",
        "doj"       : "Mon Oct 14 1974 02:46:23 GMT+0530 (IST)",
        "desigation": "BD"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e617284dd4d72b0fa66a66').setUrl('/profile/58e61728cfd06b9cfbdd64c4').render(),
        "name"      : "Curry Robbins",
        "email"     : "curryrobbins@genmom.com",
        "doj"       : "Sat Jan 27 1973 13:23:54 GMT+0530 (IST)",
        "desigation": "Developer"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728ddfb437615ec7c4a').setUrl('/profile/58e617280ed9037fa1d99215').render(),
        "name"      : "Latonya Rush",
        "email"     : "latonyarush@genmom.com",
        "doj"       : "Tue May 25 1993 07:04:05 GMT+0530 (IST)",
        "desigation": "Manager"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728aefae6f1e25bc91c').setUrl('/profile/58e61728e51726fa73bea707').render(),
        "name"      : "Stephanie Rodriquez",
        "email"     : "stephanierodriquez@genmom.com",
        "doj"       : "Sun Mar 11 2007 13:01:29 GMT+0530 (IST)",
        "desigation": "Manager"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e6172800b26d50fae636c3').setUrl('/profile/58e61728ee45e6fe56374064').render(),
        "name"      : "Audrey Armstrong",
        "email"     : "audreyarmstrong@genmom.com",
        "doj"       : "Mon May 16 1988 12:14:26 GMT+0530 (IST)",
        "desigation": "Temp Dev"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e6172858b199f39a3f16ea').setUrl('/profile/58e61728747f3bd8e465ad7b').render(),
        "name"      : "Keller Pugh",
        "email"     : "kellerpugh@genmom.com",
        "doj"       : "Mon Sep 17 2001 00:31:09 GMT+0530 (IST)",
        "desigation": "Manager"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e617289ae4d591d184c9f2').setUrl('/profile/58e61728530069ea26e6bce9').render(),
        "name"      : "Coleen Barnes",
        "email"     : "coleenbarnes@genmom.com",
        "doj"       : "Mon Feb 06 2017 10:20:51 GMT+0530 (IST)",
        "desigation": "Manager"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e617284d59e78a7dd734e5').setUrl('/profile/58e617281beb3a4dc7c1014d').render(),
        "name"      : "Corrine Wooten",
        "email"     : "corrinewooten@genmom.com",
        "doj"       : "Fri Sep 15 2006 09:44:43 GMT+0530 (IST)",
        "desigation": "BD"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728ff71511b036b890f').setUrl('/profile/58e61728226499cbeb1b3621').render(),
        "name"      : "Shannon Avery",
        "email"     : "shannonavery@genmom.com",
        "doj"       : "Fri Dec 17 1999 08:38:05 GMT+0530 (IST)",
        "desigation": "Manager"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728adc3feb03ef91ae3').setUrl('/profile/58e6172868e947a919aef499').render(),
        "name"      : "Addie Schultz",
        "email"     : "addieschultz@genmom.com",
        "doj"       : "Tue Feb 21 1995 16:55:16 GMT+0530 (IST)",
        "desigation": "Temp Dev"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e6172884c6a64243c1e99f').setUrl('/profile/58e61728e3a5b1c170ce35dd').render(),
        "name"      : "Maxwell Alexander",
        "email"     : "maxwellalexander@genmom.com",
        "doj"       : "Fri Mar 17 1989 04:07:36 GMT+0530 (IST)",
        "desigation": "Temp Dev"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e617288c484f53abff510c').setUrl('/profile/58e6172838fcd92c09ea1c2c').render(),
        "name"      : "Matilda Durham",
        "email"     : "matildadurham@genmom.com",
        "doj"       : "Thu Nov 03 1988 10:36:22 GMT+0530 (IST)",
        "desigation": "BD"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728c46647c47bc9258e').setUrl('/profile/58e617289b83ceb807d87d58').render(),
        "name"      : "Clay Fernandez",
        "email"     : "clayfernandez@genmom.com",
        "doj"       : "Tue Sep 23 2014 21:11:50 GMT+0530 (IST)",
        "desigation": "Developer"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728f6ba6dd1eda1c6da').setUrl('/profile/58e61728239af41b42dcb121').render(),
        "name"      : "Kerr Ratliff",
        "email"     : "kerrratliff@genmom.com",
        "doj"       : "Thu Jan 25 2007 15:39:58 GMT+0530 (IST)",
        "desigation": "BD"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728746dd4a818b1ae08').setUrl('/profile/58e61728d8a5a6b6f2e3742d').render(),
        "name"      : "Ivy Goodman",
        "email"     : "ivygoodman@genmom.com",
        "doj"       : "Wed Jul 17 1991 04:08:08 GMT+0530 (IST)",
        "desigation": "IT Head"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e6172808322873e3ef9809').setUrl('/profile/58e61728c65273c6ef0c665e').render(),
        "name"      : "Hill Bryan",
        "email"     : "hillbryan@genmom.com",
        "doj"       : "Wed Sep 19 2001 20:33:24 GMT+0530 (IST)",
        "desigation": "Manager"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e617282f6665e68b503de8').setUrl('/profile/58e6172840c64c886417405a').render(),
        "name"      : "Amalia Conley",
        "email"     : "amaliaconley@genmom.com",
        "doj"       : "Fri Dec 23 1983 00:11:12 GMT+0530 (IST)",
        "desigation": "Temp Dev"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728266f79ac45243cb9').setUrl('/profile/58e617288cd7c844d6255673').render(),
        "name"      : "Sabrina Riggs",
        "email"     : "sabrinariggs@genmom.com",
        "doj"       : "Tue Aug 30 1983 16:00:48 GMT+0530 (IST)",
        "desigation": "BD"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728930d1d72f69c24ec').setUrl('/profile/58e6172827d1e988de439f26').render(),
        "name"      : "Loretta Mccormick",
        "email"     : "lorettamccormick@genmom.com",
        "doj"       : "Tue Mar 26 1991 01:00:18 GMT+0530 (IST)",
        "desigation": "Developer"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728ba272e8c62f1e870').setUrl('/profile/58e61728370681febf828ac6').render(),
        "name"      : "Ford Stephenson",
        "email"     : "fordstephenson@genmom.com",
        "doj"       : "Tue Dec 24 1991 22:08:03 GMT+0530 (IST)",
        "desigation": "Temp Dev"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728ebf50e4003e9e6f5').setUrl('/profile/58e61728448ae618ecd49d39').render(),
        "name"      : "Vang Vargas",
        "email"     : "vangvargas@genmom.com",
        "doj"       : "Tue Jan 24 2017 20:25:01 GMT+0530 (IST)",
        "desigation": "IT Head"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e617289b86dead9863ec86').setUrl('/profile/58e617286e19af0b325ba784').render(),
        "name"      : "Meagan Delgado",
        "email"     : "meagandelgado@genmom.com",
        "doj"       : "Mon Dec 21 1981 19:49:17 GMT+0530 (IST)",
        "desigation": "BD"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728701ff5348ece09a8').setUrl('/profile/58e617281e2ce85ec12db1a1').render(),
        "name"      : "Autumn Molina",
        "email"     : "autumnmolina@genmom.com",
        "doj"       : "Thu Jun 18 1987 18:24:42 GMT+0530 (IST)",
        "desigation": "Manager"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728d69a1b5f95c659d7').setUrl('/profile/58e61728f0899f0dfdf8a303').render(),
        "name"      : "Sybil House",
        "email"     : "sybilhouse@genmom.com",
        "doj"       : "Mon Sep 07 1981 23:39:45 GMT+0530 (IST)",
        "desigation": "Developer"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e617281ead7990ae405a3e').setUrl('/profile/58e61728f9733ab80199dcfb').render(),
        "name"      : "Hodge Leach",
        "email"     : "hodgeleach@genmom.com",
        "doj"       : "Thu Mar 23 1978 01:36:55 GMT+0530 (IST)",
        "desigation": "Manager"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728e1cc6b7085330d9c').setUrl('/profile/58e61728b1ed082487db4ce6').render(),
        "name"      : "Blake Crosby",
        "email"     : "blakecrosby@genmom.com",
        "doj"       : "Fri Dec 04 2015 02:07:47 GMT+0530 (IST)",
        "desigation": "Manager"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e61728ba087eb3ecca580a').setUrl('/profile/58e61728eac4e0fe9d1cecfd').render(),
        "name"      : "Olga Kennedy",
        "email"     : "olgakennedy@genmom.com",
        "doj"       : "Mon Jan 18 1982 05:07:34 GMT+0530 (IST)",
        "desigation": "IT Head"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e6172849f533a4c1bbf9fa').setUrl('/profile/58e61728e4bb3fb6e8af805c').render(),
        "name"      : "Rivers Buckner",
        "email"     : "riversbuckner@genmom.com",
        "doj"       : "Mon Mar 21 2011 20:53:52 GMT+0530 (IST)",
        "desigation": "Manager"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e6172866cb6b3d27c7110f').setUrl('/profile/58e6172853995132da5b466d').render(),
        "name"      : "Rosanne Rowland",
        "email"     : "rosannerowland@genmom.com",
        "doj"       : "Thu Dec 23 2004 00:30:36 GMT+0530 (IST)",
        "desigation": "Temp Dev"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e6172834b4cfcde7af2bfa').setUrl('/profile/58e61728108ea13b7c1b9795').render(),
        "name"      : "Pierce Sheppard",
        "email"     : "piercesheppard@genmom.com",
        "doj"       : "Tue Feb 28 1984 11:40:44 GMT+0530 (IST)",
        "desigation": "Developer"
    },
    {
        "empID"     : ui_engine.link.init().setTitle('58e617289917b8d599763da5').setUrl('/profile/58e6172846a98456405bd60b').render(),
        "name"      : "Oliver Briggs",
        "email"     : "oliverbriggs@genmom.com",
        "doj"       : "Sun Jul 11 1993 00:16:35 GMT+0530 (IST)",
        "desigation": "BD"
    }
];

let color = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#00BCD4', '#4CAF50'];

let text = [
    'Hello apply for credit card',
    'Please ignore that mail as it contains spam',
    'View generated form config are cool',
    'This is server controlled view',
    'How this view generated, i have no idea'];

var tableDS = [
    {
        "name"    : "Name1", "lname": "Mittal", "post": "Director", "doj": "Mar 1, 2017", "ctc": "1",
        "location": "Bangalore", no: "9873053385", "actions": ""
    }, {
        "name"    : "Name2", "lname": "Mittal", "post": "Lead Developer", "doj": "Mar 1, 2017", "ctc": "1",
        "location": "Bangalore", no: "9711308075", "actions": ""
    }, {
        "name"    : "Name3", "lname": "Mittal", "post": "Lead Developer", "doj": "Mar 1, 2017", "ctc": "1",
        "location": "Bangalore", no: "9711308075", "actions": ""
    }, {
        "name"    : "Name4", "lname": "Mittal", "post": "Lead Developer", "doj": "Mar 1, 2017", "ctc": "1",
        "location": "Bangalore", no: "9711308075", "actions": ""
    }, {
        "name"    : "Name5", "lname": "Mittal", "post": "Lead Developer", "doj": "Mar 1, 2017", "ctc": "1",
        "location": "Bangalore", no: "9711308075", "actions": ""
    }, {
        "name"    : "Name6", "lname": "Mittal", "post": "Lead Developer", "doj": "Mar 1, 2017", "ctc": "1",
        "location": "Bangalore", no: "9711308075", "actions": ""
    }, {
        "name"    : "Name7", "lname": "Mittal", "post": "Lead Developer", "doj": "Mar 1, 2017", "ctc": "1",
        "location": "Bangalore", no: "9711308075", "actions": ""
    }, {
        "name"    : "Name8", "lname": "Mittal", "post": "Lead Developer", "doj": "Mar 1, 2017", "ctc": "1",
        "location": "Bangalore", no: "9711308075", "actions": ""
    },];


let examples = {
    async examples(object, options){
        let mainOuterSection = ui_engine.section.init()
            .setTitle('Sample Components')
            .setSubTitle('Workex UI Components')
            .setAvatar('home' || 'http://localhost:3000/static/media/WorkexLogo2.92815e78.png');

        /****************************Badge EXAMPLE**************************/
        let badge          = ui_engine.badge.init().setBadgeBody('Notification').setBadgeContent('10');
        let iconButtonBage = ui_engine.button_icon.init().setIcon('home');
        let badge2         = ui_engine.badge.init().setBadgeBody(iconButtonBage).setBadgeContent('10');

        let badgeStack = ui_engine.vertical_stack.init().setRowSpacing(10).addContent(badge).addContent(badge2);

        let BadgeSection = ui_engine.section.init()
            .makeExpandable()
            .setTitle('Badge Section')
            .setSubTitle('Sample Badges')
            .addContent(badgeStack);

        mainOuterSection.addContent(BadgeSection);

        /****************************Icon EXAMPLE**************************/
        let iconElelment = ui_engine.icon.init()
            .setIcon('home')
            .setIconColor('#caf120');

        let url = ui_engine.link.init()
            .setTitle('https://material.io/icons/')
            .setUrl('https://material.io/icons/')
            .setTarget('_blank');

        let iconSection = ui_engine.section.init()
            .makeExpandable()
            .setTitle('Icon Section')
            .setSubTitle('Got to https://material.io/icons/')
            .addContent(url)
            .addContent(iconElelment);

        mainOuterSection.addContent(iconSection);

        /****************************Avatar EXAMPLE**************************/
        let Avatar1 = ui_engine.avatar.init().setText('KA');
        let Avatar2 = ui_engine.avatar.init().setText('RD').setFontColor('black');
        let Avatar3 = ui_engine.avatar.init().setText('HK').setFontColor('green').setBackgroundColor('yellow');
        let Avatar4 = ui_engine.avatar.init().setUrl('http://www.material-ui.com/images/uxceo-128.jpg');
        let Avatar5 = ui_engine.avatar.init().setUrl('http://www.material-ui.com/images/uxceo-128.jpg').setSize(60)
        let Avatar6 = ui_engine.avatar.init().setUrl('http://www.material-ui.com/images/uxceo-128.jpg').setSize(70)


        let AvatarStack = ui_engine.vertical_stack.init().setRowSpacing(10).addContent(Avatar1).addContent(Avatar2)
            .addContent(Avatar3).addContent(Avatar4).addContent(Avatar5).addContent(Avatar6)

        let AvatarSection = ui_engine.section.init()
            .makeExpandable()
            .setTitle('Avatar Section')
            .setSubTitle('Sample Avatar')
            .addContent(AvatarStack);

        mainOuterSection.addContent(AvatarSection);

        /****************************Date and Time EXAMPLE**************************/
        let dateTime1  = ui_engine.date_picker.init().setTitle('Select Date')
        let dateTime2  = ui_engine.date_picker.init().setTitle('Current Selected Date').setDefaultDate(new Date())
        let dateTime2_ = ui_engine.date_picker.init().setTitle('DD/MM/YY').setDateFormat();

        let dateTime3 = ui_engine.time_picker.init().setTitle('Select Time');
        let dateTime4 = ui_engine.time_picker.init().setTitle('Current Selected Time').setDefaultTime();
        let dateTime5 = ui_engine.time_picker.init().setTitle('24 Hrs Format').set24HrsFormat();


        let vStackDateTimre = ui_engine.vertical_stack.init().setRowSpacing(10).addContent(dateTime1).addContent(dateTime2).addContent(dateTime2_).addContent(dateTime3)
            .addContent(dateTime4).addContent(dateTime5);

        let dateTimeSection = ui_engine.section.init()
            .makeExpandable()
            .setTitle('Date and Time')
            .setSubTitle('Sample date and time picker')
            .addContent(vStackDateTimre);

        mainOuterSection.addContent(dateTimeSection);

        /****************************Drop down EXAMPLE**************************/
        let dropDown1  = ui_engine.drop_down.init().setTitle('Select City ').setDataOptions(['Delhi', 'Mumbai', 'Puna', 'Banglore']);
        let dropDown2  = ui_engine.drop_down.init().setTitle('Default Value').setDefaultValue('Delhi').setDataOptions(['Delhi', 'Mumbai', 'Puna', 'Banglore']);
        let dropDown2_ = ui_engine.drop_down.init().setTitle('Full With City').setWidthFull().setDataOptions(['Delhi', 'Mumbai', 'Puna', 'Banglore']);
        let dropDown3  = ui_engine.drop_down.init().setTitle('From Api 1 DropDown')
            .setWebhook(`${serverUrl}api/ui-examples/getOptions1`);
        let dropDown4  = ui_engine.drop_down.init().setTitle('From Api 2 DropDown').setWebhook(`${serverUrl}api/ui-examples/getOptions2`);
        let dropDown5  = ui_engine.drop_down.init().setTitle('From Api 3 DropDown').setWebhook(`${serverUrl}api/ui-examples/getOptions3`);


        let vStackdropDown = ui_engine.vertical_stack.init().setRowSpacing(10).addContent(dropDown1).addContent(dropDown2).addContent(dropDown2_).addContent(dropDown3)
            .addContent(dropDown4).addContent(dropDown5);

        let ddSection = ui_engine.section.init()
            .makeExpandable()
            .setTitle('Drop Down')
            .setSubTitle('Sample Drop down')
            .addContent(vStackdropDown);

        mainOuterSection.addContent(ddSection);

        /****************************Auto Complete EXAMPLE**************************/
        let auto_complete1  = ui_engine.auto_complete.init().setTitle('Select City ').setDataOptions(['Delhi', 'Mumbai', 'Puna', 'Banglore']);
        let auto_complete2  = ui_engine.auto_complete.init().setTitle('Default Value').setDefaultValue('Delhi').setDataOptions(['Delhi', 'Mumbai', 'Puna', 'Banglore']);
        let auto_complete2_ = ui_engine.auto_complete.init().setTitle('Full With City').setWidthFull().setDataOptions(['Delhi', 'Mumbai', 'Puna', 'Banglore']);
        let auto_complete3  = ui_engine.auto_complete.init().setTitle('From Api 1 auto_complete').setWebhook(`${serverUrl}api/ui-examples/getOptions1`);
        let auto_complete4  = ui_engine.auto_complete.init().setTitle('From Api 2 auto_complete').setWebhook(`${serverUrl}api/ui-examples/getOptions2`);
        let auto_complete5  = ui_engine.auto_complete.init().setTitle('From Api 3 auto_complete').setWebhook(`${serverUrl}api/ui-examples/getOptions3`);


        let vStackauto_complete = ui_engine.vertical_stack.init().setRowSpacing(10).addContent(auto_complete1).addContent(auto_complete2).addContent(auto_complete2_).addContent(auto_complete3)
            .addContent(auto_complete4).addContent(auto_complete5);

        let autoSection = ui_engine.section.init()
            .makeExpandable()
            .setTitle('Auto Complete')
            .setSubTitle('Sample Auto Complete')
            .addContent(vStackauto_complete);

        mainOuterSection.addContent(autoSection);

        /****************************CheckBox Button EXAMPLE**************************/
        let check_box1 = ui_engine.check_box.init().setTitle('Right Label');
        let check_box2 = ui_engine.check_box.init().setTitle('Left Label').setLabelPositionLeft();
        let check_box3 = ui_engine.check_box.init().setTitle('Default Checked').setChecked();
        // let check_box4 = ui_engine.check_box.init().setTitle('From Api 2 Radio Buttons').setWebhook(`${serverUrl}api/ui-examples/getOptions2`);
        // let check_box5 = ui_engine.check_box.init().setTitle('From Api 3 Radio Buttons').setWebhook(`${serverUrl}api/ui-examples/getOptions3`);


        let vStackCheckBox = ui_engine.vertical_stack.init().setRowSpacing(10).addContent(check_box1).addContent(check_box2).addContent(check_box3)
        // .addContent(check_box4).addContent(check_box5);

        let checboXSection = ui_engine.section.init()
            .makeExpandable()
            .setTitle('CheckBox ')
            .setSubTitle('Sample CheckBox')
            .addContent(vStackCheckBox);

        mainOuterSection.addContent(checboXSection);

        /****************************Toggle Button EXAMPLE**************************/
        let toggle1 = ui_engine.toggle.init().setTitle('Right Label');
        let toggle2 = ui_engine.toggle.init().setTitle('Left Label').setLabelPositionLeft();
        let toggle3 = ui_engine.toggle.init().setTitle('Default Checked').setChecked();
        // let toggle4 = ui_engine.toggle.init().setTitle('From Api 2 Radio Buttons').setWebhook(`${serverUrl}api/ui-examples/getOptions2`);
        // let toggle5 = ui_engine.toggle.init().setTitle('From Api 3 Radio Buttons').setWebhook(`${serverUrl}api/ui-examples/getOptions3`);


        let vStackToggle = ui_engine.vertical_stack.init().setRowSpacing(10).addContent(toggle1).addContent(toggle2).addContent(toggle3)
        // .addContent(toggle4).addContent(toggle5);

        let togleoXSection = ui_engine.section.init()
            .makeExpandable()
            .setTitle('Toggle ')
            .setSubTitle('Toggle Button')
            .addContent(vStackToggle);

        mainOuterSection.addContent(togleoXSection);

        /****************************Radio Button EXAMPLE**************************/
        let radioButon1 = ui_engine.radio_button_group.init().setTitle('Radio Buttons').setDataOptions(['Delhi', 'Mumbai', 'Puna', 'Banglore']);
        let radioButon2 = ui_engine.radio_button_group.init().setTitle('Inline Radio Buttons').setInline().setDataOptions(['Delhi', 'Mumbai', 'Puna', 'Banglore']);
        let radioButon3 = ui_engine.radio_button_group.init().setTitle('From Api 1 Radio Buttons').setWebhook(`${serverUrl}api/ui-examples/getOptions1`);
        let radioButon4 = ui_engine.radio_button_group.init().setTitle('From Api 2 Radio Buttons').setWebhook(`${serverUrl}api/ui-examples/getOptions2`);
        let radioButon5 = ui_engine.radio_button_group.init().setTitle('From Api 3 Radio Buttons').setWebhook(`${serverUrl}api/ui-examples/getOptions3`);


        let vStackRadio = ui_engine.vertical_stack.init().setRowSpacing(10).addContent(radioButon1).addContent(radioButon2).addContent(radioButon3)
            .addContent(radioButon4).addContent(radioButon5);

        let radioSection = ui_engine.section.init()
            .makeExpandable()
            .setTitle('Radio Button')
            .setSubTitle('Sample Radio Buttons')
            .addContent(vStackRadio);

        mainOuterSection.addContent(radioSection);

        /****************************Multi Select Button EXAMPLE**************************/
        let radioButon11 = ui_engine.multi_select.init().setTitle('Radio Buttons').setDataOptions(['Delhi', 'Mumbai', 'Puna', 'Banglore']);
        let radioButon21 = ui_engine.multi_select.init().setTitle('Inline Radio Buttons').setInline().setDataOptions(['Delhi', 'Mumbai', 'Puna', 'Banglore']);
        let radioButon31 = ui_engine.multi_select.init().setTitle('From Api 1 Radio Buttons').setWebhook(`${serverUrl}api/ui-examples/getOptions1`);
        let radioButon41 = ui_engine.multi_select.init().setTitle('From Api 2 Radio Buttons').setWebhook(`${serverUrl}api/ui-examples/getOptions2`);
        let radioButon51 = ui_engine.multi_select.init().setTitle('From Api 3 Radio Buttons').setWebhook(`${serverUrl}api/ui-examples/getOptions3`);


        let vStackRadio1 = ui_engine.vertical_stack.init().setRowSpacing(10).addContent(radioButon11).addContent(radioButon21).addContent(radioButon31)
            .addContent(radioButon41).addContent(radioButon51);

        let mutliSeclecSection = ui_engine.section.init()
            .makeExpandable()
            .setTitle('Multi Select Check box')
            .setSubTitle('Sample Multi Select Check box')
            .addContent(vStackRadio1);

        mainOuterSection.addContent(mutliSeclecSection);


        /****************************Text Field EXAMPLE**************************/
        let text_field1 = ui_engine.text_field.init().setTitle('Title');
        let text_field2 = ui_engine.text_field.init().setTitle('Title').setHint('Hint Text');
        let text_field3 = ui_engine.text_field.init().setTitle('With default value').setDefaultValue('Default Value');
        let text_field4 = ui_engine.text_field.init().setTitle('Enter Password').setTypePassword();
        let text_field5 = ui_engine.text_field.init().setTitle('Full Width').setWidthFull();

        let text_field6 = ui_engine.text_area.init().setTitle('Text Area');
        let text_field7 = ui_engine.text_area.init().setTitle('Multi Rows').setRows(5);

        let vStackTextField = ui_engine.vertical_stack.init().setRowSpacing(0).addContent(text_field1).addContent(text_field2).addContent(text_field3)
            .addContent(text_field4).addContent(text_field5).addContent(text_field6).addContent(text_field7);

        let TextFieldSection = ui_engine.section.init()
            .makeExpandable()
            .setTitle('Text Field')
            .setSubTitle('Sample Text Input')
            .addContent(vStackTextField);

        mainOuterSection.addContent(TextFieldSection);

        /****************************BUTTON EXAMPLE**************************/
        let buttonRaised1 = ui_engine.button_raised.init().setTitle('Button Raised');
        let buttonRaised2 = ui_engine.button_raised.init().setTitle('Icon Button Raised').setIcon('cloud_download');
        let buttonRaised3 = ui_engine.button_raised.init().setTitle('Icon Color').setIcon('cloud_done').setIconColor('white');
        let buttonRaised4 = ui_engine.button_raised.init().setTitle('Right Icon').setIcon('cloud_done').setIconColor('white').setLabelPositionRight();
        let buttonFab     = ui_engine.button_fab.init().setTitle('Button FAB').setIcon('add_to_photos').setIconColor('white');
        let flatButton    = ui_engine.button_flat.init().setTitle('Flat Button');
        let iconButton    = ui_engine.button_icon.init().setTitle('Icon Button').setIcon('cloud_download');
        let uploadButton1 = ui_engine.button_upload.init().setTitle('Upload').setIcon('cloud_download');
        let uploadButton2 = ui_engine.button_upload.init().setTitle('Upload 2')

        let vStack = ui_engine.vertical_stack.init().setRowSpacing(10).addContent(buttonRaised1).addContent(buttonRaised2).addContent(buttonRaised3)
            .addContent(buttonRaised4).addContent(buttonFab).addContent(flatButton).addContent(iconButton).addContent(uploadButton1).addContent(uploadButton2);

        let buttonSection = ui_engine.section.init()
            .makeExpandable()
            .setTitle('Button Section')
            .setSubTitle('Sample Button')
            .addContent(vStack);

        mainOuterSection.addContent(buttonSection);

        /****************************POP OVER EXAMPLE**************************/
        let popoverButton = ui_engine.button_raised.init().setTitle('Click on it')

        let popover = ui_engine.popover.init()
            .addContent(ui_engine.menu.init().setDataOptions(['Hi', 'Hello']))
            .setActionElement(popoverButton);

        let popoverSection = ui_engine.section.init()
            .makeExpandable()
            .setTitle('Popover Example')
            .setSubTitle('These are the context menu which opens when button click happens')
            .addContent(popover);

        mainOuterSection.addContent(popoverSection);

        /****************************TABLE EXAMPLE**************************/
        let tableS = ui_engine.table.init()
            .setTitle('THIS IS TABLE TITLE')
            .setHeaders(['NAME', 'MOBILE NO', 'POST'])
            .addColumn('NAME', '$name$')
            .addColumn('no', '$no$')
            .addColumn('post', '$post$')
            .setDataOptions(tableDS);

        let tableS2 = ui_engine.table.init()
            .setTitle('THIS IS TABLE TITLE')
            .setHeaders(['NAME', 'MOBILE NO', 'POST'])
            .addColumn('NAME', '$name$')
            .addColumn('no', '$no$')
            .addColumn('post', '$post$')
            .setPaging(2, 3, Math.ceil(tableDS.length / 3), false)
            .setDataOptions(tableDS);

        let tableS3 = ui_engine.table.init()
            .setTitle('THIS IS TABLE TITLE FROM API')
            .setHeaders(['NAME', 'PHONE'])
            .addColumn('NAME', '$name$')
            .addColumn('phone', '$phone$')
            /** Current page, pageSize , noOF page is null will come form api , server side is true**/
            .setPaging(1, 13, 3, true)
            .setWebhook(`${serverUrl}api/ui-examples/tableApi`);


        let tableS4 = ui_engine.table.init()
            .setHeaders(['NAME', 'LOCATION', 'PHONE', 'Gender'])
            .addColumn('name', '$name$', WxComponents.LINK)
            .addColumn('location', '$location$', WxComponents.LINK)
            .addColumn('no', '$no$', WxComponents.DROP_DOWN)
            .addColumn('gender', '$gender$')
            .setDataOptions([
                {
                    "name"    : ui_engine.link.init().setTitle('Name 1').setUrl('/profile/name1').render(),
                    "location": ui_engine.link.init().setTitle('Banglore').setUrl('/city/banglore').render(),
                    'no'      : ui_engine.drop_down.init().setTitle('Phone No').setDataOptions(['9876543212', '9876878912']).render(),
                    "gender"  : "M"
                }, {
                    "name"    : ui_engine.link.init().setTitle('Name 2').setUrl('/profile/name2').render(),
                    "location": ui_engine.link.init().setTitle('Banglore').setUrl('/city/banglore').render(),
                    'no'      : ui_engine.drop_down.init().setTitle('Phone No').setDataOptions(['9876543212', '9876878912']).render(),
                    "gender"  : "M"
                }, {
                    "name"    : ui_engine.link.init().setTitle('Name 3').setUrl('/profile/name3').render(),
                    "location": ui_engine.link.init().setTitle('Delhi').setUrl('/city/delhi').render(),
                    'no'      : ui_engine.drop_down.init().setTitle('Phone No').setDataOptions(['9876543212', '9876878912']).render(),
                    "gender"  : "F"
                }
            ]);

        let divider  = ui_engine.span.init().setText('Table With Paging');
        let divider2 = ui_engine.span.init().setText('Table With Paging API');
        let divider3 = ui_engine.span.init().setText('Table With DIFF UI');

        let tableSection = ui_engine.section.init()
            .makeExpandable()
            .setTitle('Table Example')
            .setSubTitle('This is table example')
            .addContent(tableS)
            .addContent(divider)
            .addContent(tableS2)
            .addContent(divider2)
            .addContent(tableS3)
            .addContent(divider3)
            .addContent(tableS4)

        mainOuterSection.addContent(tableSection);

        /****************************Card Stack EXAMPLE**************************/
        let cardDs           = ui_engine.card_stack.init()
            .setTitle('$name$ $lname$')
            .setSubTitle('$post$')
            .setDataOptions(tableDS);
        let cardStackSection = ui_engine.section.init()
            .makeExpandable()
            .setTitle('Card Stack Example')
            .setSubTitle('This is card stack example')
            .addContent(cardDs);

        mainOuterSection.addContent(cardStackSection);

        /****************************Grid EXAMPLE**************************/
        let gridElements = ui_engine.row_col_container.init()
            .setColumnCount(4)
            .setContent([{
                type : 'header',
                title: '1'
            }, {
                type : 'header',
                title: '2'
            }, {
                type : 'header',
                title: '3'
            }, {
                type : 'header',
                title: '4'
            }, {
                type : 'header',
                title: '5'
            }, {
                type : 'header',
                title: '6'
            }]);

        let textHed = ui_engine.span.init().setText('Nice Table UI Grid');

        let gridSystem2 = ui_engine.row_col_container.init()
            .setColumnCount(3);
        for (let i = 0; i < 5; i++) {
            let avatar       = ui_engine.avatar.init().setText(`A${i}`).setBackgroundColor(color[i]).setFontColor('#fff');
            let message      = ui_engine.span.init().setText(text[i]);
            let right_avatar = ui_engine.avatar.init().setIcon('home');
            gridSystem2.addContent(avatar).addContent(message).addContent(right_avatar)
                .setColXS([1, 10, 1]).setColSM([1, 10, 1]).setColLG([1, 10, 1]).setColMD([1, 10, 1]);
        }


        let rowColSection = ui_engine.section.init()
            .makeExpandable()
            .setTitle('Row Col Example')
            .setSubTitle('This is Row Col Example')
            .addContent(gridElements).addContent(textHed).addContent(gridSystem2);

        mainOuterSection.addContent(rowColSection);


        /**********************************List Example************************************/
        let listItem1 = ui_engine.list_item.init().setTitle('Item1').setLeftIcon('home');
        let listItem2 = ui_engine.list_item.init().setTitle('Item2').setLeftIcon('home').setLeftIconColor('#fafafa');
        let listItem3 = ui_engine.list_item.init().setTitle('Item3');
        let listItem4 = ui_engine.list_item.init().setTitle('Item4');

        let listItemCombine = ui_engine.list_item.init().setTitle('List')
            .addContent(listItem1).addContent(listItem2).addContent(listItem3).addContent(listItem4);

        let list1 = ui_engine.list.init().setTitle('Plain List Example')
            .addContent(listItemCombine);

        //example 2
        let nestedListItem = ui_engine.list_item.init().setTitle('Plain List')
            .addContent(listItem1).addContent(listItem2).addContent(listItem3).addContent(listItem4).addContent(listItemCombine);

        let nestedList = ui_engine.list_item.init().setTitle('Nested List Example')
            .addContent(listItem1).addContent(listItemCombine).addContent(nestedListItem).addContent(listItem4);

        let list2 = ui_engine.list.init().setTitle('Nested List Example')
            .addContent(nestedList);

        let listStack = ui_engine.vertical_stack.init().setRowSpacing(10)
            .addContent(list1).addContent(list2);

        let listSection = ui_engine.section.init()
            .makeExpandable()
            .setTitle('List Section')
            .setSubTitle('Sample List Section')
            .addContent(listStack);

        mainOuterSection.addContent(listSection);

        /**********************************Tabs Example************************************/

            //Example 1
        let tab1 = ui_engine.tab.init().setTitle('ITEM ONE').addContent(buttonRaised1);
        let tab2 = ui_engine.tab.init().setTitle('ITEM TWO').addContent(buttonRaised2);
        let tab3 = ui_engine.tab.init().setTitle('ITEM THREE').addContent(buttonRaised3);

        let tabs1 = ui_engine.tabs.init().addContent([tab1, tab2, tab3]);


        //Example 1
        let tab11 = ui_engine.tab.init().setTitle('ITEM ONE').setIcon('home').addContent(buttonRaised1);
        let tab21 = ui_engine.tab.init().setTitle('ITEM TWO').setIcon('card_giftcard').addContent(buttonRaised2);
        let tab31 = ui_engine.tab.init().setTitle('ITEM THREE').setIcon('build').addContent(buttonRaised3);

        let tabs11 = ui_engine.tabs.init().addContent([tab11, tab21, tab31]);


        let tabsStack = ui_engine.vertical_stack.init().setRowSpacing(10)
            .addContent(tabs1).addContent(tabs11);

        let tabsSection = ui_engine.section.init()
            .makeExpandable()
            .setTitle('TABS Section')
            .setSubTitle('Sample TABS Section')
            .addContent(tabsStack);

        mainOuterSection.addContent(tabsSection);


        /**********************************CODE Example************************************/

        let codeElement = ui_engine.code.init().setTitle(`${serverUrl}public/sampleCode.md`);

        let codeSection = ui_engine.section.init()
            .makeExpandable()
            .setTitle('CODE Section')
            .setSubTitle('Sample Code Section')
            .addContent(codeElement);

        mainOuterSection.addContent(codeSection);


        return mainOuterSection.render();
    },
    async options1(object, options){
        return ['Delhi', 'Mumbai', 'Banglore', 'Puna']
    },
    async options2(object, options){
        return [
            {text: 'Delhi', value: 'NCR'},
            {text: 'Noida', value: 'NCR'},
            {text: 'Gurgaon', value: 'NCR'},
            {text: 'Faridabad', value: 'NCR'},
            {text: 'Ghaziabad', value: 'NCR'},
            {text: 'Mumbai', value: 'Maharashtra'},
            {text: 'Puna', value: 'Maharashtra'},
        ]
    },
    async options3(object, options){
        return {'Delhi': 'Mumbai', 'Banglore': 'Puna'}
    },

    async tableApi(object, options){
        let {currentPage = 1, pageSize = 15} = options.query;

        let data = [];
        for (let i = 0; i < pageSize; i++) {
            data.push({
                name : `NAME-${currentPage}-${i}`,
                phone: Math.floor(10000000 + Math.random() * 90000)
            })
        }

        return {
            data  : data,
            paging: {
                serverSide : true,
                currentPage: currentPage,
                pageSize   : pageSize,
                totalPages : 30
            }
        }
    },


    async employeeList(object, options){
        let {configID} = options.query;
        let default_view = ui_engine.default_template.init()
        .setHeader(ui_engine.header.init().setTitle("Page Title").setSubTitle("Subtitle").setAvatar("http://www.iconsfind.com/wp-content/uploads/2015/10/20151012_561bac77eb9eb.png"))
        // .setContentUrl(serverUrl + 'api/feeder/' + 'rightPanel/')
        .addRightAction(ui_engine.button_raised.init().setTitle('Action1'))
        .addRightAction(ui_engine.button_raised.init().setTitle('Action2'))

        let overlay_view = ui_engine.overlay_template.init()
        .setHeader(ui_engine.header.init().setTitle("Page Title").setSubTitle("Subtitle").setAvatar("http://www.iconsfind.com/wp-content/uploads/2015/10/20151012_561bac77eb9eb.png"))
        // .setContentUrl(serverUrl + 'api/feeder/' + 'rightPanel/')
        .addRightAction(ui_engine.button_raised.init().setTitle('Action1'))
        .addRightAction(ui_engine.button_raised.init().setTitle('Action2'))

        if(configID == "defaultView"){
          return default_view.setContentUrl(serverUrl + 'api/feeder/' + 'rightPanel/').render()
          // return {
          //   type:"default_template",
          //   header: {
          //     title:"Page Title",
          //     icon:"http://www.iconsfind.com/wp-content/uploads/2015/10/20151012_561bac77eb9eb.png",
          //     subheader:"Subtitle"
          //   },
          //   action_items:[
          //     {
          //       name:"Action1"
          //     },
          //     {
          //       name:"Action2"
          //     }
          //   ],
          //   content_url:{
          //     "url": serverUrl + 'api/feeder/' + 'rightPanel/',
          //     "method": "GET"
          //   }
          // }
        }
        else if(configID == "emp_list"){
          return default_view.setContentUrl(serverUrl + 'api/ui-examples/' + 'view/?configID=emplist').render()
        }
        else if(configID == "overlayView"){
          return overlay_view.setContentUrl(serverUrl + 'api/feeder/' + 'rightPanel/').render()
          // return {
          //   type:"default_template",
          //   header: {
          //     title:"Page Title",
          //     icon:"http://www.iconsfind.com/wp-content/uploads/2015/10/20151012_561bac77eb9eb.png",
          //     subheader:"Subtitle"
          //   },
          //   action_items:[
          //     {
          //       name:"Action1"
          //     },
          //     {
          //       name:"Action2"
          //     }
          //   ],
          //   content_url:{
          //     "url": serverUrl + 'api/feeder/' + 'rightPanel/',
          //     "method": "GET"
          //   }
          // }
        }
        else if(configID == "profile"){
          return overlay_view.setContentUrl(serverUrl + 'api/ui-examples/' + 'view/?configID=profile').render()
        }
        else if (configID.includes('emp'))
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
        else
            return empProfileView.getProfileView()

    },


    async mobieUIText(){
        return ui_engine.actions.init()
            .addContent(ui_engine.actions_item.init().setTitle("Re").setSubTitle("REPORT").setBackgroundColor("#ffa726").setTextColor("#deffffff"))
            .addContent(ui_engine.actions_item.init().setTitle("Att").setSubTitle("ATTENDANCE").setBackgroundColor("#ab47bc").setTextColor("#deffffff"))
            .addContent(ui_engine.actions_item.init().setTitle("Att").setSubTitle("INCENTIVES").setBackgroundColor("#5c6bc0").setTextColor("#deffffff"))
            .addContent(ui_engine.actions_item.init().setTitle("Lv").setSubTitle("LEAVE").setBackgroundColor("#7e57c2").setTextColor("#deffffff"))
            .addContent(ui_engine.actions_item.init().setTitle("Fe").setSubTitle("FEEDBACK").setBackgroundColor("#7e57c2").setTextColor("#deffffff").setNotificationCount(9))
            .addContent(ui_engine.actions_item.init().setTitle("Tr").setSubTitle("TRAINING").setBackgroundColor("#26a69a").setTextColor("#deffffff"))
            .addContent(ui_engine.actions_item.init().setTitle("Qz").setSubTitle("QUIZES").setBackgroundColor("#66bb6a").setNotificationCount(2).setTextColor("#deffffff"))
            .addContent(ui_engine.actions_item.init().setTitle("Si").setSubTitle("SALARY").setBackgroundColor("#42a5f5").setTextColor("#deffffff"))
            .render();
    },

    async search(object, options){
        let {q : searchQuery = "TEST"}   = options.query;
        return [searchQuery, searchQuery + searchQuery, searchQuery + searchQuery + searchQuery, "TEST", "NEW OLR"];
    },

    async notifications(){
        return ["Pending Requests", "New OLR", "Some More"];
    }
};

export default examples;
