import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Section,
    Text,
    Tailwind,
} from "@react-email/components"
import * as React from "react"

interface BookingConfirmationEmailProps {
    userFirstname: string
    listingTitle: string
    startDate: string
    endDate: string
    totalAmount: number
    bookingUrl: string
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ""

export const BookingConfirmationEmail = ({
    userFirstname,
    listingTitle,
    startDate,
    endDate,
    totalAmount,
    bookingUrl,
}: BookingConfirmationEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Booking Confirmed: {listingTitle}</Preview>
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
                            Booking Confirmed!
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hi {userFirstname},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Your booking for <strong>{listingTitle}</strong> has been successfully confirmed.
                        </Text>
                        <Section className="bg-slate-50 p-4 rounded-lg my-4">
                            <Text className="text-black text-[14px] m-0">
                                <strong>Dates:</strong> {startDate} - {endDate}
                            </Text>
                            <Text className="text-black text-[14px] m-0">
                                <strong>Total:</strong> KSh {totalAmount.toLocaleString()}
                            </Text>
                        </Section>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-brand rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={bookingUrl}
                            >
                                Manage Booking
                            </Button>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default BookingConfirmationEmail
