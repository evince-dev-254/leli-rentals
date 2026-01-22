import * as React from 'react';
import { useEffect } from 'react';
import { usePaystack } from 'react-native-paystack-webview';
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
    const { popup } = usePaystack();

    useEffect(() => {
        if (popup) {
            popup.checkout({
                email,
                amount: amount / 100, // v5 expects amount in main currency (e.g. Naira/KES), not kobo/cents
                metadata: billingName ? {
                    custom_fields: [
                        {
                            display_name: "Billing Name",
                            variable_name: "billing_name",
                            value: billingName
                        }
                    ]
                } : {},
                onSuccess: (res) => {
                    console.log('Payment Successful', res);
                    onSuccess(res);
                },
                onCancel: () => {
                    console.log('Payment Cancelled');
                    onCancel();
                },
                onError: (err: { message: string }) => {
                    console.error('Paystack Error', err);
                    onCancel();
                }
            });
        }
    }, [popup, email, amount, billingName, onSuccess, onCancel]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#f97316" />
        </View>
    );
};
