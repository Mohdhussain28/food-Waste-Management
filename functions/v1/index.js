// Firebase SDK
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const authMiddleware = require("../middlewares/auth");

const Firestore = admin.firestore();
const app = express();
app.use(cors({ origin: true }));

app.use(authMiddleware);
app.use("/doner", require("./doner"));
app.use("/collector", require("./collector"));

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).send(err.message || "Unexpected error!");
});

app.listen();
exports.app = functions.https.onRequest(app);