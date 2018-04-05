const uiExampleRoutes = require('express').Router();
import example from "./example";
import pagesView from "./pagesView";

var api = require('_includes').api;

/**************************** EXAMPLE PAGE APIS *******************************************/
uiExampleRoutes.get('/', api.http(example.examples));
uiExampleRoutes.get('/getOptions1', api.http(example.options1));
uiExampleRoutes.get('/getOptions2', api.http(example.options2));
uiExampleRoutes.get('/getOptions3', api.http(example.options3));

uiExampleRoutes.get('/tableApi', api.http(example.tableApi));
/**************************** EXAMPLE PAGE APIS END*******************************************/

/** Menu for Navigation on webpanel **/

// uiExampleRoutes.get('/menus', api.http(example.menus));
uiExampleRoutes.get('/view', api.http(pagesView.employeeList));

uiExampleRoutes.get('/bootstrap/view', api.http(pagesView.Page_Config));
uiExampleRoutes.get('/bootstrap/employees/getemployees', api.http(pagesView.employee_List));
uiExampleRoutes.get('/bootstrap/facilities/getfacilities', api.http(pagesView.facility_List));

// uiExampleRoutes.get('/view', api.http(example.employeeList));
// uiExampleRoutes.get('/mobile-ui-test', api.http(example.mobieUIText));

uiExampleRoutes.get('/search', api.http(example.search));
uiExampleRoutes.get('/notifications', api.http(example.notifications));


/**
 * You can also write in this way
 * but no middleware support will be provided
 */
uiExampleRoutes.get('/test', (req, res) => {
    res.statusCode = 200;
    res.send("ok");
});

export default uiExampleRoutes;
