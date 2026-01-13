import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import type { User } from "@supabase/supabase-js";
import Unauthenticated from "./unauthenticated/Unauthenticated";
import Authenticated from "./authenticated/Authenticated";
import Navbar from "../../components/navbar/Navbar";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error.message);
        return;
      }

      setUser(data.session?.user ?? null);
    }

    checkAuth();
  }, []);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error.message);
      return;
    }

    setUser(null);
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <Navbar isAuthenticated={!!user} onSignOut={handleSignOut} />
      {!user ? <Unauthenticated /> : <Authenticated />}
    </div>
  );
}



// conditional rendering done for nav, next step is redux