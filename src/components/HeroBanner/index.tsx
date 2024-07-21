import React from "react";

const HeroBanner: React.FC = () => {
  const slogans = [
    "Nova's next best alternative to dating apps.",
    "Guaranteed to improve your game...somehow",
    "Sam Youn is single.",
    "We're not really sure what we're doing",
    "Straight facts, no chaser.",
  ];

  const randomSlogan = slogans[Math.floor(Math.random() * slogans.length)];

  return (
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
        {randomSlogan}
      </div>
    </div>
  );
};

export default HeroBanner;
