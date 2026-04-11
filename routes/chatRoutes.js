const express = require("express");
const router = express.Router();
const { saveChat, getChatsBySession } = require("../controllers/chatbotController");
const {authMiddleware} = require('../middlewares/authMiddleware')

router.post("/",authMiddleware, saveChat);
router.get("/:sessionId", authMiddleware, getChatsBySession);

module.exports = router;