import GoogleAuth from "./GoogleAuth";
import Logo from "../assets/logo.png";

function Login(props: Props) {
  return (
    <div className="min-h-screen  flex items-center justify-center font-['Nachlieli'] bg-gradient-to-r from-blue-800 via-blue-900 to-black">
      <div className="bg-white mx-3  p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          ברוכים הבאים
        </h2>
        <div className="w-full flex justify-center items-center">
          <img className="h-32 " src={Logo} />
        </div>
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
          ליחידת חפ״ק מאו״ג 162
        </h2>
        <p className="text-center text-xl text-gray-600 mb-6"></p>
        <div className="flex flex-col items-center">
          <GoogleAuth
            setUser={props.setConnectedUser}
            userConnected={props.userConnected}
          />
        </div>
      </div>
    </div>
  );
}

export default Login;

Login.defaultProps = {
  setConnectedUser: () => {},
  userConnected: "",
};

interface Props {
  setConnectedUser: Function;
  userConnected: string;
}
