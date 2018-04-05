import mongoose, {Schema} from "mongoose";
import baseModel from "./base";


const ConfigSchema = new Schema({

    code: {
        type: String,
        required: true,
        unique : true
    },

    config: {
        type: Schema.Types.Mixed,
        required: true
    }
});

ConfigSchema.plugin(baseModel, {});


const ConfigModel = mongoose.model('Configs', ConfigSchema);

// expose the access model
module.exports = ConfigModel;

