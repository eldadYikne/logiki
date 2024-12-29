import { User } from "firebase/auth";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router";
import MenuIcon from "@rsuite/icons/Menu";
import { useState } from "react";
import Menu from "./Menu";

export default function Navbar(props: Props) {
  const navigat = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  return (
    <div className="h-16 sticky  z-30 overflow-x-hidden cursor-pointer shadow-md shadow-blue-50 justify-between items-center flex sm:p-4 px-4 sm:px-6">
      <MenuIcon
        onClick={() => setIsMenuOpen((prev) => !prev)}
        style={{ fontSize: "25px" }}
      />
      <div className="flex gap-2 items-center justify-center">
        {props.user && props.user?.email && (
          <span className="flex gap-3">
            <div
              onClick={() => {
                navigat("/personal-area");
              }}
              className=" rounded-full p-1 w-8 h-8 flex justify-center items-center"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/1144/1144760.png"
                alt=""
              />
            </div>
          </span>
        )}
        <span
          onClick={() => navigat("/")}
          className=" font-mono  flex items-center justify-center"
        >
          {" "}
          <span>
            <img className="h-8" src={Logo} />
          </span>
          {/* <span className="sm:text-2xl text-md">יחידת חפ״ק מאו״ג 162</span> */}
        </span>
      </div>

      <Menu isMenuOpen={isMenuOpen} onCloseMenu={() => setIsMenuOpen(false)} />
    </div>
  );
}
interface Props {
  user?: User;
  setUser: Function;
}
