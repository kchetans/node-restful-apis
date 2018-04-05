let prefix = "-lambda";

let urlParsed = (url, type, sizeToPass) => {
    console.log("ORIGINAL URL =>", url);
    if (url && url.indexOf(type) > 0) {
        let lastSlashIndex = url.lastIndexOf("/");
        url = url.substring(0, lastSlashIndex) + prefix + "/" + sizeToPass + url.substring(lastSlashIndex + 1);
    }
    console.log("CONVERTED URL =>", url);
    return url
};

export const getMinProfilePicUrl = (url) => {
    return urlParsed(url, 'wx-profile-pic', "150x150_");
};

export const getMediumProfilePicUrl = (url) => {
    return urlParsed(url, 'wx-profile-pic', "200x200_");
};

export const getOriginalProfilePicUrl = (url) => {
    return urlParsed(url, 'wx-profile-pic', "150x150_");
};

export const getJobCoverPicForMobile = (url) => {
    return urlParsed(url, 'wx-job-cover-pic', "300x100_");
};

export const getUserCoverPicForMobile = (url) => {
    return urlParsed(url, 'wx-user-cover-pic', "300x100_");
};


