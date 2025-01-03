import { headers } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import Dashboard from "~/components/Dashboard";
import HeroBanner from "~/components/HeroBanner";
import NavBar from "~/components/NavBar";
import { BrowserWarning } from "~/components/BrowserWarning";
import { isInAppBrowser } from "~/lib/browserDetection";
import { Mailbox } from "lucide-react";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const headersList = headers();
  const userAgent = headersList.get("user-agent") ?? "";
  const isUnsafeBrowser = isInAppBrowser(userAgent);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-white md:bg-green-900">
      <NavBar />

      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        {session ? <Dashboard /> : <HeroBanner />}
        <BrowserWarning isOpen={isUnsafeBrowser} />
      </div>
      <div className="hero-banner w-full bg-green-800 px-4 py-12 text-center">
        <div className="group relative inline-flex items-center gap-2">
          <Mailbox className="h-4 w-4 cursor-pointer text-white" />
          <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 transform rounded-md bg-green-900 p-4 shadow-lg group-hover:block">
            <h1 className="text-xs font-extrabold tracking-tight text-white">
              <div className="relative inline-block">
                Dedicated to Sam Youn.
                <div className="absolute left-1/2 top-full hidden -translate-y-16 translate-x-1/2 transform group-hover:block">
                  <img
                    src="/samtheman.jpg"
                    alt="He's the man"
                    className="h-32 w-32 object-cover"
                  />
                </div>
              </div>
              <div>He&apos;s single and ready to mingle.</div>
            </h1>
          </div>
        </div>
      </div>
    </main>
  );
}
