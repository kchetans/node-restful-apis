const menu = require('express').Router();
import menu_svc from "./menu";
var api = require('_includes').api;
// import login_config from "./login-config";
// let menu_store = require('_includes/cassandra/modules/menus')

menu.get('/', api.http(menu_svc.getMenu));

export default menu;
