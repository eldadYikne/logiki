import MaiEquipment from "./components/MaiEquipment";
import "./App.css";
import "rsuite/dist/rsuite-no-reset.min.css";
import { initializeApp } from "firebase/app";

import { fill } from "@cloudinary/url-gen/actions/resize";

import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, User, getAuth } from "firebase/auth";
import { useState } from "react";
import Login from "./components/Login";
import { Route, Routes } from "react-router-dom";
import DetailsPreview from "./components/DetailsPreview";
import { Cloudinary } from "@cloudinary/url-gen/index";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyC6QpZcuQDkW7ZvhlXX-2Orke-jmRmyqRA",
  authDomain: "hapakm162.firebaseapp.com",
  projectId: "hapakm162",
  storageBucket: "hapakm162.firebasestorage.app",
  messagingSenderId: "1098687562359",
  appId: "1:1098687562359:web:099ddac151be5ab7927c72",
  measurementId: "G-2Y7H6TZP6Q",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default function App() {
  const [user, setUser] = useState<User>();
  const auth = getAuth();

  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("User email:", user.email);
      setUser(user);
    }
  });
  const provider = new GoogleAuthProvider();
  const cld = new Cloudinary({ cloud: { cloudName: "dwdpgwxqv" } });
  const myImage = cld.image("docs/models");
  myImage.resize(fill().width(250).height(250));

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            user && user.email === "hapakmaog162@gmail.com" ? (
              <MaiEquipment setUser={setUser} user={user} />
            ) : (
              <Login userConnected={""} setConnectedUser={setUser} />
            )
          }
        />
        <Route path="/soldier/:id" element={<DetailsPreview />} />
      </Routes>
    </div>
  );
}
