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

interface WelcomeEmailProps {
    userFirstname: string
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ? `https://${process.env.NEXT_PUBLIC_APP_URL}` : ""

export const WelcomeEmail = ({ userFirstname }: WelcomeEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Welcome to Leli Rentals!</Preview>
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
                            Welcome to <strong>Leli Rentals</strong>, {userFirstname}!
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hello {userFirstname},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            We're excited to have you on board. Leli Rentals is the best place to find and rent everything you need, from cars to cameras.
                        </Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-brand rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={`${baseUrl}/dashboard`}
                            >
                                Go to Dashboard
                            </Button>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            If you have any questions, feel free to reply to this email or contact our support team.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default WelcomeEmail
