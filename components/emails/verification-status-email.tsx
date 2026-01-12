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

interface VerificationStatusEmailProps {
    userFirstname: string
    status: "approved" | "rejected"
    reason?: string
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ? `https://${process.env.NEXT_PUBLIC_APP_URL}` : ""

export const VerificationStatusEmail = ({
    userFirstname,
    status,
    reason,
}: VerificationStatusEmailProps) => {
    const isApproved = status === "approved"

    return (
        <Html>
            <Head />
            <Preview>
                {isApproved
                    ? "Your account verification was successful!"
                    : "Update regarding your account verification"}
            </Preview>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                brand: "#ea580c",
                                success: "#22c55e",
                                error: "#ef4444",
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
                            Verification {isApproved ? "Approved" : "Update"}
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hello {userFirstname},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            {isApproved
                                ? "Great news! Your account verification has been approved. You can now list and manage your items with full access."
                                : "Thank you for submitting your verification documents. Unfortunately, we couldn't verify your account at this time."}
                        </Text>
                        {!isApproved && reason && (
                            <Section className="bg-[#f9fafb] p-[16px] rounded my-[20px] border border-solid border-[#eaeaea]">
                                <Text className="text-black text-[14px] leading-[24px] font-semibold mb-[4px]">
                                    Reason for rejection:
                                </Text>
                                <Text className="text-black text-[14px] leading-[24px] m-0">
                                    {reason}
                                </Text>
                            </Section>
                        )}
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-brand rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={`${baseUrl}/dashboard`}
                            >
                                {isApproved ? "Go to Dashboard" : "Retry Verification"}
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

export default VerificationStatusEmail
