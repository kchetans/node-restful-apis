/**
 * Created by Raghvendra Srivastava
 * on 16 July 2017
 */
import UserProfileDataManager from "../../../data-manager/UserProfileDataManager";

let Bookmark_jobs = {

    async addBookmarks(object, options) {
        let {user, params} = options;
        let {job_id} = params;

        await UserProfileDataManager.addBookmarksJob(user._id, job_id);

        return {
            message: "added a bookmark"
        }
    },

    async removeBookmarks(object, options) {
        let {user, params} = options;
        let {job_id} = params;

        await UserProfileDataManager.removeBookmarkJob(user._id, job_id);

        return {
            message: "removed a bookmark"
        }
    }
};

export default Bookmark_jobs;