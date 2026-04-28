```javascript
import mongoose, {Schema, model} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

/**
 * Represents the Mongoose schema for a video document.
 * 
 * @typedef {Object} VideoSchema
 * @property {String} videoFile - URL or path to the video file.
 * @property {String} thumbNail - URL or path to the thumbnail image.
 * @property {String} title - Title of the video (first appearance, required).
 * @property {String} title - Duplicate title field (optional, appears to be a typo).
 * @property {String} duration - Duration of the video (optional).
 * @property {Number} views - Number of views (defaults to 0).
 * @property {Boolean} isPublished - Whether the video is published (defaults to true).
 * @property {mongoose.Types.ObjectId} owner - Reference to the User model.
 * @property {Boolean} timestamps - Automatically adds createdAt and updatedAt fields.
 */
const vidoSchema = new Schema({
    videoFile: {
        type: String,
        required: true,
    },
    thumbNail: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: false,
    },
    duration: {
        type: String,
        required: false,
    },
    views: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

/**
 * Adds pagination support to the schema using the mongoose-aggregate-paginate-v2 plugin.
 */
vidoSchema.plugin(mongooseAggregatePaginate);

/**
 * The Mongoose model for the "Video" collection.
 * 
 * @type {import('mongoose').Model}
 */
export const Video = model("Video", vidoSchema);
```