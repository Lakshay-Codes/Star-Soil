import mongoose from "mongoose";    
const paymentSchema=new mongoose.Schema({
    amount : {
        type : Number,
        required : true
    },
    message:{
        type : String,
    },
    planet:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'planets',
        required : true
    },
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'users',
        required : true
    } ,
    paymentId:{
        type: String,
        required : true
    }
},{timestamps:true})

const PaymentModel=mongoose.model('payments',paymentSchema);
export default PaymentModel;