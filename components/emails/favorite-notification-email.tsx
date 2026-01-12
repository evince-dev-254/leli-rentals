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

interface FavoriteNotificationEmailProps {
    ownerFirstname: string
    listingTitle: string
    userFirstname: string
    listingImage?: string
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ? `https://${process.env.NEXT_PUBLIC_APP_URL}` : ""

export const FavoriteNotificationEmail = ({
    ownerFirstname,
    listingTitle,
    userFirstname,
    listingImage,
}: FavoriteNotificationEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>{userFirstname} favorited your listing: {listingTitle}</Preview>
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
                            Someone likes your listing!
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hello {ownerFirstname},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            <strong>{userFirstname}</strong> just added <strong>{listingTitle}</strong> to their favorites. This is a great sign of interest!
                        </Text>
                        {listingImage && (
                            <Section className="my-[20px] text-center">
                                <Img
                                    src={listingImage}
                                    width="300"
                                    className="rounded-lg mx-auto"
                                    alt={listingTitle}
                                />
                            </Section>
                        )}
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-brand rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={`${baseUrl}/dashboard/owner`}
                            >
                                View My Listings
                            </Button>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Keep your listing updated to increase your chances of a successful booking.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default FavoriteNotificationEmail
