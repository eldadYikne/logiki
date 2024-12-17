import MaiEquipment from "./components/MaiEquipment";
import "./App.scss";
import "rsuite/dist/rsuite-no-reset.min.css";

import { fill } from "@cloudinary/url-gen/actions/resize";

import { User } from "firebase/auth";
import { useState } from "react";
import Login from "./components/Login";
import { Route, Routes } from "react-router-dom";
import DetailsPreview from "./components/DetailsPreview";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { auth } from "./main";
import AdminPage from "./components/AdminPage";
import Navbar from "./components/Navbar";
import CreateSoldier from "./components/CreateSoldier";
import Footer from "./components/Footer";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase

export default function App() {
  const [user, setUser] = useState<User>();

  auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    }
  });
  const cld = new Cloudinary({ cloud: { cloudName: "dwdpgwxqv" } });
  const myImage = cld.image("docs/models");
  myImage.resize(fill().width(250).height(250));

  return (
    <div className="site-container" dir="rtl">
      <Navbar setUser={setUser} user={user} />
      <div className="content-wrap">
        <Routes>
          <Route
            path="/"
            element={
              !user ? (
                <Login userConnected={""} setConnectedUser={setUser} />
              ) : (
                <MaiEquipment setUser={setUser} user={user} />
              )
            }
          />
          <Route path="/add-soldier" element={<CreateSoldier />} />

          {user && <Route path="/soldier/:id" element={<DetailsPreview />} />}
          {user && <Route path="/admin" element={<AdminPage user={user} />} />}
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
