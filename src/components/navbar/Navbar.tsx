import { useLocation } from "react-router-dom";
import Button from "../buttons/Button";
import { Link } from "react-router-dom";

type NavbarProps = {
  isAuthenticated: boolean;
  onSignOut: () => void;
};

export default function Navbar({ isAuthenticated, onSignOut }: NavbarProps) {
  const location = useLocation();
  const isOnNewBlog = location.pathname === "/newblog";

  return (
    <section className="w-full flex justify-center border-b border-slate-300 px-4">
      <nav className="w-full flex justify-between max-w-7xl py-4">
        <div className="flex gap-4">
          <Link className="text-2xl font-medium" to="/">
            Home
          </Link>
          {isAuthenticated && (
            <Link className="text-2xl font-medium" to="/yourblogs">
              Your Blogs
            </Link>
          )}
        </div>

        <ul className="flex gap-4">
          {!isAuthenticated && (
            <>
              <li>
                <Button to="/signin">Sign In</Button>
              </li>
              <li>
                <Button to="/signup" variant="secondary">
                  Sign Up
                </Button>
              </li>
            </>
          )}

          {isAuthenticated && (
            <>
              <li>
                <Button to="/newblog" disabled={isOnNewBlog}>
                  Add Blog
                </Button>
              </li>
              <li>
                <Button onClick={onSignOut} variant="danger">
                  Sign Out
                </Button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </section>
  );
}
