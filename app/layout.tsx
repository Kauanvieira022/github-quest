import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "GitHub Quest — Aprenda Git na prática",
  description:
    "Uma jornada interativa para aprender Git e GitHub por meio de pequenas missões.",
  openGraph: {
    title: "GitHub Quest",
    description: "Aprenda Git construindo com Git.",
    locale: "pt_BR",
    type: "website",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GitHub Quest",
    description: "Aprenda Git construindo com Git.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
