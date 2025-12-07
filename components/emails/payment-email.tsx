import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Section,
    Text,
    Tailwind,
    Hr,
} from "@react-email/components"
import * as React from "react"

interface PaymentSuccessEmailProps {
    userFirstname: string
    amount: number
    itemName: string
    transactionId: string
    date: string
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ? `https://${process.env.NEXT_PUBLIC_APP_URL}` : ""

export const PaymentSuccessEmail = ({
    userFirstname,
    amount,
    itemName,
    transactionId,
    date,
}: PaymentSuccessEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Payment Confirmation - Leli Rentals</Preview>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                brand: "#ea580c",
                            },
                        },
                    },
                }}
            >
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Section className="mt-[32px]">
                            <Img
                                src={`${baseUrl}/logo.png`}
                                width="120"
                                height="32"
                                alt="Leli Rentals"
                                className="my-0 mx-auto"
                            />
                        </Section>
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Payment Successful
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hi {userFirstname},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Thank you for your payment. Your transaction has been completed successfully.
                        </Text>
                        <Section className="bg-gray-50 p-4 rounded-lg my-4">
                            <Text className="text-gray-500 text-[12px] uppercase font-bold m-0 mb-2">Transaction Details</Text>
                            <div className="flex justify-between mb-1">
                                <Text className="text-gray-700 m-0">Item:</Text>
                                <Text className="text-black font-semibold m-0">{itemName}</Text>
                            </div>
                            <div className="flex justify-between mb-1">
                                <Text className="text-gray-700 m-0">Amount:</Text>
                                <Text className="text-black font-semibold m-0">KSh {amount.toLocaleString()}</Text>
                            </div>
                            <div className="flex justify-between mb-1">
                                <Text className="text-gray-700 m-0">Transaction ID:</Text>
                                <Text className="text-black font-mono text-xs m-0">{transactionId}</Text>
                            </div>
                            <div className="flex justify-between">
                                <Text className="text-gray-700 m-0">Date:</Text>
                                <Text className="text-black m-0">{date}</Text>
                            </div>
                        </Section>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                        <Text className="text-gray-500 text-[12px] text-center">
                            Leli Rentals, Nairobi, Kenya
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default PaymentSuccessEmail
