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

interface MissYouEmailProps {
    userFirstname: string
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ? `https://${process.env.NEXT_PUBLIC_APP_URL}` : ""

export const MissYouEmail = ({ userFirstname }: MissYouEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>We miss you at leli rentals!</Preview>
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
                            We Miss You, {userFirstname}!
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            It&apos;s been a while since we&apos;ve seen you. We&apos;ve added lots of new listings that you might love.
                        </Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-brand rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={`${baseUrl}/categories`}
                            >
                                Browse New Listings
                            </Button>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default MissYouEmail
