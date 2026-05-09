import { createContext, useContext, type ReactNode } from "react";
import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  role: string;
  studentRole: string;
  bio?: string | null;
  avatarUrl?: string | null;
  level: number;
  xp: number;
};

interface AuthCtx {
  user: AuthUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  refresh: () => void;
}

const Ctx = createContext<AuthCtx>({ user: null, isLoading: true, isAdmin: false, refresh: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useGetMe();
  const qc = useQueryClient();
  const user = (data?.user ?? null) as AuthUser | null;
  return (
    <Ctx.Provider
      value={{
        user,
        isLoading,
        isAdmin: user?.role === "admin",
        refresh: () => qc.invalidateQueries({ queryKey: getGetMeQueryKey() }),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}
