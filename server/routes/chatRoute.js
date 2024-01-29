import express from 'express'
import { createChat, findChat, getChats } from '../controllers/chatController.js'

const router =  express.Router()

router.post("/", createChat)
router.get("/:userId", getChats)
router.get("/find/:firstId/:secondId", findChat)

export default router