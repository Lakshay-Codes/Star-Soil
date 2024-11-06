import express from "express";
import { authenticationMiddleware } from "../middleware/index.js";
import PlanetModel from "../models/planet-model.js";
import UserModel from "../models/user-model.js";

const router = express.Router();
 
router.post("/create", authenticationMiddleware, async (req, res) => {
    try {
        req.body.collectedAmount = 0;
        await PlanetModel.create(req.body);
        await UserModel.findByIdAndUpdate(req.user.userId, { updatedAt: new Date() });
        return res.status(201).json({message: "Planet created successfully"}); 
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
});

router.put("/update/:id", authenticationMiddleware, async (req, res) => {
    try {
        const {id} = req.params;
        const planet = await PlanetModel.findByIdAndUpdate(id, req.body, {new: true});
        if (!planet) {
            return res.status(404).json({message: "Planet not found"});
        }
        await UserModel.findByIdAndUpdate(req.user.userId, { updatedAt: new Date() });
        return res.status(200).json({message: "Planet updated successfully", planet});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
});

router.delete("/delete/:id", authenticationMiddleware, async (req, res) => {
    try {
        const {id} = req.params;
        const planet = await PlanetModel.findByIdAndDelete(id);
        if (!planet) {
            return res.status(404).json({message: "Planet not found"});
        }
        await UserModel.findByIdAndUpdate(req.user.userId, { updatedAt: new Date() });
        return res.status(200).json({message: "Planet deleted successfully", planet});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
});

router.get("/get-all", async (req, res) => {
    try {
        const planets = await PlanetModel.find().sort({createdAt: -1});
        if(req.user)
            await UserModel.findByIdAndUpdate(req.user.userId, { updatedAt: new Date() });
        return res.status(200).json({message: "Planets fetched successfully", planets});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
});

router.get("/get/:id", authenticationMiddleware, async (req, res) => {
    try {
        const {id} = req.params;
        const planet = await PlanetModel.findById(id);
        if (!planet) {
            return res.status(404).json({message: "Planet not found"});
        }
        await UserModel.findByIdAndUpdate(req.user.userId, { updatedAt: new Date() });
        return res.status(200).json({message: "Planet fetched successfully", planet});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }   
});

export default router;