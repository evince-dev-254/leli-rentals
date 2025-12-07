export const CANCELLATION_POLICIES = [
    {
        id: "flexible",
        label: "Flexible",
        description: "Guests can cancel until 24 hours before check-in for a full refund.",
        details: "Full refund 1 day prior to arrival",
        color: "bg-green-100 text-green-800",
    },
    {
        id: "moderate",
        label: "Moderate",
        description: "Guests can cancel until 5 days before check-in for a full refund.",
        details: "Full refund 5 days prior to arrival",
        color: "bg-yellow-100 text-yellow-800",
    },
    {
        id: "strict",
        label: "Strict",
        description: "Guests can cancel until 7 days before check-in for a 50% refund.",
        details: "50% refund up to 7 days prior",
        color: "bg-orange-100 text-orange-800",
    },
    {
        id: "super_strict",
        label: "Super Strict",
        description: "Guests get a 50% refund if they cancel at least 30 days before check-in.",
        details: "50% refund up to 30 days prior",
        color: "bg-red-100 text-red-800",
    },
];
