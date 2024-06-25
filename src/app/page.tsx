import AuthCheck from "../components/authCheck";
import LoginButton from "../components/ui/loginButton";

export default function HomePage() {
  return (
    <main className="bg-gradient flex min-h-screen flex-col items-center justify-center bg-blue-900 text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Welcome to
          <div className="text-[hsl(280,100%,70%)]">Pickleback Pro</div> App
        </h1>

        <LoginButton />
        <AuthCheck />
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          <div>Dedicated to Sam Youn.</div>
          He&apos;s single and ready to mingle.
        </h1>
        <img src="/samtheman.jpg" alt="He's the man" />
      </div>
    </main>
  );
}
