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

  return (
    <div>
      <Navbar />
      {!user ? <Unauthenticated /> : <Authenticated />}
    </div>
  );
}
