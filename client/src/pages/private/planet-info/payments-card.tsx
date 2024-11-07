import { Button, InputNumber, Progress, message as AntDMessage, App } from "antd";
import { PlanetTypeProps } from "../../../interfaces";
import { useState } from "react";
import Input from "antd/es/input/Input";
import axios from "axios";
import {Elements} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Convert } from "easy-currencies";
import CheckoutForm from "./checkout-form";
import { format } from "indian-number-format";

const stripePublishableKey = 'pk_test_51QFZkn08gVjZaMTH2il5gO7pKCGDRzX2LaAeBqAvxUB7j9X2Cv9BEwibhN6rLZIiZXVTY3lKym0WO2ZPDbnwQSmI00qHw74a7r';
const stripePromise = loadStripe(stripePublishableKey);

function PaymentsCard({planet, reloadPlanetData}:{planet:PlanetTypeProps, reloadPlanetData:()=>void}) {
    const [acres, setAcres] = useState(1);
    const [message, setMessage] = useState('Happy buying!');
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [open, setOpen] = useState(false);

    const amount = acres * 5000;
    const availableAcres = (planet.targetAmount - planet.collectedAmount) / 5000;

    const options = {
        clientSecret: clientSecret,
    };

    const getClientSecretToken= async()=>{
        try {
            setLoading(true);
            if(!planet.isActive){
                AntDMessage.error("This celestial body is not available for purchase");
                return ;
            }
            const amountInDollar = await Convert(amount).from("INR").to("USD");
            const response = await axios.post(`/api/stripePayments/create-payment-intent`, {amount:amountInDollar});
            setClientSecret(response.data.clientSecret);
            setOpen(true);
        } catch (error:any) {
            if(amount==0){
                AntDMessage.error("This celestial body is not available for purchase");
            }else{
                AntDMessage.error(error.message);
            }
        }finally{
            setLoading(false);
        }
    }

    return (
        <App>
            <div className="p-5 border border-solid border-gray-300">
                <div className="px-2 pb-2">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Purchase Space Land</h2>
                    <Progress percent={Number(((planet.collectedAmount / planet.targetAmount) * 100).toFixed(2))} strokeColor="#000000" />
                    <h1 className="text-sm text-black-500 mt-1">
                        {format(Number((Math.min(planet.collectedAmount/5000, planet.targetAmount/5000)).toFixed(2)))} acres claimed out of {format(Number((planet.targetAmount/5000).toFixed(2)))} acres
                    </h1>
                    <div className="flex flex-col mt-7">
                        <label htmlFor="" className="text-base text-gray-500">
                            Area (Acres)
                        </label>
                        <InputNumber 
                            className="w-full" 
                            value={acres} 
                            onChange={(value) => {
                                const numValue = Number(value);
                                setAcres(numValue);
                            }} 
                            placeholder="Enter area in acres" 
                            min={1} 
                            max={availableAcres}
                        />
                        <p className="text-sm text-gray-500 mt-1">Cost: ₹{format(amount)} (₹5,000/acre)</p>
                    </div>
                    <div className="flex flex-col mt-5">
                        <label htmlFor="" className="text-base text-gray-500">
                            Message for Land Deed
                        </label>
                        <Input 
                            className="w-full" 
                            type="text" 
                            value={message} 
                            placeholder="Add a message for your space land deed" 
                            onChange={(e) => setMessage(e.target.value)} 
                        />
                    </div>
                    <Button type="primary" className="w-full mt-5" onClick={getClientSecretToken} loading={loading}>
                        Purchase Land
                    </Button>
                </div>
                {clientSecret && (
                    <Elements stripe={stripePromise} options={options}>
                        <CheckoutForm 
                        reloadPlanetData={()=>{
                            reloadPlanetData();
                            setMessage("");
                            setAcres(1);
                        }}
                        onCancel={()=>{
                            setClientSecret('');
                            setOpen(false);
                        }}
                        open={open} onClose={()=>{
                            setClientSecret('');
                            setOpen(false);
                        }} planet={planet} message={message} amount={amount} />
                    </Elements>
                )}
            </div>
        </App>
    )
}

export default PaymentsCard