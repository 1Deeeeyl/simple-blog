import { useState } from "react";
import supabase from "../../utils/supabase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/auth/authSlice";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // ✅ For validation
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validate = () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return false;
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email.");
      return false;
    }

    
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    setError(""); 
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    const { data, error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (supabaseError) {
      setError(supabaseError.message);
      return;
    }

    if (data.user) {
      dispatch(setUser(data.user));
    }

    navigate("/", { replace: true });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 mt-15 max-w-full px-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg w-full">
        {error && <p className="text-red-600">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded-md focus:outline-none focus:border-pink-600 w-full"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded-md focus:outline-none focus:border-pink-600 w-full"
        />

        <button
          type="submit"
          className="p-1.5 rounded-md font-medium text-white inline-flex items-center justify-center bg-green-600 hover:bg-green-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
