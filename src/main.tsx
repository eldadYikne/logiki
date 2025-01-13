import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { GoogleAuthProvider, getAuth } from "@firebase/auth";
import { initializeApp } from "@firebase/app";
import { getFirestore } from "@firebase/firestore";
import { Provider } from "react-redux";
import store from "./store/store.ts";

const firebaseConfig = {
  apiKey: "AIzaSyC6QpZcuQDkW7ZvhlXX-2Orke-jmRmyqRA",
  authDomain: "hapakm162.firebaseapp.com",
  projectId: "hapakm162",
  storageBucket: "hapakm162.firebasestorage.app",
  messagingSenderId: "1098687562359",
  appId: "1:1098687562359:web:099ddac151be5ab7927c72",
  measurementId: "G-2Y7H6TZP6Q",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();

export const googleProvider = new GoogleAuthProvider();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
