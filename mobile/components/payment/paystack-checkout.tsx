import React from 'react';
import { Paystack } from 'react-native-paystack-webview';
import { View, ActivityIndicator } from 'react-native';

interface PaystackCheckoutProps {
    onSuccess: (response: any) => void;
    onCancel: () => void;
    amount: number;
    email: string;
    billingName?: string;
}

export const PaystackCheckout = ({
    onSuccess,
    onCancel,
    amount,
    email,
    billingName
}: PaystackCheckoutProps) => {
    return (
        <View style={{ flex: 1 }}>
            <Paystack
                paystackKey={process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || ''}
                amount={(amount / 100).toString()} // The library often expects a string or handles formatting
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
                renderLoading={() => (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#f97316" />
                    </View>
                )}
            />
        </View>
    );
};
