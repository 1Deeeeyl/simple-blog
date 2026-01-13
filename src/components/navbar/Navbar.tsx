import Button from "../buttons/Button";
import { Link } from "react-router-dom";

type NavbarProps = {
  isAuthenticated: boolean;
  onSignOut: () => void;
};

export default function Navbar({ isAuthenticated, onSignOut }: NavbarProps) {
  return (
    <section className="w-full flex justify-center  border-b border-slate-300">
      <nav className=" w-full flex justify-between max-w-7xl py-4">
        <div className="flex gap-4">
          <Link className="text-2xl font-medium" to="/">
            Home
          </Link>
          {isAuthenticated && (
            <Link className="text-2xl font-medium" to="/blogs">
              Your Blogs
            </Link>
          )}
        </div>

        <ul className="flex gap-4">
          {!isAuthenticated && (
            <>
              <li>
                <Button to="/signup">Sign Up</Button>
              </li>
              <li>
                <Button to="/signin">Sign In</Button>
              </li>
            </>
          )}

          {isAuthenticated && (
            <li>
              <Button onClick={onSignOut} variant="danger">
                Sign Out
              </Button>
            </li>
          )}
        </ul>
      </nav>
    </section>
  );
}
