const express = require("express");
const router = express.Router();
const { createSession, getUserAllSessions, getUserSession } = require("../controllers/sessionController");
const {authMiddleware} = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createSession);
router.get("/", authMiddleware, getUserAllSessions);
router.get("/:sessionId", authMiddleware, getUserSession);


module.exports = router;