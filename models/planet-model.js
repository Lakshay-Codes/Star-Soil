import mongoose from "mongoose";

const planetSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    organizer:{
        type: String,
        required: true
    },
    targetAmount:{
        type: Number,
        required: true
    },
    startDate :{
        type: String,
        required: true
    },
    endDate :{
        type: String,
        required: true
    },
    collectedAmount:{
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    showPaymentsInPlanetPage:{
        type: Boolean,
        required: true,
        default: true
    },
    images:{
        type: Array,   
        required: false 
    },
    category:{
        type: String,
        required: true
    }
}, {timestamps: true});

 const PlanetModel = mongoose.model("planets", planetSchema);

 export default PlanetModel;