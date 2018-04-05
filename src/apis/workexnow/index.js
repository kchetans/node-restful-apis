const router = require('express').Router();
let api = require('_includes').api;
import Jobs from "./jobs";
import users from "./users";
import auth from "../../middleware/auth";
import search from "./search";
import publicRoutes from './public';

router.get('/', (req, res) => {
    res.send({'txt': 'tested on'});
});


// Require user for private endpoints
const authenticateUser = [
    auth.authenticate.authenticateUser
];


router.use('/init', authenticateUser, api.http(search.appOpen));
router.use('/search', authenticateUser, api.http(search.search));
router.use('/jobs', authenticateUser, Jobs);
router.use('/users', users);
router.use('/public', publicRoutes);

try {
    require('./chats/chat-socket-new');
} catch (err) {
    console.log("err", err);
}


module.exports = router;
