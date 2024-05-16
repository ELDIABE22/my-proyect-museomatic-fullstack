import "./globals.css";

import NextAuthProviders from "@/context/NextAuthProviders";
import { Toaster } from "react-hot-toast";
import { NextProviderUI } from "@/context/NextUIProvider";
import { MuseumProvider } from "@/context/MuseumContext";

export const metadata = {
  title: "MuseoMatic",
  description: "Explora la historia y vive el arte en MUSEOMATIC",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MuseumProvider>
          <NextProviderUI>
            <NextAuthProviders>{children}</NextAuthProviders>
            <Toaster />
          </NextProviderUI>
        </MuseumProvider>
      </body>
    </html>
  );
}
