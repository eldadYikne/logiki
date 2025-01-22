import MaiEquipment from "./components/MaiEquipment";
import "./App.scss";
import "rsuite/dist/rsuite-no-reset.min.css";

import { fill } from "@cloudinary/url-gen/actions/resize";

import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import DetailsPreview from "./components/DetailsPreview";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { auth } from "./main";
import AdminPage from "./components/AdminPage";
import Navbar from "./components/Navbar";
import Create from "./pages/Create";
import Footer from "./components/Footer";

import PersonalArea from "./components/PersonalArea";

import Cart from "./components/Cart";
import SignaNatureModal from "./components/SignaNatureModal";
import SoldierProfilePage from "./pages/SoldierProfilePage";
import ErrorPage from "./pages/ErrorPage";
import { getAdminByEmail } from "./service/admin";
import { useDispatch, useSelector } from "react-redux";
import { setAdmin } from "./store/adminSlice";
import HistoryActionsPage from "./pages/HistoryActions";
import { RootState } from "./store/store";
import SentSignaturesPage from "./pages/SentSignaturesPage";
import SinatureSoldierPage from "./pages/SinatureSoldierPage";
import { Message, toaster } from "rsuite";
import { TypeAttributes } from "rsuite/esm/internals/types";
export function toasterApp(text: string, type: TypeAttributes.Status) {
  return toaster.push(
    <Message type={type} showIcon>
      {text}
    </Message>,
    { placement: "topCenter" }
  );
}
export default function App() {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { admin } = useSelector((state: RootState) => state.admin);
  const location = useLocation();

  // console.log("VITE_API_URL", import.meta.env.VITE_API_URL);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        setUser(undefined);
        setLoading(false);
        console.log("!location.pathname", location.pathname);

        if (!location.pathname.includes("/signature/")) {
          navigate("/");
        }
      }
    });

    async function setGlobalAdmin() {
      if (!user) return;
      let adminConnect = await getAdminByEmail("hapak162", user?.email ?? "");
      if (adminConnect) {
        // console.log("adminConnect", adminConnect);
        dispatch(setAdmin(adminConnect));
      }
    }
    console.log("admin upadted from App.tsx");
    setGlobalAdmin();
  }, [user]);

  const cld = new Cloudinary({ cloud: { cloudName: "dwdpgwxqv" } });
  const myImage = cld.image("docs/models");
  myImage.resize(fill().width(250).height(250));

  if (loading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <div className="loader"></div>
      </div>
    );
  }
  // if (!admin && user) {
  //   return (
  //     <div
  //       dir="rtl"
  //       className="flex flex-col h-screen justify-center items-center    w-full"
  //     >
  //       <Login userConnected={""} setConnectedUser={setUser} />
  //       <span className="flex sm:p-10 p-3 mx-3 text-2xl bg-white justify-center items-center rounded-lg text-center">
  //         {`למשתמש ${user.email} אין הרשאה לגשת לאתר זה בפקודה!`}
  //       </span>
  //     </div>
  //   );
  // }

  return (
    <div className="site-container" dir="rtl">
      {admin && (
        <Navbar
          setIsMenuOpen={setIsMenuOpen}
          isMenuOpen={isMenuOpen}
          setUser={setUser}
          user={user}
        />
      )}
      {isMenuOpen && user && admin && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed sm:hidden text-white h-svh w-full gap-2 bg-gray-800 opacity-50 z-20 "
        ></div>
      )}

      <div className="content-wrap">
        <Routes>
          <Route path="/" element={<Navigate to={`/soldiers`} replace />} />
          <Route
            path="/:type"
            element={
              user && admin ? (
                <MaiEquipment />
              ) : (
                <Login userConnected={""} setConnectedUser={setUser} />
              )
            }
          />
          <Route path="/admin-signature" element={<SentSignaturesPage />} />
          <Route
            path="/signature/:signatureId"
            element={<SinatureSoldierPage />}
          />
          <Route path="/soldier-profile" element={<SoldierProfilePage />} />
          <Route path="/actions" element={<HistoryActionsPage />} />
          <Route path="/add/:type" element={<Create />} />
          {user && <Route path="/cart" element={<Cart user={user} />} />}
          {user && <Route path="/personal-area" element={<PersonalArea />} />}

          {user && (
            <Route path="/:type/details/:id" element={<DetailsPreview />} />
          )}
          {user && <Route path="/admin" element={<AdminPage user={user} />} />}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
      {user && <SignaNatureModal user={user} />}
      <Footer />
    </div>
  );
}
