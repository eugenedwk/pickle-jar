import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { env } from "~/env";

type UserContextType = {
  isAuthenticated: boolean;
  hasPlayerProfile: boolean;
  playerData: string[] | null; // Replace 'any' with a proper type for your player data
  setHasPlayerProfile: (value: boolean) => void;
  setPlayerData: (data: string[]) => void; // Replace 'any' with a proper type
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPlayerProfile, setHasPlayerProfile] = useState(false);
  const [playerData, setPlayerData] = useState<string[] | null>(null);

  useEffect(() => {
    setIsAuthenticated(status === "authenticated");
  }, [status]);

  useEffect(() => {
    if (isAuthenticated) {
      void checkPlayerProfile();
    }
  }, [isAuthenticated]);

  const checkPlayerProfile = async () => {
    try {
      const response = await fetch("/api/players/check");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      setHasPlayerProfile(data.hasProfile);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (data.hasProfile) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
        setPlayerData(data.playerData);
      }
    } catch (error) {
      console.error("Error checking player profile:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        hasPlayerProfile,
        playerData,
        setHasPlayerProfile,
        setPlayerData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
