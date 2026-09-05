import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { USE_MOCK } from "@/lib/constants";
import { mockUser } from "@/mock/data";
import type { User, UserRole } from "@/types";

export interface LoginCredentials {
  email: string;
  password?: string;
  role?: UserRole;
}

export interface RegisterData {
  email: string;
  password?: string;
  fullName: string;
  phone: string;
  role: UserRole;
  state?: string;
  district?: string;
  village?: string;
  farmName?: string;
  companyName?: string;
  gstNumber?: string;
  landHoldingAcres?: number;
  isFPO?: boolean;
  fpoName?: string;
}

export const authService = {
  /**
   * Email & Password Login
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password || "password123",
      });

      if (!error && data.user) {
        // Fetch or create user profile from Supabase 'profiles' table
        let profile = null;
        try {
          const { data: profData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();
          profile = profData;
        } catch {
          // Profile table might not have this record yet
        }

        const role: UserRole =
          (profile?.role as UserRole) ||
          data.user.user_metadata?.role ||
          credentials.role ||
          "farmer";

        const user: User = {
          id: data.user.id,
          email: data.user.email || credentials.email,
          phone: profile?.phone || data.user.user_metadata?.phone || "9876543210",
          role,
          fullName:
            profile?.full_name ||
            data.user.user_metadata?.full_name ||
            data.user.email?.split("@")[0] ||
            "User",
          profilePhoto: profile?.avatar_url || data.user.user_metadata?.avatar_url,
          isVerified: profile?.is_verified ?? true,
          createdAt: data.user.created_at,
        };

        return { user, token: data.session?.access_token || "supabase_token" };
      }

      // If Supabase returns error and we allow mock fallback
      if (error && USE_MOCK) {
        console.warn("Supabase auth error, falling back to prototype mode:", error.message);
      } else if (error) {
        throw error;
      }
    }

    // Mock fallback based on requested role or email
    await new Promise((r) => setTimeout(r, 300));
    const role: UserRole =
      credentials.role ||
      (credentials.email.includes("buyer")
        ? "buyer"
        : credentials.email.includes("admin")
        ? "admin"
        : "farmer");
    const user = { ...mockUser[role], email: credentials.email || mockUser[role].email };
    return { user, token: `mock_jwt_token_${role}` };
  },

  /**
   * Google OAuth Sign In via Supabase
   */
  async signInWithGoogle(intendedRole: UserRole = "farmer"): Promise<void> {
    // Store intended role in localStorage so callback knows how to configure profile
    localStorage.setItem("agrimarket_oauth_role", intendedRole);

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error("Supabase Google Auth error:", error);
        alert(`Google Login Error: ${error.message}\n\nMake sure ${window.location.origin}/auth/callback is added to your Supabase Redirect URLs.`);
        throw error;
      }
      return;
    } else {
      alert("Supabase is not configured. Please check your .env file.");
    }
  },

  /**
   * Handle OAuth Redirect Callback
   */
  async handleOAuthCallback(): Promise<{ user: User; token: string }> {
    const intendedRole = (localStorage.getItem("agrimarket_oauth_role") as UserRole) || "farmer";

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (data.session && data.session.user) {
        const sUser = data.session.user;
        const metadata = sUser.user_metadata || {};

        // Upsert into Supabase profiles table
        try {
          await supabase.from("profiles").upsert({
            id: sUser.id,
            email: sUser.email,
            full_name: metadata.full_name || metadata.name || sUser.email?.split("@")[0],
            avatar_url: metadata.avatar_url || metadata.picture,
            role: intendedRole,
            is_verified: true,
            updated_at: new Date().toISOString(),
          });
        } catch (e) {
          console.warn("Could not upsert profile:", e);
        }

        const user: User = {
          id: sUser.id,
          email: sUser.email || "user@google.com",
          phone: metadata.phone || "9876543210",
          role: intendedRole,
          fullName: metadata.full_name || metadata.name || "Google User",
          profilePhoto: metadata.avatar_url || metadata.picture,
          isVerified: true,
          createdAt: sUser.created_at || new Date().toISOString(),
        };

        return { user, token: data.session.access_token };
      }
    }

    // Fallback
    const user = { ...mockUser[intendedRole], fullName: "Google Verified User" };
    return { user, token: `mock_jwt_token_${intendedRole}` };
  },

  /**
   * Register with Email & Password
   */
  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    if (isSupabaseConfigured() && supabase) {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password || "password123",
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
            role: data.role,
            state: data.state,
            district: data.district,
          },
        },
      });

      if (!error && authData.user) {
        // Upsert into profiles table
        try {
          await supabase.from("profiles").upsert({
            id: authData.user.id,
            email: data.email,
            full_name: data.fullName,
            phone: data.phone,
            role: data.role,
            state: data.state,
            district: data.district,
            is_verified: false,
            created_at: new Date().toISOString(),
          });
        } catch (e) {
          console.warn("Profile table insert warning:", e);
        }

        const user: User = {
          id: authData.user.id,
          email: data.email,
          phone: data.phone,
          role: data.role,
          fullName: data.fullName,
          isVerified: false,
          createdAt: new Date().toISOString(),
        };

        return { user, token: authData.session?.access_token || "supabase_token" };
      }

      if (error && !USE_MOCK) {
        throw error;
      }
    }

    await new Promise((r) => setTimeout(r, 400));
    const user: User = {
      id: `u_${Date.now()}`,
      email: data.email,
      phone: data.phone,
      role: data.role,
      fullName: data.fullName,
      isVerified: false,
      createdAt: new Date().toISOString(),
    };
    return { user, token: `mock_jwt_token_${data.role}` };
  },

  /**
   * Password Reset via Supabase
   */
  async resetPassword(email: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/forgot-password?reset=true`,
      });
      if (error && !USE_MOCK) throw error;
    }
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn("Supabase signOut error:", e);
      }
    }
    localStorage.removeItem("agrimarket_user");
    localStorage.removeItem("agrimarket_token");
    localStorage.removeItem("agrimarket_oauth_role");
  },

  async getCurrentUser(): Promise<User | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const sUser = data.session.user;
        const metadata = sUser.user_metadata || {};
        const role = (metadata.role as UserRole) || "farmer";

        return {
          id: sUser.id,
          email: sUser.email || "",
          phone: metadata.phone || "9876543210",
          role,
          fullName: metadata.full_name || metadata.name || sUser.email?.split("@")[0] || "User",
          profilePhoto: metadata.avatar_url,
          isVerified: true,
          createdAt: sUser.created_at,
        };
      }
    }

    const cached = localStorage.getItem("agrimarket_user");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return mockUser.farmer;
  },
};
