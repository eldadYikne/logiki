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
import CreateSoldier from "./components/CreateSoldier";
import Footer from "./components/Footer";
import { Loader } from "rsuite";
import PlaceholderParagraph from "rsuite/esm/Placeholder/PlaceholderParagraph";
import PersonalArea from "./components/PersonalArea";
import SignaNatureModal from "./components/SignaNatureModal";
import ItemTypePage from "./pages/ItemTypePage";

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
      <PlaceholderParagraph rows={8}>
        <Loader center content="loading" />
      </PlaceholderParagraph>
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
          <Route path="/items-type" element={<ItemTypePage />} />
          {user && <Route path="/personal-area" element={<PersonalArea />} />}

          {user && <Route path="/soldier/:id" element={<DetailsPreview />} />}
          {user && <Route path="/admin" element={<AdminPage user={user} />} />}
        </Routes>
      </div>
      {/* {user && <SignaNatureModal user={user} />} */}
      <Footer />
    </div>
  );
}
