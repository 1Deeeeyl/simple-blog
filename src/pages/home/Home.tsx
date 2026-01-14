import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import supabase from "../../utils/supabase";
import Unauthenticated from "./unauthenticated/Unauthenticated";
import Authenticated from "./authenticated/Authenticated";
import Navbar from "../../components/navbar/Navbar";
import { clearUser, setUser } from "../../features/auth/authSlice";
import { useEffect } from "react";

export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {

    //to check if signed in
    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error.message);
        return;
      }
      dispatch(setUser(data.session?.user ?? null));
    }

    checkSession();

    // authchanges to update ui realtime
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        dispatch(setUser(session?.user ?? null));
      }
    );

    //unmount for optimization
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error.message);
      return;
    }
    dispatch(clearUser());
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <Navbar isAuthenticated={!!user} onSignOut={handleSignOut} />
      {!user ? <Unauthenticated /> : <Authenticated />}
    </div>
  );
}
