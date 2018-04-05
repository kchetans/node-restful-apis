import _ from 'lodash';

export const filtersToJSON = function (filterConditions) {
    let returnData = new Map();
    if (filterConditions instanceof Array) {
        _.map(filterConditions, filterCondition => {
            let splited = _.split(filterCondition, "=");
            if (splited[0].length > 0)
                returnData.set(splited[0], splited[1])
        })
    } else {
        let splited = _.split(filterConditions, "=");
        if (splited[0].length > 0)
            returnData.set(splited[0], splited[1])
    }
    return returnData;
};
