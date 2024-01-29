import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        firstName: { 
            type: String, 
            required: true,
            minLength: 2,
            maxLength: 15, 
        },
        lastName: { 
            type: String, 
            required: true,
            minLength: 2,
            maxLength: 15, 
        },
        username: { 
            type: String, 
            required: true,
            unique:true,
            minLength: 5,
            maxLength: 10, 
        },
        email:{
            type:String,
            unique:true,
            required:true,
        },
        password: {
            type: String,
            required: true,
            minLength: 8,
        },
        verified: {
            type: Boolean,
            default: false,
        }
    },{
        timestamps: true //Saves createdAt and updatedAt as dates (ISO 8
    }
)

const userModel = mongoose.model('User', userSchema)

export default userModel;