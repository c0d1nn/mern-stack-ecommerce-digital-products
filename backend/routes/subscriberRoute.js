import express from "express";
import { Subscriber } from "../models/subscriberModel.js";

const router = express.Router();

router.post('/', async (req, res) => {
    const { email } = req.body;

    try {
        const newSubscriber = await Subscriber.create({ email });
        res.status(201).send(newSubscriber);
    } catch (error) {
        res.status(400).send('Error subscribing: ' + error.message);
    }

});



export default router;