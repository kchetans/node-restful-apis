const errors = require('../../errors');

let menu = {

    async getMenu(object, options){
        return [
            {
                title        : "Employee Management",
                icon        : null,
                items: [
                    {
                        type: "default",
                        text: "Employee Manager",
                        icon: 'EM',
                        url : "/employees",
                        hint: ""
                    },
                    {
                        type: "default",
                        text: "OLR Manager",
                        icon: 'OM',
                        url : "/olrs",
                        hint: ""
                    },
                    {
                        type: "default",
                        text: "Exit Request Manager",
                        icon: 'ERM',
                        url : "/exits",
                        hint: ""
                    },
                    {
                        type: "default",
                        text: "GA Form",
                        icon: 'GF',
                        url : "/page?pageid=5904bf8f76da23136cf4ee9c",
                        hint: ""
                    },
                    {
                        type: "default",
                        text: "Leaver Form",
                        icon: 'LF',
                        url : "/page?pageid=5906f1491187080ae0ea5771",
                        hint: ""
                    }
                ]
            },
            {
                title        : "Facility Management",
                icon        : null,
                items: [
                    {
                        type: "default",
                        text: "Facility Manager",
                        icon: 'FM',
                        url : "/facilities",
                        hint: ""
                    }
                ]
            }
            // ,
            // {
            //     title        : "CRM",
            //     icon        : null,
            //     items: [
            //         {
            //             type: "default",
            //             text: "PE Manager",
            //             icon: 'PM',
            //             url : "/principal_employers",
            //             hint: ""
            //         },
            //         {
            //             type: "default",
            //             text: "ORG Tree",
            //             icon: 'OT',
            //             url : "/org_tree",
            //             hint: ""
            //         }
            //     ]
            // },
            // {
            //     title        : "VMS",
            //     icon        : null,
            //     items: [
            //         {
            //             type: "default",
            //             text: "Staffing Agency Manager",
            //             icon: "SM",
            //             url : "/staffing_agencies",
            //             hint: ""
            //         }
            //     ]
            // }
        ]
    },

};

export default menu;
