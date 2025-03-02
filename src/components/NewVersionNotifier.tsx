import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../main";

const NewVersionNotifier = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null
  );
  const [latestVersion, setLatestVersion] = useState<string | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((registration) => {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                setWaitingWorker(newWorker);
                setUpdateAvailable(true);
              }
            });
          }
        });
      });
    }

    // Firestore version checking (optional)
    const versionDocRef = doc(db, "appConfig", "version");
    getDoc(versionDocRef).then((docSnap) => {
      if (docSnap.exists()) {
        setLatestVersion(docSnap.data().version);
      }
    });

    return onSnapshot(versionDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setLatestVersion(docSnap.data().version);
      }
    });
  }, []);

  const refreshApp = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  };

  return (
    updateAvailable && (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white p-4 rounded-xl shadow-lg">
        <p className="text-sm">גרסה חדשה קיימת ({latestVersion})!</p>
        <button
          onClick={refreshApp}
          className="mt-2 bg-blue-500 px-4 py-2 rounded text-sm"
        >
          עדכן
        </button>
      </div>
    )
  );
};

export default NewVersionNotifier;
