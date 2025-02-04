import { useState } from "react";
import { Button } from "rsuite";
import { Link, useLocation } from "react-router-dom";
import CloseIcon from "@rsuite/icons/Close";
import MenuiIcon from "@rsuite/icons/Menu";

const HomeNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: "בית", path: "/" },
    { name: "שירותים", path: "/services" },
    { name: "המלצות", path: "/testimonials" },
    { name: "צור קשר", path: "/contact" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActiveLink = (path: string) => location.pathname === path;

  return (
    <nav className=" from-blue-500 to-blue-700 p-4 shadow-md text-white">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo & Branding */}
        <div className="flex gap-10 justify-center items-end">
          <Link to="/home" className="text-2xl font-bold">
            LogiSmart{" "}
          </Link>
          <div className="  hidden md:flex  gap-5 justify-center items-center">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`hover:text-blue-200 font-medium ${
                  isActiveLink(link.path) ? "underline text-white" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          <Button
            appearance="primary"
            className="text-white hover:bg-blue-400 hover:text-blue-600 transition"
            onClick={() => (window.location.href = "/login")}
          >
            התחבר
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none text-white"
        >
          {isOpen ? <CloseIcon color="blue" /> : <MenuiIcon color="blue" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="mt-4 space-y-4 md:hidden text-center">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={toggleMenu}
              className={`block py-2 hover:text-blue-300 ${
                isActiveLink(link.path) ? "font-semibold underline" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Button
            appearance="ghost"
            className="w-full mt-2 text-white hover:bg-white hover:text-blue-600"
            onClick={() => (window.location.href = "/login")}
          >
            התחבר
          </Button>
        </div>
      )}
    </nav>
  );
};

export default HomeNavbar;
