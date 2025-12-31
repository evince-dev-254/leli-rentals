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

interface NewMessageEmailProps {
    receiverName: string
    senderName: string
    messageContent: string
    listingTitle?: string
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://leli.rentals"

export const NewMessageEmail = ({
    receiverName,
    senderName,
    messageContent,
    listingTitle
}: NewMessageEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>New message from {senderName} on leli rentals</Preview>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                brand: "#9333ea",
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
                        <Heading className="text-black text-[22px] font-bold text-center p-0 my-[30px] mx-0">
                            New Message Received
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hello {receiverName},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            You have received a new message from <strong>{senderName}</strong> {listingTitle ? `regarding your listing "${listingTitle}"` : ""}:
                        </Text>
                        <Section className="bg-[#f9f9f9] rounded p-[16px] my-[16px] border border-solid border-[#eeeeee]">
                            <Text className="text-[#333333] italic text-[14px] leading-[24px] m-0">
                                &ldquo;{messageContent}&rdquo;
                            </Text>
                        </Section>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-brand rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={`${baseUrl}/messages`}
                            >
                                Reply Now
                            </Button>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Best regards,<br />
                            The leli rentals Team
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default NewMessageEmail
