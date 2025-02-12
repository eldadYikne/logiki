import { User } from "firebase/auth";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router";
import MenuIcon from "@rsuite/icons/Menu";
import Menu from "./Menu";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

export default function Navbar({ setIsMenuOpen, user, isMenuOpen }: Props) {
  const navigat = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.length;

  return (
    <div className="h-16 sticky  z-30 overflow-hidden cursor-pointer shadow-md shadow-blue-50 justify-between items-center flex sm:p-4 px-4 sm:px-6">
      {user && (
        <MenuIcon
          className="sm:hidden"
          onClick={() => setIsMenuOpen((prev: boolean) => !prev)}
          style={{ fontSize: "25px" }}
        />
      )}
      {user && (
        <Menu
          isMenuOpen={isMenuOpen}
          onCloseMenu={() => setIsMenuOpen(false)}
        />
      )}
      <div className="flex gap-5 items-center justify-center">
        {user && (
          <div className="relative">
            <img
              className="w-7 h-7"
              style={{ fontSize: "20px" }}
              onClick={() => navigat("/cart")}
              src="https://cdn-icons-png.flaticon.com/512/3144/3144456.png"
            />
            {cartItemCount > 0 && (
              <span className="absolute top-[-8px] right-[-13px] bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
        )}

        {true && (
          <span
            onClick={() =>
              user ? navigat("/soldiers") : navigat("/soldier-profile")
            }
            className=" font-mono  flex items-center justify-center"
          >
            <span>
              <img className="h-8" src={Logo} />
            </span>
            {/* <span className="sm:text-2xl text-md">יחידת חפ״ק מאו״ג 162</span> */}
          </span>
        )}
      </div>
    </div>
  );
}
interface Props {
  user?: User;
  setUser: Function;
  isMenuOpen: boolean;
  setIsMenuOpen: Function;
}
