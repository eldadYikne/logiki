import GoogleAuth from "./GoogleAuth";
import Logo from "../assets/logo.png";

function Login({ setConnectedUser = () => {}, userConnected = "" }: Props) {
  return (
    <div className="p-10  w-full flex items-center justify-center font-['Nachlieli'] bg-gradient-to-r from-slate-100 via-black-500 to-slate-800">
      <div className="bg-white mx-3  p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="w-full flex justify-center items-center">
          <img className="h-32 " src={Logo} />
        </div>
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Logiki
        </h2>
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
          מערכת ניהול מלאי חכם
        </h2>
        {userConnected && userConnected}
        <p className="text-center text-xl text-gray-600 mb-6"></p>
        <div className="flex flex-col items-center">
          <GoogleAuth
            setUser={setConnectedUser}
            userConnected={userConnected}
          />
        </div>
      </div>
    </div>
  );
}

export default Login;

// Login.defaultProps = {
//   setConnectedUser: () => {},
//   userConnected: "",
// };

interface Props {
  setConnectedUser: Function;
  userConnected: string;
}
