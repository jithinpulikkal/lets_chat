import mongoose from 'mongoose'

const msgSchema = new mongoose.Schema(
{
    chatId: String,
    senderId: String,
    text: String
},
{
    timestamps: true,
})

const msgModel  = mongoose.model('Message', msgSchema)

export default msgModel