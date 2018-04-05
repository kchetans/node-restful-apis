import _ from 'lodash';

export const getOrgCode = function (orgName) {
    return _.snakeCase(orgName);
};
