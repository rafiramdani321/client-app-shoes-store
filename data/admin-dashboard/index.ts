import { DropDownMenuType, NavigationTypes } from "@/types/dashboad.admin.type";

export const dropdownMenuItems: DropDownMenuType[] = [
  {
    title: "Profile",
    href: "/admin/profile",
  },
  {
    title: "Settings",
    href: "/admin/settings",
  },
  {
    title: "Back to home",
    href: "/",
  },
];

export const NavigationsSidebar: NavigationTypes[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Analytics",
        href: "/admin/dashboard/analytics",
        iconName: "User",
      },
      {
        title: "CRM",
        href: "/admin/dashboard/crm",
        iconName: "User",
      },
      {
        title: "Ecommerce",
        href: "/admin/dashboard/ecommerce",
        iconName: "User",
      },
    ],
  },
  {
    title: "Pages",
    items: [
      {
        title: "Profile",
        href: "/admin/pages/profile",
        iconName: "User",
      },
      {
        title: "Products",
        iconName: "ShoppingBasket",
        items: [
          {
            title: "List",
            href: "/admin/pages/products/list",
          },
          {
            title: "Add",
            href: "/admin/pages/products/add",
          },
        ],
      },
      {
        title: "Categories",
        iconName: "Blocks",
        items: [
          {
            title: "List",
            href: "/admin/pages/categories/list",
          },
          {
            title: "Add",
            href: "/admin/pages/categories/add",
          },
        ],
      },
      {
        title: "Sub Categories",
        iconName: "Combine",
        items: [
          {
            title: "List",
            href: "/admin/pages/sub-categories/list",
          },
          {
            title: "Add",
            href: "/admin/pages/sub-categories/add",
          },
        ],
      },
      {
        title: "Sizes",
        iconName: "Proportions",
        items: [
          {
            title: "List",
            href: "/admin/pages/sizes/list",
          },
          {
            title: "Add",
            href: "/admin/pages/sizes/add",
          },
        ],
      },
    ],
  },
];
