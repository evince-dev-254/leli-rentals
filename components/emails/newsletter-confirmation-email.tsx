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
} from "@react-email/components"
import * as React from "react"

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ""

export const SubscriptionConfirmationEmail = () => {
    return (
        <Html>
            <Head />
            <Preview>You&apos;re subscribed to Leli Rentals!</Preview>
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
                                alt="leli rentals"
                                className="my-0 mx-auto"
                            />
                        </Section>
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Welcome to our <strong>Newsletter</strong>!
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hello,
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Thank you for subscribing to the Leli Rentals newsletter. You&apos;ll now be the first to know about exclusive deals, new listings, and rental tips delivered straight to your inbox.
                        </Text>
                        <Section className="bg-[#f4f4f4] rounded p-[20px] my-[20px]">
                            <Text className="text-black text-[14px] leading-[24px] m-0">
                                <strong>What to expect:</strong>
                                <ul className="mt-2">
                                    <li>Weekly highlights of top-rated rentals</li>
                                    <li>Early access to seasonal promotions</li>
                                    <li>Expert tips on hosting and renting</li>
                                </ul>
                            </Text>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            If you didn&apos;t sign up for this, you can ignore this email or unsubscribe at any time.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default SubscriptionConfirmationEmail
