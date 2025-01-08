import CloseIcon from "@rsuite/icons/Close";
import { ReactElement, useEffect } from "react";
import UserBadgeIcon from "@rsuite/icons/UserBadge";
import TextImageIcon from "@rsuite/icons/TextImage";
import CreditCardPlusIcon from "@rsuite/icons/CreditCardPlus";
import FunnelTimeIcon from "@rsuite/icons/FunnelTime";
import ProjectIcon from "@rsuite/icons/Project";
import { NavLink, useLocation } from "react-router-dom";
import PeoplesIcon from "@rsuite/icons/Peoples";
import PeoplesTargetIcon from "@rsuite/icons/PeoplesTarget";

export default function Menu({ onCloseMenu, isMenuOpen }: Props) {
  interface MenuLink {
    link: string;
    name: string;
    type:
      | "soldiers"
      | "items"
      | "teams"
      | "itemsTypes"
      | "soldier"
      | "item"
      | "personal-area";
    icon: ReactElement<any, any>;
  }
  const location = useLocation();
  useEffect(() => {}, [location.pathname]);
  console.log('location.pathname.split("/")', location.pathname.split("/"));

  const getIconComponent = (key: string) => {
    if (key === "item") {
      return <CreditCardPlusIcon />;
    } else if (key === "soldiers") {
      return <PeoplesIcon />;
    } else if (key === "teams") {
      return <PeoplesTargetIcon />;
    } else if (key === "soldier") {
      return <TextImageIcon />;
    } else if (key === "homepage") {
      return <FunnelTimeIcon />;
    } else if (key === "items") {
      return <ProjectIcon />;
    } else {
      return <UserBadgeIcon />;
    }
  };

  const links: MenuLink[] = [
    {
      type: "soldiers",
      link: "/soldiers",
      name: "חיילים",
      icon: getIconComponent("soldiers"),
    },
    // { link: "/", name: "פריטים", icon: getIconComponent("homepage") },
    {
      type: "soldier",
      link: "/add/soldier",
      name: "הוסף חייל",
      icon: getIconComponent("soldier"),
    },
    {
      type: "item",

      link: "/add/item",
      name: "הוסף פריט",
      icon: getIconComponent("item"),
    },
    {
      type: "teams",

      link: "/add/teams",
      name: "הוסף צוות",
      icon: getIconComponent("teams"),
    },

    {
      type: "itemsTypes",
      link: "/add/itemsTypes",
      name: "קבוצות פריטים",
      icon: getIconComponent("items"),
    },
    {
      type: "personal-area",
      link: "/personal-area",
      name: "איזור אישי",
      icon: getIconComponent("personal"),
    },
  ];

  return (
    <div
      className={`transition-all flex flex-col sm:flex-row gap-3 ${
        isMenuOpen ? "w-[250px]  p-4 slidebar-shadow" : "w-0"
      } sidebar sm:w-full`}
    >
      <div className="w-full flex sm:hidden justify-end">
        <CloseIcon color="blue" onClick={() => onCloseMenu()} />
      </div>
      <div className="flex w-full sm:w-2/3 flex-col gap-4 sm:gap-2 sm:flex-row items-start">
        {links.map((link) => {
          return (
            <NavLink
              key={link.link}
              className={"w-full"}
              onClick={() => onCloseMenu()}
              to={`${link.link}`}
            >
              <div className="flex gap-2 text-xl sm:text-sm w-full justify-between sm:justify-center hover:bg-slate-100 sm:hover:bg-transparent p-1 rounded-lg ">
                <span
                  className={
                    location.pathname.split("/").includes(link.type)
                      ? "font-bold underline"
                      : ""
                  }
                >
                  {link.name}
                </span>
                <span className="sm:hidden">{link.icon}</span>
              </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
interface Props {
  onCloseMenu: Function;
  isMenuOpen: boolean;
}
