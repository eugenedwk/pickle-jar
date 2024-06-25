/* eslint-disable prefer-const */
import React from "react";

interface ProfilePickleProps {
  username: string | undefined;
  size?: number;
}

const ProfilePickle: React.FC<ProfilePickleProps> = ({
  username,
  size = 150,
}) => {
  const seedText = username ?? "Pickle";

  const getColorScheme = (
    text: string,
  ): [string, string, string, string, string] => {
    const totalChars = text.length;
    const isEven = totalChars % 2 === 0;
    const charSum = text
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);

    let h, s, l;

    if (isEven) {
      // Cool tones for even number of characters
      h = (charSum % 60) + 180; // 180-240 range (cyan to blue)
    } else {
      // Warm tones for odd number of characters
      h = charSum % 60; // 0-60 range (red to yellow)
    }

    s = 70 + (charSum % 30); // 70-100% saturation
    l = 45 + (charSum % 20); // 45-65% lightness

    const baseColor = `hsl(${h}, ${s}%, ${l}%)`;
    const lightColor = `hsl(${h}, ${s}%, ${Math.min(l + 15, 90)}%)`;
    const darkColor = `hsl(${h}, ${s}%, ${Math.max(l - 15, 10)}%)`;

    // Complementary color (opposite on the color wheel)
    const complementaryH = (h + 180) % 360;
    const complementaryColor = `hsl(${complementaryH}, ${s}%, ${l}%)`;

    // Border color (complementary to the pickle color)
    const borderH = (complementaryH + 180) % 360;
    const borderColor = `hsl(${borderH}, ${s}%, ${Math.max(l - 10, 80)}%)`;

    return [baseColor, lightColor, darkColor, complementaryColor, borderColor];
  };

  const [baseColor, lightColor, darkColor, complementaryColor, borderColor] =
    getColorScheme(seedText);

  return (
    <div style={{ width: size, height: size }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 1200"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient
            id={`grad-${username}`}
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <stop
              offset="0%"
              style={{ stopColor: lightColor, stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: darkColor, stopOpacity: 1 }}
            />
          </radialGradient>
        </defs>
        <circle
          cx="600"
          cy="600"
          r="580"
          fill={`url(#grad-${username})`}
          stroke={borderColor}
          strokeWidth="40"
        />
        <g fill={complementaryColor} transform="scale(0.8) translate(120, 120)">
          <path d="m807.96 627.16 28.496-35.273c10.055-12.445 30.652-12.48 40.738-4.3281 12.445 10.055 14.383 28.297 4.3281 40.738l-28.496 35.273c-10.055 12.445-30.652 12.48-40.738 4.3281-12.445-10.055-14.383-28.297-4.3281-40.738z" />
          <path d="m337.87 809.28-0.52344-0.88281v-0.003907c-3.7539-6.4297-4.8555-14.066-3.0742-21.297 1.7852-7.2266 6.3086-13.477 12.621-17.43 203.97-130.9 359.61-360.93 406.04-434.37 3.9297-6.2031 10.113-10.637 17.25-12.367 7.1367-1.7305 14.664-0.625 21.004 3.082l0.98047 0.56641-0.003906 0.003906c6.6719 3.8555 11.492 10.258 13.355 17.734 1.8633 7.4766 0.60937 15.391-3.4727 21.93-48.734 77.703-208.45 314.48-424.76 452.77-6.4922 4.0469-14.344 5.2969-21.77 3.4609-7.4258-1.832-13.797-6.5938-17.652-13.199z" />
          <path d="m278.34 1055.1c-1.168-7.2188 0.44922-14.609 4.5273-20.676 4.0742-6.0703 10.309-10.363 17.43-12.008 199.63-46.316 380.07-245.31 435.39-311.32 4.7812-5.6914 11.578-9.3203 18.965-10.121 7.3906-0.80469 14.805 1.2734 20.699 5.8047l0.12109 0.089844c6.2695 4.7695 10.328 11.891 11.23 19.719 0.90234 7.8281-1.4258 15.684-6.4492 21.758-59.137 71.113-247.98 279.71-466.75 330.49-7.8359 1.793-16.066 0.25781-22.734-4.2383-6.6641-4.5-11.168-11.559-12.438-19.496z" />
          <path d="m1152.7 266.02c-14.742-39.332-38.66-74.574-69.77-102.79l49.508-123.45c3.8516-9.6094 2.2852-20.543-4.1094-28.688-6.3945-8.1406-16.645-12.25-26.895-10.785-10.246 1.4688-18.934 8.293-22.789 17.902l-43.965 109.64c-34.535-20.102-73.195-32.07-113.04-35.008-157.62-10.992-251.82 125.7-314.13 216.09-87.68 124.02-193.84 233.87-314.78 325.75-19.805 15.52-41.125 30.488-61.738 44.973-26.371 18.52-53.633 37.672-78.797 58.625h-0.015625c-59.461 49.527-94.035 98.422-112.11 158.53-9.3047 29.816-12.527 61.195-9.4766 92.281 3.0469 31.086 12.309 61.246 27.23 88.684 14.723 26.688 34.652 50.145 58.613 68.984 23.957 18.84 51.457 32.672 80.863 40.684 31.238 8.5508 63.5 12.777 95.887 12.562 75.883-0.91406 150.52-19.457 218-54.168 87.598-44.434 159.41-108.08 228.84-169.64 11.305-10 22.645-20.004 34.023-30.004 84.609-70.859 161.85-150.08 230.55-236.45l3.8047-4.9648c92-120.36 206.5-270.16 144.3-438.76zm-190.35 403.57-3.793 4.9805c-66.395 83.262-140.99 159.64-222.66 227.99-11.5 10.059-22.938 20.148-34.305 30.273-69.773 61.836-135.68 120.25-216.64 161.33-90.512 45.906-192.21 59.969-271.96 37.488h-0.003906c-21.988-5.9453-42.559-16.25-60.492-30.301-17.93-14.047-32.859-31.555-43.895-51.48-11.191-20.703-18.113-43.441-20.359-66.867-2.2422-23.426 0.24219-47.062 7.3008-69.512 14.613-48.566 43.516-88.887 93.711-130.69 23.355-19.438 48.469-37.066 75.051-55.738 21.219-14.91 43.164-30.332 64.156-46.77h-0.003906c125.57-95.477 235.76-209.63 326.75-338.48 72.59-105.3 147.17-199.18 262.44-191.18 39.758 3.4609 77.754 17.98 109.69 41.914 31.934 23.938 56.531 56.332 71.012 93.52 51.152 138.68-48.27 268.76-136 383.52z" />
        </g>
      </svg>
    </div>
  );
};

export default ProfilePickle;
