import MaiEquipment from "./components/MaiEquipment";
import "./App.scss";
import "rsuite/dist/rsuite-no-reset.min.css";

import { fill } from "@cloudinary/url-gen/actions/resize";

import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import { Route, Routes } from "react-router-dom";
import DetailsPreview from "./components/DetailsPreview";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { auth } from "./main";
import AdminPage from "./components/AdminPage";
import Navbar from "./components/Navbar";
import CreateSoldier from "./pages/CreatePage";
import Footer from "./components/Footer";

import PersonalArea from "./components/PersonalArea";

import ItemTypePage from "./pages/ItemTypePage";
import Cart from "./components/Cart";
import SignaNatureModal from "./components/SignaNatureModal";

export default function App() {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

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
      // <PlaceholderParagraph rows={8}>
      //   <Loader center content="loading" />
      // </PlaceholderParagraph>
      <div className="h-screen w-full flex justify-center items-center">
        <div className="loader"></div>
      </div>
    );
  }

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
          <Route path="/add/:type" element={<CreateSoldier />} />
          {user && <Route path="/cart" element={<Cart user={user} />} />}
          <Route path="/items-type" element={<ItemTypePage />} />
          {user && <Route path="/personal-area" element={<PersonalArea />} />}

          {user && <Route path="/details/:id" element={<DetailsPreview />} />}
          {user && <Route path="/admin" element={<AdminPage user={user} />} />}
        </Routes>
      </div>
      {user && <SignaNatureModal user={user} />}
      <Footer />
    </div>
  );
}
