let orgStructure = require("organisations/org-structure");
import * as errors from "../../errors";
import * as models from "sql-models";
let sequelize = require("sequelize");

let obj = {

    async orgStruc(object, options){
        let {le_id, bu_id, pos_id, head_pos_id} = options.query;

        let structureTreeNodes = [];

        if (pos_id) {
            //when position is clicked
            let [positions, bu] = await Promise.all([orgStructure.childPositionOfPosition({pos_id, bu_id}),
                orgStructure.childBuOfPosition({pos_id})
            ]);

            positions = _.map(positions, position => Object.assign({}, {
                type: 'position',
                relationship: "111"
            }, position));

            bu = _.map(bu, position => Object.assign({}, {
                type: 'bu', designation: position.bu_name,
                relationship: "111"
            }, position));

            // return {children: positions.concat(bu)};

            return {children: await obj.getEmpCountAtPosition2(positions.concat(bu))};
        }
        else if (head_pos_id) {
            //when bu is clicked
            let positions = await orgStructure.childPositionOfBu({head_pos_id, bu_id});
            positions = JSON.parse(JSON.stringify(positions));
            return {
                children: await obj.getEmpCountAtPosition2(_.map(positions, position => _.extend({
                    type: 'position',
                    relationship: "111"
                }, position)))
            };
        }
        else if (le_id) {
            // only head
            let positions = await orgStructure.headPosition({le_id});
            return await obj.getEmpCountAtPosition2(_.map(positions, position => _.extend({
                type: 'position',
                relationship: "111"
            }, position)));
        }

        throw new errors.ValidationError({message: 'le_id Required'});
    },


    async createBU(object, options){
        return await orgStructure.createBU(object);
    },

    async createPosition(object, options){
        return await orgStructure.createPosition(object);
    },

    async getEmpCountAtPosition(structureTreeNodes){
        let pos_ids = _.map(structureTreeNodes, node => node.pos_id || node.bu_id);
        for (let i = 0; i < pos_ids.length; i++) {
            let pos_id = pos_ids[i];
            let positionCount = await models.db.vw_employees.find({
                attributes: [[sequelize.fn('COUNT', sequelize.col('pos_id')), 'positionCount']],
                where: {
                    $or: [
                        {pos_id: pos_id},
                        {pe_pos_id: pos_id}
                    ]
                },
                raw: true
            });
            structureTreeNodes[i].positionCount = positionCount.positionCount;
        }
        return structureTreeNodes;
    },

    async getEmpCountAtPosition2(structureTreeNodes){

        let pos_ids = [];
        let bu_ids = [];

        for (let i = 0; i < structureTreeNodes.length; i++) {
            if (structureTreeNodes.type = 'position') {
                pos_ids.push(structureTreeNodes[i].pos_id)
            } else {
                bu_ids.push(structureTreeNodes[i].bu_id)
            }
        }

        let arrPro = obj.getEmpCountAtPosition3({pos_ids, bu_ids});
        let posCounts = await Promise.all(arrPro);
        return _.map(structureTreeNodes, (node, index) => Object.assign({}, node, {positionCount: posCounts[index]}));
    },


    async getEmpCountAtPosition3({pos_ids, bu_ids}){
        let p = [];
        for (let i = 0; i < pos_ids.length; i++) {
            p.push(new Promise((resolve, reject) => {
                let pos_id = pos_ids[i];
                models.db.vw_employees.count({
                    where: {
                        $or: [
                            {pos_id: pos_id},
                            {pe_pos_id: pos_id}
                        ]
                    },
                    raw: true
                }).then(positionCount => {
                    resolve(positionCount);
                });
            }));
        }
        for (let i = 0; i < bu_ids.length; i++) {
            p.push(new Promise((resolve, reject) => {
                let bu_id = bu_ids[i];
                models.db.vw_employees.count({
                    where: {
                        $or: [
                            {bu_id: bu_id},
                            {pe_bu_id: bu_id}
                        ]
                    },
                    raw: true
                }).then(positionCount => {
                    resolve(positionCount);
                });
            }));
        }
        return p;
    },
};

export default obj;
