import { NextProviderUI } from "@/context/NextUIProvider";
import "./globals.css";
import NextAuthProviders from "@/context/NextAuthProviders";

export const metadata = {
  title: "MuseoMatic",
  description: "Explora la historia y el arte en MUSEOMATIC",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextProviderUI>
          <NextAuthProviders>{children}</NextAuthProviders>
        </NextProviderUI>
      </body>
    </html>
  );
}
