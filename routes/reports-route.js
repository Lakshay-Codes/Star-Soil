import express from "express";
import { authenticationMiddleware } from "../middleware/index.js";
import PlanetModel from "../models/planet-model.js";
import PaymentModel from "../models/payment-model.js";
import UserModel from "../models/user-model.js";

const router = express.Router();

router.get('/admin-reports',authenticationMiddleware, async (req,res) =>{
    try{
        const [totalUsers, totalPlanets, payments, recentFivePayments] = await Promise.all([
            UserModel.countDocuments({}),
            PlanetModel.countDocuments({}),
            PaymentModel.find({}).sort({createdAt:-1}),
            PaymentModel.find({}).sort({createdAt:-1}).limit(5)
        ]);    
        const response = {
            totalUsers,
            totalPlanets,
            totalPayments: payments.length,
            totalAmount: payments.reduce(
                (acc,payment) => acc + payment.amount,0
            ),
            recentFivePayments: recentFivePayments
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
        const payments = await PaymentModel.find({user: req.params.id}).populate('planet').sort({createdAt:-1});
        
        const distinctPlanetIds = [...new Set(payments.map(payment => payment.planet?._id.toString()))];
        const totalPlanetsLandAcquired = distinctPlanetIds.length;

        const recentThreePayments = payments.slice(0, 3);

        const response = {
            totalPlanetsLandAcquired,
            totalPayments: payments.length,
            totalAmount: payments.reduce(
                (acc,payment) => acc + payment.amount,0
            ),
            recentThreePayments
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