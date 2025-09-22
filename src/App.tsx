import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import type { Session } from "@supabase/supabase-js";

export const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  if (!session) return <Login />;

  return <Dashboard />;
};
