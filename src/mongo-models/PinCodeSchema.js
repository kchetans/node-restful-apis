/**
 * Created by Kartik on 19/10/16.
 */
import mongoose, {Schema} from "mongoose";
import baseModel from "./base";

const PinCodeSchema = new Schema({

    pincode: {
        type: Number,
        required: true
    },

    city: {
        type: String
    },

    district: {
        type: String
    },

    state: {
        type: String
    }
});

PinCodeSchema.plugin(baseModel, {});

const PinCodeModel = mongoose.model('pin_code', PinCodeSchema);

// expose the access model
export default PinCodeModel;

