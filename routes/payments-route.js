import express from "express";
import { authenticationMiddleware } from "../middleware/index.js";
import PlanetModel from "../models/planet-model.js";
import PaymentModel from "../models/payment-model.js";
import UserModel from "../models/user-model.js";

const router = express.Router();
 
router.post("/create", authenticationMiddleware, async (req, res) => {
    try {
        await PaymentModel.create(req.body);
        await PlanetModel.findByIdAndUpdate(req.body.planet, {$inc:{collectedAmount:req.body.amount}});
        await UserModel.findByIdAndUpdate(req.body.user, { updatedAt: new Date() });
        return res.status(201).json({message: "Payment made successfully"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
});

router.get("/get-all", authenticationMiddleware, async (req, res) => {
    try {
        const payments = await PaymentModel.find()
            .populate('planet')
            .populate('user')
            .sort({createdAt: -1});
        await UserModel.findByIdAndUpdate(req.user.userId, { updatedAt: new Date() });
        return res.status(200).json({message: "Payments fetched successfully", payments});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
});

router.get("/get-payments-by-planet/:id", authenticationMiddleware, async (req, res) => {
    try {
        const payments = await PaymentModel.find({planet: req.params.id})
            .populate("planet")
            .sort({createdAt: -1});
        await UserModel.findByIdAndUpdate(req.user.userId, { updatedAt: new Date() });
        return res.status(200).json({message: "Payments fetched successfully", payments});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }   
});

router.get("/get-payments-by-user/:id", authenticationMiddleware, async (req, res) => {
    try {
        const payments = await PaymentModel.find({user: req.params.id})
            .populate('planet')
            .sort({createdAt: -1});
        await UserModel.findByIdAndUpdate(req.user.userId, { updatedAt: new Date() });
        return res.status(200).json({message: "User payments fetched successfully", payments});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
});

export default router;