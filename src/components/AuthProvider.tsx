"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { StudyModeValue, WeekDayValue } from "@/lib/study-schedule";

// Shape matches the ActiveUserProfile interface from your auth-storage, 
// so the UI doesn't break when we transition.
export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name: string;
  school?: string;
  department?: string;
  indexNumber?: string;
  programme?: string;
  level?: string;
  studyMode?: StudyModeValue;
  customStudyDays?: WeekDayValue[];
  avatarUrl?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient()

    if (!supabase) {
      setIsLoading(false)
      return
    }

    const fetchUser = async () => {
      try {
        const {
          data: { user: sessionUser },
        } = await supabase.auth.getUser();

        if (sessionUser) {
          setUser({
            id: sessionUser.id,
            email: sessionUser.email!,
            ...sessionUser.user_metadata,
          } as AuthUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    // Listen for state changes automatically
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: string, session: any) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            ...session.user.user_metadata,
          } as AuthUser);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
