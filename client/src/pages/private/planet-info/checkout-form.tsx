import { PlanetTypeProps } from "../../../interfaces";
import {useStripe, useElements, PaymentElement, AddressElement } from "@stripe/react-stripe-js";
import { Button, Modal, message as AntDmessage } from "antd";
import axios from "axios";
import userStore, { UserStoreProps } from "../../../store/users-store";
import { useState } from "react";

function CheckoutForm({
  open = false,
  onClose = () => {},
  onCancel = () => {},
  planet,
  message,
  amount,
  reloadPlanetData,
}: {
  open: boolean;
  onClose: () => void;
  onCancel: () => void;
  planet: PlanetTypeProps;
  message: string;
  amount: number;
  reloadPlanetData: () => void;
}) {
    const {currentUser} = userStore() as UserStoreProps;
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event:any) => {
        try {
            setLoading(true);
            event.preventDefault();
            if (!stripe || !elements) {
              return;
            }
            const {error: submitError} = await elements.submit();
            if (submitError) {
                AntDmessage.error(submitError.message);
                return;
            }

            const result = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: "https://example.com/order/123/complete",
                },
                redirect: 'if_required',
            });
        
            if (result.error) {
                AntDmessage.error(result.error.message);
            } else {
                await axios.post('/api/payments/create', {
                    user: currentUser?._id,
                    planet: planet._id,
                    amount,
                    message,
                    paymentId: result.paymentIntent.id, 
                });
                AntDmessage.success('Land purchase successful');
                onClose();
                reloadPlanetData();
            }
        } catch (error: any) {
            AntDmessage.error(error.message || 'Purchase failed');
            onClose();
        } finally {
            setLoading(false);
        }   
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            title="Complete your land purchase"
            footer={null}
        >
            <form onSubmit={handleSubmit}>
                <PaymentElement  />
                <AddressElement options={{
                    mode: 'billing',
                    allowedCountries: ['US'],
                }} />
                <div className="flex justify-end gap-5 mt-5">
                    <Button onClick={onCancel} disabled={loading}>Cancel</Button>
                    <Button type="primary" htmlType="submit" disabled={!stripe} loading={loading}>Purchase now</Button>
                </div>
                    <h1>Note:</h1>
                    <hr/>
                    <p>1) Dummy pincode must be of 5 digits</p>
                    <p>2) 123 is the dummy security code</p>
                    <p>3) 4242 4242 4242 4242 is the dummy valid credit card number</p>
            </form>
        </Modal>
    );
}

export default CheckoutForm;
