import { Html, Head, Preview, Body, Container, Heading, Text, Button, Img } from "@react-email/components";
import * as React from "react";

interface ResetPasswordEmailProps {
    userFirstname?: string;
    resetLink?: string;
}

export default function ResetPasswordEmail({
    userFirstname = "Friend",
    resetLink = "https://leli.rentals/reset-password?token=TOKEN",
}: ResetPasswordEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>{userFirstname}, reset your password</Preview>
            <Body style={bodyStyle}>
                <Container style={containerStyle}>
                    <Img src="https://leli.rentals/logo.png" alt="Leli Rentals" width="150" height="40" style={logoStyle} />
                    <Heading style={headingStyle}>Reset your password</Heading>
                    <Text style={textStyle}>
                        Hi {userFirstname}, click the button below to set a new password for your Leli Rentals account.
                    </Text>
                    <Button href={resetLink} style={buttonStyle}>Reset Password</Button>
                    <Text style={footerStyle}>If you didn’t request a password reset, you can safely ignore this email.</Text>
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

const logoStyle: React.CSSProperties = { display: "block", margin: "0 auto 20px" };
const headingStyle: React.CSSProperties = { fontSize: "24px", fontWeight: 600, color: "#111827", textAlign: "center", marginBottom: "16px" };
const textStyle: React.CSSProperties = { fontSize: "16px", color: "#4b5563", lineHeight: 1.5, marginBottom: "24px", textAlign: "center" };
const buttonStyle: React.CSSProperties = { backgroundColor: "#ef4444", color: "#ffffff", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", display: "inline-block", fontWeight: 600, fontSize: "16px", margin: "0 auto", textAlign: "center" };
const footerStyle: React.CSSProperties = { fontSize: "12px", color: "#9ca3af", textAlign: "center", marginTop: "30px" };
