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

interface NewListingEmailProps {
    userFirstname: string
    listingTitle: string
    listingUrl: string
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ""

export const NewListingEmail = ({ userFirstname, listingTitle, listingUrl }: NewListingEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Your listing "{listingTitle}" has been created!</Preview>
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
                            Listing Created Successfully!
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hi {userFirstname},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Congratulations! You have successfully created a new listing: <strong>{listingTitle}</strong>.
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            It is currently being reviewed by our team and will be live shortly. You can view or edit your listing from your dashboard.
                        </Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-brand rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={listingUrl}
                            >
                                View Listing
                            </Button>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default NewListingEmail
