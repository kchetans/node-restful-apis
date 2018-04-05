var ui_engine = require('ui-schema');

let profileDataInfo = {
    name     : 'Amit Agarwal',
    profile  : 'Sr. Developer',
    image    : 'https://s-media-cache-ak0.pinimg.com/originals/8b/21/70/8b2170734a6d16c05c8fae7c8b625941.jpg',
    basicInfo: {
        status: 'Married',
        email : 'amit@workex.com',
        dob   : moment().subtract(20, 'year').fromNow(),
        doj   : moment().subtract(1, 'month').fromNow(),
    },
    address  : {
        house  : '321',
        street : ' Dollar Layout',
        city   : 'Banglore',
        State  : 'karnataka',
        country: 'India'
    }
};


export const getProfileView = (profileData = profileDataInfo) => {
    let {name, profile, image, basicInfo, address} = profileDataInfo;
    let returnSection                              = ui_engine.page.init();

    let mainInfoSection = ui_engine.section.init()
        .addContent(
            ui_engine.row_col_container.init().setColumnCount(2)
                .addContent(
                    ui_engine.avatar.init().setSize(100).setUrl(image)
                )
                .addContent(
                    ui_engine.span.init().setText(name).setSize(2)
                )
                .addContent(
                    ui_engine.span.init().setText(profile).setSize(4)
                )
        );
    returnSection.addContent(mainInfoSection);

    for (let section in {basicInfo, address}) {
        let basicInfoSection = ui_engine.section.init().setTitle(section);
        for (let key in profileDataInfo[section]) {
            basicInfoSection.addContent(ui_engine.span.init().setTitle(key + ' - ' + profileDataInfo[section][key]));
        }
        returnSection.addContent(basicInfoSection);
    }

    return returnSection.render();
};
