import MaiEquipment from "./components/MaiEquipment";
import "./App.scss";
import "rsuite/dist/rsuite-no-reset.min.css";

import { fill } from "@cloudinary/url-gen/actions/resize";

import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import { Navigate, Route, Routes } from "react-router-dom";
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

export default function App() {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        setUser(undefined);
        setLoading(false);
      }
    });
  }, []);
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

  return (
    <div className="site-container" dir="rtl">
      <Navbar
        setIsMenuOpen={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
        setUser={setUser}
        user={user}
      />
      {isMenuOpen && user && (
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
              !user ? (
                <Login userConnected={""} setConnectedUser={setUser} />
              ) : (
                <MaiEquipment setUser={setUser} user={user} />
              )
            }
          />
          <Route path="/soldier-profile" element={<SoldierProfilePage />} />
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
