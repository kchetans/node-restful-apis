/**
 * Created By KARTIK AGARWAL
 * on 8 June, 2017
 */
import mongoose, {Schema} from "mongoose";
import baseModel from "./base";

/**
 * Its a logger schema,
 * whenever any location update called from user end, it insert here.
 * either its device location, or search location
 *
 */
const DocumentsSchema = new Schema({

        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user_profiles',
            required: true
        },


        locations: {
            lat: {
                type: Number,
                default: 0
            },
            lon: {
                type: Number,
                default: 0
            },
            accuracy: Number,
            time: {
                type: Date,
                default: Date.now,
            },
        }

    })
;


DocumentsSchema.plugin(baseModel, {});
const DocumentsModel = mongoose.model('user_locations', DocumentsSchema);


// expose the access model
module.exports = DocumentsModel;
