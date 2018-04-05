let _ = require('lodash');
let categories = [
    {
        "value": "beautician",
        "key": "Beautician"
    },
    {
        "value": "bouncer",
        "key": "Bouncer"
    },
    {
        "value": "caretaker_nanny",
        "key": "Caretaker / Nanny"
    },
    {
        "value": "carpenter",
        "key": "Carpenter"
    },];
let category_key = [{value: "caretaker_nanny"}, {value: "carpenter"}];
let a = _.intersectionBy(categories, category_key, 'value');

console.log("a", a);