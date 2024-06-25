import "~/styles/globals.css";
import { Providers } from "./providers";

import { GeistSans } from "geist/font/sans";

export const metadata = {
  title: "Pickleback Pro",
  description: "I still have never played before",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
