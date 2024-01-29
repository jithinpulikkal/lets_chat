import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
// import authRoute from './routes/auth.js'
import userRoute from './routes/userRoute.js'
import chatRoute from './routes/chatRoute.js'
import msgRoute from './routes/msgRoute.js'

const app = express();
app.use(express.json()); // for parsing application/json

// Enable all CORS requests
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

dotenv.config()



//Routes
app.use('/api/users', userRoute)
app.use('/api/chats', chatRoute)
app.use('/api/messages', msgRoute)


const PORT = process.env.PORT || 5000;
const URI = process.env.MONGO_URI;

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port: ${PORT}`)
});

mongoose.connect(URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => console.log(error));