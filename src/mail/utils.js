const fs = require('fs-promise');
const path = require('path');
const Promise = require('bluebird');
const htmlToText = require('html-to-text');
const lodash = require('lodash').runInContext();
const config = require('config');
const templatesDir = path.resolve(__dirname, '..', 'mail', 'templates');

lodash.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

exports.generateContent = function generateContent(options) {
    let defaults, data;

    defaults = {
        siteUrl: config.get('forceSSL') ? (config.get('urlSSL') || config.get('url')) : config.get('url')
    };

    data = lodash.defaults(defaults, options.data);

    // read the proper email body template
    return fs.readFile(path.join(templatesDir, options.template + '.html'), 'utf8')
        .then(content => {
            var compiled, htmlContent, textContent;

            // insert user-specific data into the email
            compiled = lodash.template(content);
            htmlContent = compiled(data);

            // generate a plain-text version of the same email
            textContent = htmlToText.fromString(htmlContent);

            return {
                html: htmlContent,
                text: textContent
            };
        });
};
