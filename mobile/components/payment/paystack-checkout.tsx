import React from 'react';
import { Paystack } from 'react-native-paystack-webview';
import { View } from 'react-native';

interface PaystackCheckoutProps {
    onSuccess: (response: any) => void;
    onCancel: () => void;
    amount: number;
    email: string;
    paystackKey: string;
    billingName?: string;
}

export const PaystackCheckout = ({
    onSuccess,
    onCancel,
    amount,
    email,
    paystackKey,
    billingName
}: PaystackCheckoutProps) => {
    return (
        <View style={{ flex: 1 }}>
            <Paystack
                paystackKey={paystackKey}
                amount={amount}
                billingEmail={email}
                billingName={billingName}
                currency="KES"
                onCancel={(e) => {
                    console.log('Payment Cancelled', e);
                    onCancel();
                }}
                onSuccess={(res) => {
                    console.log('Payment Successful', res);
                    onSuccess(res);
                }}
                autoStart={true}
            />
        </View>
    );
};
