const express = require("express");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { success, error } = require("../../utils");

const router = express.Router();
const Firestore = admin.firestore();

router.get("/bye", (req, res) => {
    res.status(200).json({ message: "bye" })
})

module.exports = router;