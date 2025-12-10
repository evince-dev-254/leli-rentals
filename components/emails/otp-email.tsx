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

interface OtpEmailProps {
    code: string
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ""

export const OtpEmail = ({ code }: OtpEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Your Verification Code: {code}</Preview>
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
                            Complete Your Signup
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Welcome to leli rentals! Here&apos;s your verification code to complete your account registration:
                        </Text>
                        <Section className="bg-slate-100 p-[20px] rounded text-center my-[20px]">
                            <Text className="text-black text-[32px] font-bold tracking-[6px] m-0">
                                {code}
                            </Text>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px] text-center">
                            This code will expire in 10 minutes. If you didn&apos;t create an account, you can safely ignore this email.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default OtpEmail
