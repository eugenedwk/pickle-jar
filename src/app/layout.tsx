import "~/styles/globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Pickleback Pro",
  description: "Track your matches, flex your rank.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
