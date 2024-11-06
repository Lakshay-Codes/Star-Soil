import express from 'express';
import dotenv from "dotenv";
import stripe from 'stripe';
import { authenticationMiddleware } from '../middleware/index.js';
import UserModel from '../models/user-model.js';

dotenv.config();

const router = express.Router();
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', authenticationMiddleware, async (req, res) => {
    try {
        const paymentIntent = await stripeClient.paymentIntents.create({
            amount: Math.round(req.body.amount * 100), 
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            },
            description: 'Payment for planet',
        });
        await UserModel.findByIdAndUpdate(req.user.userId, { updatedAt: new Date() });
        return res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Payment intent creation failed:', error);
        return res.status(500).json({ 
            message: "Failed to create payment intent",
            error: error.message 
        });
    }
});

export default router;
