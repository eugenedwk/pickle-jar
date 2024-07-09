"use client";
import Link from "next/link";
import LoginButton from "../ui/loginButton";
import {
  UserCircleIcon,
  ClipboardDocumentCheckIcon,
  TrophyIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";

const TopNavContent = () => (
  <div id="navItems" className="container mx-auto px-4 py-3">
    <div className="flex flex-row items-center justify-between">
      <div>
        <div className="flex items-center space-x-4">
          <div>
            <Link
              href="/"
              className="flex items-center text-white hover:text-green-200"
            >
              <HomeIcon className="mr-1 h-5 w-5" />
              Home
            </Link>
          </div>
          <div>
            <Link
              href="/players"
              className="flex items-center text-white hover:text-green-200"
            >
              <UserCircleIcon className="mr-1 h-5 w-5" />
              Profile
            </Link>
          </div>
          {/* <li>
            <Link
              href="/blog"
              className="flex items-center text-white hover:text-green-200"
            >
              <ClipboardDocumentCheckIcon className="mr-1 h-5 w-5" />
              Blog
            </Link>
          </li> */}
          <div>
            <Link
              href="/ranks"
              className="flex items-center text-white hover:text-green-200"
            >
              <TrophyIcon className="mr-1 h-5 w-5" />
              Rankings
            </Link>
          </div>
        </div>
      </div>
      <div className="flex">
        <LoginButton />
      </div>
    </div>
  </div>
);

const BotNavContent = () => (
  <div id="navItems" className="container mx-auto px-4 py-3">
    <div className="flex flex-row items-center justify-between">
      <div>
        <div className="flex items-center space-x-4">
          {/* <div>
            <Link
              href="/blog"
              className="flex flex-col items-center text-white hover:text-green-200"
            >
              <ClipboardDocumentCheckIcon className="h-5 w-5" />
              <span className="text-xs">Blog</span>
            </Link>
          </div> */}
          <div>
            <Link
              href="/"
              className="flex flex-col items-center text-white hover:text-green-200"
            >
              <HomeIcon className="mr-1 h-5 w-5" />
              <span className="text-xs">Home</span>
            </Link>
          </div>
          <div>
            <Link
              href="/"
              className="flex flex-col items-center text-white hover:text-green-200"
            >
              <UserCircleIcon className="h-5 w-5" />
              <span className="text-xs">Profile</span>
            </Link>
          </div>
          <div>
            <Link
              href="/ranks"
              className="flex flex-col items-center text-white hover:text-green-200"
            >
              <TrophyIcon className="h-5 w-5" />
              <span className="text-xs">Rankings</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex">
        <LoginButton />
      </div>
    </div>
  </div>
);

const TopNavBar = () => {
  return (
    <nav className="fixed top-0 z-[9999] hidden w-full bg-green-800 md:block">
      <TopNavContent />
    </nav>
  );
};

const BottomNavBar = () => (
  <nav className="fixed bottom-0 z-[9999] w-full bg-green-800 md:hidden">
    <BotNavContent />
  </nav>
);

const NavBar = () => {
  return (
    <>
      <TopNavBar />
      <BottomNavBar />
    </>
  );
};

export default NavBar;
