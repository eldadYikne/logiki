import { User } from "firebase/auth";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router";

export default function Navbar(props: Props) {
  const navigat = useNavigate();
  return (
    <div className="h-16 sticky z-50  cursor-pointer shadow-md shadow-blue-50 justify-between items-center flex sm:p-4 px-1 sm:px-6">
      <span
        onClick={() => navigat("/")}
        className=" font-mono  flex items-center justify-center"
      >
        {" "}
        <span>
          <img className="h-12" src={Logo} />
        </span>
        <span className="sm:text-2xl text-md">יחידת חפ״ק מאו״ג 162</span>
      </span>

      {props.user && props.user?.email && (
        <span className="flex gap-3">
          {/* {props.user.email === "hapakmaog162@gmail.com" && (
            <Button
              onClick={() => {
                navigat("/admin");
              }}
            >
              איזור מנהל
            </Button>
          )} */}
          {/* <span onClick={() => navigat("/")}>
            <GoogleAuth
              setUser={props.setUser}
              userConnected={props.user?.displayName ?? ""}
            />
          </span> */}
          <div
            onClick={() => {
              navigat("/personal-area");
            }}
            className=" rounded-full p-1 w-8 h-8 flex justify-center items-center"
          >
            {/* <AdminIcon /> */}
            <img
              src="https://cdn-icons-png.flaticon.com/128/1144/1144760.png"
              alt=""
            />
          </div>
        </span>
      )}
    </div>
  );
}
interface Props {
  user?: User;
  setUser: Function;
}
