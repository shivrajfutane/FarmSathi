import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, type LoginCredentials, type RegisterData } from "@/services/auth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mockUser } from "@/mock/data";
import type { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: (role?: UserRole) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRoleDemo: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isSupabaseConfigured() && supabase) {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            const sUser = data.session.user;
            const meta = sUser.user_metadata || {};
            const role = (meta.role as UserRole) || (localStorage.getItem("agrimarket_oauth_role") as UserRole) || "farmer";

            const loggedInUser: User = {
              id: sUser.id,
              email: sUser.email || "",
              phone: meta.phone || "9876543210",
              role,
              fullName: meta.full_name || meta.name || sUser.email?.split("@")[0] || "User",
              profilePhoto: meta.avatar_url || meta.picture,
              isVerified: true,
              createdAt: sUser.created_at,
            };
            setUser(loggedInUser);
            localStorage.setItem("agrimarket_user", JSON.stringify(loggedInUser));
            setIsLoading(false);
            return;
          }
        }

        const storedUser = localStorage.getItem("agrimarket_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(mockUser.farmer);
          localStorage.setItem("agrimarket_user", JSON.stringify(mockUser.farmer));
        }
      } catch (e) {
        console.error("Auth init error:", e);
        setUser(mockUser.farmer);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Supabase Real-time auth listener
    if (isSupabaseConfigured() && supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === "SIGNED_IN" && session?.user) {
            const meta = session.user.user_metadata || {};
            const role = (meta.role as UserRole) || (localStorage.getItem("agrimarket_oauth_role") as UserRole) || "farmer";
            const updatedUser: User = {
              id: session.user.id,
              email: session.user.email || "",
              phone: meta.phone || "9876543210",
              role,
              fullName: meta.full_name || meta.name || session.user.email?.split("@")[0] || "User",
              profilePhoto: meta.avatar_url,
              isVerified: true,
              createdAt: session.user.created_at,
            };
            setUser(updatedUser);
            localStorage.setItem("agrimarket_user", JSON.stringify(updatedUser));
            localStorage.setItem("agrimarket_token", session.access_token);
          } else if (event === "SIGNED_OUT") {
            setUser(null);
            localStorage.removeItem("agrimarket_user");
            localStorage.removeItem("agrimarket_token");
          }
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const { user: loggedInUser, token } = await authService.login(credentials);
      setUser(loggedInUser);
      localStorage.setItem("agrimarket_user", JSON.stringify(loggedInUser));
      localStorage.setItem("agrimarket_token", token);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (intendedRole: UserRole = "farmer") => {
    setIsLoading(true);
    try {
      await authService.signInWithGoogle(intendedRole);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const { user: registeredUser, token } = await authService.register(data);
      setUser(registeredUser);
      localStorage.setItem("agrimarket_user", JSON.stringify(registeredUser));
      localStorage.setItem("agrimarket_token", token);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await authService.resetPassword(email);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const switchRoleDemo = (targetRole: UserRole) => {
    const newUser = mockUser[targetRole];
    setUser(newUser);
    localStorage.setItem("agrimarket_user", JSON.stringify(newUser));
  };

  const role: UserRole = user?.role || "farmer";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        login,
        loginWithGoogle,
        register,
        resetPassword,
        logout,
        switchRoleDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
