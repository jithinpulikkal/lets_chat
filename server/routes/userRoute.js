import express from 'express'
import { 
    signup, 
    login, 
    findUser, 
    getUsers, 
    forgotPassword, 
    verifyEmail
} from '../controllers/userController.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/find/:userId', findUser)
router.get('/users', getUsers)
router.post('/forgot', forgotPassword)
router.get("/:id/verify/:token", verifyEmail)



export default router