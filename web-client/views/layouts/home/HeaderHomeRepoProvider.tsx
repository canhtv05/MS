import { getInfoRepo, IGitHubRepo } from "@/lib/utils";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";

interface ReposContextType {
  repos: { lib: IGitHubRepo | null; me: IGitHubRepo | null };
  setRepos: React.Dispatch<React.SetStateAction<{ lib: IGitHubRepo | null; me: IGitHubRepo | null }>>;
  showSignup: boolean;
  setShowSignup: Dispatch<SetStateAction<boolean>>;
}

const ReposContext = createContext<ReposContextType | undefined>(undefined);

export const ReposProvider = ({ children }: { children: ReactNode }) => {
  const [showSignup, setShowSignup] = useState(false);
  const [repos, setRepos] = useState<{ lib: IGitHubRepo | null; me: IGitHubRepo | null }>({
    lib: null,
    me: null,
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowSignup(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchRepos() {
      try {
        const [libData, meData] = await Promise.all([
          getInfoRepo("imskyleen", "animate-ui"),
          getInfoRepo("canhtv05", "MS"),
        ]);

        setRepos({
          lib: libData ?? null,
          me: meData ?? null,
        });
      } catch (err) {
        console.error(err);
      }
    }

    fetchRepos();
  }, []);

  return (
    <ReposContext.Provider value={{ repos, setRepos, setShowSignup, showSignup }}>{children}</ReposContext.Provider>
  );
};

export const useHeaderHomeRepo = () => {
  const context = useContext(ReposContext);
  if (!context) {
    throw new Error("useHeaderHomeRepo must be used within a HeaderHomeRepoProvider");
  }
  return context;
};
