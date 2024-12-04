import { User } from "firebase/auth";
import GoogleAuth from "./GoogleAuth";
import Logo from "../assets/logo.png";
export default function Navbar(props: Props) {
  return (
    <div className="h-16 bg-blue-950 shadow-md shadow-blue-50 justify-between items-center flex p-4 px-6">
      <span className="text-white font-mono  flex items-center justify-center">
        {" "}
        <span>
          <img className="h-12" src={Logo} />
        </span>
        <span className="sm:text-2xl text-md">יחידת חפ״ק מאו״ג 162</span>
      </span>
      <span>
        <GoogleAuth
          setUser={props.setUser}
          userConnected={props.user?.displayName ?? ""}
        />
      </span>
    </div>
  );
}
interface Props {
  user: User;
  setUser: Function;
}
