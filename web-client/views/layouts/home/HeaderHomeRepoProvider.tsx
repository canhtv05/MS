import { getInfoRepo, GitHubRepo } from "@/lib/utils";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface ReposContextType {
  repos: { lib: GitHubRepo | null; me: GitHubRepo | null };
  setRepos: React.Dispatch<React.SetStateAction<{ lib: GitHubRepo | null; me: GitHubRepo | null }>>;
}

const ReposContext = createContext<ReposContextType | undefined>(undefined);

export const ReposProvider = ({ children }: { children: ReactNode }) => {
  const [repos, setRepos] = useState<{ lib: GitHubRepo | null; me: GitHubRepo | null }>({
    lib: null,
    me: null,
  });

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

  return <ReposContext.Provider value={{ repos, setRepos }}>{children}</ReposContext.Provider>;
};

export const useHeaderHomeRepo = () => {
  const context = useContext(ReposContext);
  if (!context) {
    throw new Error("useHeaderHomeRepo must be used within a HeaderHomeRepoProvider");
  }
  return context;
};
