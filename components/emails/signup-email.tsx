import { Html, Head, Preview, Body, Container, Heading, Text, Button, Img } from "@react-email/components";
import * as React from "react";

interface SignUpEmailProps {
    userFirstname?: string;
    signupLink?: string;
}

export default function SignUpEmail({ userFirstname = "Friend", signupLink = "https://leli.rentals/signup" }: SignUpEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Welcome to Leli Rentals, {userFirstname}!</Preview>
            <Body style={bodyStyle}>
                <Container style={containerStyle}>
                    <Img src="https://leli.rentals/logo.png" alt="Leli Rentals" width="150" height="40" style={logoStyle} />
                    <Heading style={headingStyle}>Welcome, {userFirstname}!</Heading>
                    <Text style={textStyle}>
                        Thank you for joining Leli Rentals. Your account is ready and you can start exploring amazing rentals across Kenya.
                    </Text>
                    <Button href={signupLink} style={buttonStyle}>
                        Get Started
                    </Button>
                    <Text style={footerStyle}>If you have any questions, feel free to reply to this email.</Text>
                </Container>
            </Body>
        </Html>
    );
}

const bodyStyle: React.CSSProperties = {
    fontFamily: "Helvetica, Arial, sans-serif",
    backgroundColor: "#f9fafb",
    padding: "20px",
};

const containerStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "30px",
    maxWidth: "600px",
    margin: "0 auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const logoStyle: React.CSSProperties = {
    display: "block",
    margin: "0 auto 20px",
};

const headingStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: 600,
    color: "#111827",
    textAlign: "center",
    marginBottom: "16px",
};

const textStyle: React.CSSProperties = {
    fontSize: "16px",
    color: "#4b5563",
    lineHeight: 1.5,
    marginBottom: "24px",
    textAlign: "center",
};

const buttonStyle: React.CSSProperties = {
    backgroundColor: "#f97316",
    color: "#ffffff",
    padding: "12px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    display: "inline-block",
    fontWeight: 600,
    fontSize: "16px",
    margin: "0 auto",
    textAlign: "center",
};

const footerStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#9ca3af",
    textAlign: "center",
    marginTop: "30px",
};
