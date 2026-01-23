import * as React from 'react';
import { useEffect } from 'react';
import { usePaystack } from 'react-native-paystack-webview';
import type { SuccessResponse } from 'react-native-paystack-webview/production/lib/types';
import { View, ActivityIndicator } from 'react-native';

interface PaystackCheckoutProps {
    onSuccess: (response: SuccessResponse) => void;
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
        // Trigger payment on mount
        popup.checkout({
            email,
            amount,
            metadata: billingName ? { billing_name: billingName } : undefined,
            onSuccess: (res: SuccessResponse) => {
                console.log('Payment Successful', res);
                onSuccess(res);
            },
            onCancel: () => {
                console.log('Payment Cancelled');
                onCancel();
            },
            onError: (err: { message: string }) => {
                console.error('Payment Error', err);
                onCancel();
            }
        });
    }, [popup, email, amount, billingName, onSuccess, onCancel]);

    // Show loading indicator while payment is being processed
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#f97316" />
        </View>
    );
};
