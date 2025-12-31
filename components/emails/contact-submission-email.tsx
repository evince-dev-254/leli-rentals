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

interface ContactFormEmailProps {
    name: string
    email: string
    subject: string
    message: string
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ""

export const ContactFormEmail = ({
    name,
    email,
    subject,
    message,
}: ContactFormEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>New Contact Form Submission: {subject}</Preview>
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
                            New <strong>Contact Support</strong> Message
                        </Heading>
                        <Section className="bg-[#f9f9f9] rounded p-[20px] my-[20px] border border-solid border-[#eeeeee]">
                            <Text className="text-black text-[14px] leading-[24px] m-0">
                                <strong>From:</strong> {name} ({email})
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px] m-0">
                                <strong>Subject:</strong> {subject}
                            </Text>
                        </Section>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                        <Section>
                            <Text className="text-black text-[14px] leading-[24px] font-semibold mb-1">
                                Message Content:
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px] mt-0 whitespace-pre-wrap">
                                {message}
                            </Text>
                        </Section>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                        <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
                            This message was sent from the contact form on leli.rentals
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default ContactFormEmail
