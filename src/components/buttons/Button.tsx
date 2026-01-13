import supabase from "../../utils/supabase";

async function handleSignOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error(error.message);
    return;
  }
  // onAuthStateChange
  const refreshPage = () => {
    window.location.reload();
  };
  refreshPage();
  console.log("signed out");
}

export function SignOutButton() {
  return (
    <button
      className="bg-red-600 text-white p-1.5 rounded-md font-medium"
      onClick={handleSignOut}
    >
      Sign Out
    </button>
  );
}

export function RegisterButton() {
  return (
    <button className="bg-blue-600 text-white p-1.5 rounded-md font-medium">
      Register
    </button>
  );
}
