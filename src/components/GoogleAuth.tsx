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
function GoogleAuth(props: Props) {
  const [connectedUser, setConnectedUser] = useState<User>();
  const auth = getAuth();

  // console.log(auth?.currentUser?.email);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.uid;
        // console.log("connected user", user);
        setConnectedUser(user);
        props.setUser(user);
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
      props.setUser(undefined);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex gap-3 justify-center items-center">
      {!props.userConnected && (
        <Button onClick={signInWithGoogle}>
          הכנס באמצעות גוגל
          <span className="px-1">
            <GoogleIcon />
          </span>
        </Button>
      )}

      {props.userConnected && (
        <Button className=" flex gap-1" onClick={logOut}>
          <ExitIcon />
          {props.userConnected}
        </Button>
      )}
    </div>
  );
}

export default GoogleAuth;
GoogleAuth.defaultProps = {
  userConnected: "",
  setUser: () => {},
};

interface Props {
  userConnected: string;
  setUser: Function;
}
