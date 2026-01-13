import { RegisterButton, SignOutButton } from "../buttons/Button";

export default function Navbar() {
  return (
    <nav>
      <div>HOME</div>
      <ul>
        <li>
          <button>sign in</button>
        </li>
        <li>
          <RegisterButton/>
        </li>
        <li>
          <SignOutButton />
        </li>
      </ul>
    </nav>
  );
}
