import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const tokenSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
            unique: true,
        },
        emailToken: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            expires: 3600
        },
        used:{
            type: Boolean,
            default: false,
        }
    }
)

const emailToken = mongoose.model("emailToken", tokenSchema);

export default emailToken;