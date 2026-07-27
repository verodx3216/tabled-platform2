import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tabled.club"),
  title: "Tabled — Your membership never disappears. It becomes dates.",
  description:
    "ID-verified members, curated introductions, real tables at the city's best venues — and a membership fee that converts into Date Credits you keep.",
  openGraph: {
    url: "https://tabled.club",
    siteName: "Tabled",
    title: "Tabled",
    description:
      "Curated introductions. Real tables. A membership fee that becomes your dates. Applications open.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
