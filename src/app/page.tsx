import Dashboard from "~/components/Dashboard";
import NavBar from "~/components/NavBar";
// import dynamic from "next/dynamic";

// const DynamicDashboard = dynamic(() => import("~/components/Dashboard"), {
//   ssr: false,
// });
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-green-900 text-white">
      <NavBar />

      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="hero-banner mb-24 w-full bg-green-900 px-4 py-12 text-center md:mb-80 ">
          <img
            src="/PicklebackPro.png"
            alt="PICKLEBACK Pro Logo"
            className="mx-auto mb-6 h-auto max-w-full"
          />
          <h1 className="text-5xl font-extrabold tracking-wide text-white sm:text-[5rem]">
            <div className="text-green-200">PICKLEBACK Pro</div>
          </h1>
          <div className="text-base font-extrabold tracking-tight text-green-200">
            BETA - Last updated ...idk man
          </div>
        </div>
        <Dashboard />
        {/* <DynamicDashboard /> */}
      </div>
      <div className="hero-banner w-full bg-blue-800 px-4 py-12 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          <div className="group relative inline-block w-full">
            Dedicated to Sam Youn.
            <div className="absolute left-1/2 top-full hidden translate-x-1/2 transform group-hover:block">
              <img
                src="/samtheman.jpg"
                alt="He's the man"
                className="h-64 w-64 object-cover"
              />
            </div>
          </div>
          He&apos;s single and ready to mingle.
        </h1>
      </div>
    </main>
  );
}
