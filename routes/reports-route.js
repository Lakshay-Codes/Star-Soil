import express from "express";
import { authenticationMiddleware } from "../middleware/index.js";
import PlanetModel from "../models/planet-model.js";
import PaymentModel from "../models/payment-model.js";
import UserModel from "../models/user-model.js";

const router = express.Router();

router.get('/admin-reports',authenticationMiddleware, async (req,res) =>{
    try{
        const [totalUsers, totalPlanets, payments] = await Promise.all([
            UserModel.countDocuments({}),
            PlanetModel.countDocuments({}),
            PaymentModel.find({}).sort({createdAt:-1})
        ]);    
        const response = {
            totalUsers,
            totalPlanets,
            totalPayments: payments.length,
            totalAmount: payments.reduce(
                (acc,payment) => acc + payment.amount,0
            ),
            lastFivePayments:payments.slice(-5)
        }
        return res.status(200).json({
            success: true,
            message: "Admin reports generated successfully",
            data: response
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message || "Error generating admin reports"
        });
    }
})

router.get('/user-reports/:id',authenticationMiddleware, async (req,res) =>{
    try{
        const [ totalPlanets, payments] = await Promise.all([
            PlanetModel.countDocuments({organizer: req.params.id}),
            PaymentModel.find({user: req.params.id}).populate('planet').sort({createdAt:-1})
        ]);    
        const response = {
            totalPayments: payments.length,
            totalAmount: payments.reduce(
                (acc,payment) => acc + payment.amount,0
            ),
            lastFivePayments:payments.slice(-5)
        }
        return res.status(200).json({
            success: true,
            message: "User reports generated successfully",
            data: response
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message || "Error generating user reports"
        });
    }
})

export default router;