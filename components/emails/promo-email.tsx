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

interface PromoEmailProps {
    userFirstname: string
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ? `https://${process.env.NEXT_PUBLIC_APP_URL}` : ""

export const FestivePromoEmail = ({ userFirstname }: PromoEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Festive Season Mega Sale - Up to 30% OFF!</Preview>
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
                        <Section className="mt-8 text-center bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 text-white">
                            <Heading className="text-white text-[32px] font-bold p-0 my-0">
                                MEGA SALE
                            </Heading>
                            <Text className="text-white text-[18px] mt-2 mb-0">
                                Festive Season Special
                            </Text>
                        </Section>
                        <Heading className="text-brand text-[24px] font-bold text-center p-0 my-[30px] mx-0">
                            Up to 30% OFF!
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hi {userFirstname},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Celebrate with our Festive Season Mega Sale! Get amazing discounts on selected rentals this festive season. Whether you need a car for your road trip or a camera for your memories, we&apos;ve got you covered.
                        </Text>
                        <Text className="text-black text-[14px] font-semibold text-center text-red-500">
                            Limited Time Offer!
                        </Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-brand rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={`${baseUrl}/deals`}
                            >
                                Shop Deals
                            </Button>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default FestivePromoEmail
