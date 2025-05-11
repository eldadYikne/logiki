import {
  GoogleAuthProvider,
  User,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import GoogleIcon from "@rsuite/icons/Google";
import { useEffect, useState } from "react";
import { Button } from "rsuite";
import ExitIcon from "@rsuite/icons/Exit";
function GoogleAuth({
  setUser = () => {},
  userConnected = "",
  color = undefined,
}: Props) {
  const [connectedUser, setConnectedUser] = useState<User>();
  const auth = getAuth();

  // console.log(auth?.currentUser?.email);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.uid;
        // console.log("connected user", user);
        setConnectedUser(user);
        setUser(user);
      } else {
        console.log("USER FIRBASE NOT FOUND");
      }
    });
    return unsubscribe;
  }, [connectedUser]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);

    // try {
    //   await signInWithRedirect(auth, provider);
    // } catch (err) {
    // }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setConnectedUser(undefined);
      setUser(undefined);
      localStorage.removeItem("logikey-admin");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex gap-3 justify-center items-center">
      {!userConnected && (
        <Button onClick={signInWithGoogle}>
          הכנס באמצעות גוגל
          <span className="px-1">
            <GoogleIcon />
          </span>
        </Button>
      )}

      {userConnected && (
        <Button color={color} className=" flex gap-1" onClick={logOut}>
          <ExitIcon />
          {userConnected}
        </Button>
      )}
    </div>
  );
}

export default GoogleAuth;

interface Props {
  userConnected: string;
  setUser: Function;
  color?: "red" | undefined;
}
