import { Inter } from "next/font/google";

import "@/styles/globals.css";

import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "CarriletGO L'Escala Navigator – Train Maps & Schedules",
    description:
        "Explore L'Escala with CarriletGO! Your interactive guide for the tourist train. View live routes, all stops from Riells to Montgó, and up-to-date schedules.",
    metadataBase: new URL("https://carrilet-go.com/"),

    openGraph: {
        type: "website",
        images: [
            {
                url: "/opengraph-image.png",
                width: 1200,
                height: 628
            }
        ]
    },

    twitter: {
        card: "summary_large_image"
    }
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <html lang="en">
                <body className={inter.className}>{children}</body>
            </html>
        </>
    );
}
