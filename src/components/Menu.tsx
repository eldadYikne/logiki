import CloseIcon from "@rsuite/icons/Close";
import { ReactElement } from "react";
import UserBadgeIcon from "@rsuite/icons/UserBadge";
import TextImageIcon from "@rsuite/icons/TextImage";
import CreditCardPlusIcon from "@rsuite/icons/CreditCardPlus";
import FunnelTimeIcon from "@rsuite/icons/FunnelTime";
import ProjectIcon from "@rsuite/icons/Project";
import { NavLink } from "react-router-dom";

export default function Menu({ onCloseMenu, isMenuOpen }: Props) {
  interface MenuLink {
    link: string;
    name: string;
    icon: ReactElement<any, any>;
  }
  const getIconComponent = (key: string) => {
    if (key === "item") {
      return <CreditCardPlusIcon />;
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
    { link: "/", name: "רשימות", icon: getIconComponent("homepage") },
    { link: "/add/item", name: "הוסף פריט", icon: getIconComponent("item") },
    {
      link: "/add/soldier",
      name: "הוסף חייל",
      icon: getIconComponent("soldier"),
    },
    {
      link: "/items-type",
      name: "הוסף קבוצת פריטים",
      icon: getIconComponent("items"),
    },
    {
      link: "/personal-area",
      name: "איזור אישי",
      icon: getIconComponent("personal"),
    },
  ];

  return (
    <div
      className={`transition-all flex flex-col gap-3 ${
        isMenuOpen ? "w-[250px] p-4 slidebar-shadow" : "w-0"
      } sidebar`}
    >
      <div className="w-full flex justify-end">
        <CloseIcon color="blue" onClick={() => onCloseMenu()} />
      </div>
      <div className="flex w-full flex-col gap-4 items-start">
        {links.map((link) => {
          return (
            <NavLink
              key={link.link}
              className={"w-full"}
              onClick={() => onCloseMenu()}
              to={`${link.link}`}
            >
              <div className="flex gap-2 text-xl w-full justify-between hover:bg-slate-100 p-1 rounded-lg ">
                <span>{link.name}</span>
                <span>{link.icon}</span>
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
