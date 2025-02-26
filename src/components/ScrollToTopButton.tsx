import { useEffect, useState } from "react";
import SortUpIcon from "@rsuite/icons/SortUp";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    // console.log("window.scrollY", window.scrollY);

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed z-50 bottom-6 flex justify-center items-center right-6 h-10 w-10  bg-blue-500 text-white rounded-full shadow-lg transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <SortUpIcon style={{ fontSize: "20px", fontWeight: "600" }} />
    </button>
  );
};

export default ScrollToTopButton;
