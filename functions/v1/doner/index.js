/* eslint-disable */
const express = require("express");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { success, error } = require("../../utils");
const { FieldValue } = require("firebase-admin/firestore");

const router = express.Router();
const Firestore = admin.firestore();

router.get("/bye", (req, res) => {
    res.status(200).json({ message: "bye" })
})

/* eslint-disable */
router.post("/create", async (req, res) => {
    const donerId = req.body?.donerId;
    const name = req.body?.name;

    return Firestore.collection("doner")
        .doc(donerId)
        .set({
            _id: donerId,
            name: name,
            created_at: FieldValue.serverTimestamp(),
            food: [],
            request_status: false
        }).then(() => {
            res.status(201).json(
                success(null, "the Doner has been created successfully")
            );
        }).catch((err) => {
            functions.logger.error(err);
            res.status(500).json(error(err));
        });

})

router.patch("/request-status", async (req, res) => {
    const donerId = req.body?.donerId;

    if (!donerId || donerId.length == 0) {
        return res
            .status(400)
            .json(error(true, "doner Id is improperly formatted"));
    }

    try {
        const doc = await Firestore.collection("doner").doc(`${donerId}`).get();
        if (!doc.exists) {
            return res
                .status(404)
                .json(error(true, "Doner doesn't exists or DonerId is invalid"));
        }

        const doner = { ...doc.data() };
        if (doner._id != donerId) {
            return res
                .status(400)
                .json(error(true, "doner Id  is not correct"));
        }

        return Firestore.doc(`doner/${donerId}`).update({
            "request_status": true
        }).then(() => {
            res.status(200).json({ success: true })
        })

    } catch (err) {
        functions.logger.error(err);
        return res.status(500).json(error(err));
    }



})

module.exports = router;