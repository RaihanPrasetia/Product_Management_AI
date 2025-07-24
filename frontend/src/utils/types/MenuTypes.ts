import { IconType } from "react-icons";

export type SubMenuItemType = {
  name: string;
  href: string;
  icon: IconType;
};

export type MenuItemType = {
  name: string;
  href: string;
  icon: IconType;
  subMenu?: SubMenuItemType[];
};
