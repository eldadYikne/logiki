import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../main";

import { Button } from "rsuite";
import { useNavigate } from "react-router-dom";
import { Admin } from "../types/table";
import GoogleAuth from "./GoogleAuth";

export default function PersonalArea() {
  const [user, setUser] = useState<User>();
  // const [admin, setAdmin] = useState<Admin>();
  //   const [loading, setLoading] = useState(true);
  const navigat = useNavigate();
  const userKeyToPreview: Array<keyof Admin> = [
    "email",
    "name",
    "personalNumber",
    "phone",
    "rank",
  ];
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        // console.log("user", user);
      } else {
        setUser(undefined);
      }
    });
  }, []);
  return (
    <div className=" flex items-center w-full py-6 flex-col">
      <div className="flex flex-col gap-3 items-center justify-center">
        <div>
          <img className="rounded-full" src={user?.photoURL ?? ""} alt="" />
        </div>
        <div className="flex flex-col justify-center items-center gap-4 ">
          {user &&
            userKeyToPreview.map((key) => {
              return (
                user[key as keyof User] && (
                  <div key={key}>{String(user[key as keyof User])}</div>
                )
              );
            })}
        </div>
      </div>
      <span onClick={() => navigat("/")}>
        <GoogleAuth
          setUser={() => {}}
          userConnected={user?.displayName ?? ""}
        />
      </span>
      <div className="absolute top-20 left-10">
        {user?.email === "hapakmaog162@gmail.com" && (
          <Button
            onClick={() => {
              navigat("/admin");
            }}
          >
            איזור מנהל
          </Button>
        )}
      </div>
    </div>
  );
}
