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
