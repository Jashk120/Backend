import mongoose, {Schema, model} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const vidoSchema =new Schema({
    videoFile:{
        type:String,
        required: true,
    } , 
    thumbNail:{
        type:String,
        required: true,
    },
    title:{
        type:String,
        required: true,
    },
    title:{
        type:String,
        required: false,
    },
    duration:{
        type:String,
        required: false,
    },
    views:{
        type: Number,
        default: 0,
    },
    isPublished:{
        type: Boolean,
        default: true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref: "User"
    }


},{timestamps:true})

vidoSchema.plugin(mongooseAggregatePaginate)
export const Video = model("Video", vidoSchema)