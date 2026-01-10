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

interface VerificationReminderEmailProps {
    userFirstname: string
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ? `https://${process.env.NEXT_PUBLIC_APP_URL}` : ""

export const VerificationReminderEmail = ({ userFirstname }: VerificationReminderEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Verify your account to start hosting on Leli Rentals</Preview>
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
                            Almost there, {userFirstname}!
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            We noticed you haven&apos;t completed your account verification yet.
                            To start hosting items and earning money on Leli Rentals, we need to verify your identity.
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            It only takes a few minutes to upload your documents securely.
                        </Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-brand rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={`${baseUrl}/dashboard/verification`}
                            >
                                Complete Verification
                            </Button>
                        </Section>
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            If you have already submitted your documents, please ignore this email while our team reviews them.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default VerificationReminderEmail
