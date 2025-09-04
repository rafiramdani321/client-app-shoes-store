"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { SearchForm } from "./search-form";
import { NavigationsSidebar } from "@/data/admin-dashboard";
import {
  NavigationItems,
  NavigationSubItem,
} from "@/types/dashboad.admin.type";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DynamicIcon } from "@/components/dynamic-icon";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { Role } from "@/constants";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const isActivePathname = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Filter navigasi
  const filteredNavigations = React.useMemo(() => {
    return NavigationsSidebar.filter((nav) => {
      if (nav.title === "Role Management" && user?.role !== Role.SUPERADMIN) {
        return false;
      }
      return true;
    });
  }, [user]);

  const renderMenuItem = (
    item: NavigationItems | NavigationSubItem,
    key: string
  ) => {
    if ("href" in item && item.href) {
      const isActive = isActivePathname(item.href);

      return (
        <SidebarMenuButton
          className={cn(isActive ? "bg-muted font-semibold" : "")}
          asChild
        >
          <Link href={item.href}>
            {"iconName" in item && (
              <DynamicIcon name={item.iconName} className="h-4 w-4" />
            )}
            <span>{item.title}</span>
            {"label" in item && <p>test</p>}
          </Link>
        </SidebarMenuButton>
      );
    }

    if ("items" in item && item.items && item.items.length > 0) {
      const hasActiveChild = item.items.some(
        (subItem) =>
          "href" in subItem && subItem.href && isActivePathname(subItem.href)
      );
      return (
        <Collapsible className="group/collapsible" defaultOpen={hasActiveChild}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              className={cn(
                "w-full justify-between [&[data-state=open]>svg]:rotate-180",
                hasActiveChild ? "bg-muted font-semibold" : ""
              )}
            >
              <span className="flex items-center">
                {"iconName" in item && (
                  <DynamicIcon name={item.iconName} className="me-2 h-4 w-4" />
                )}
                <span>{item.title}</span>
                {"label" in item && <p>test</p>}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <SidebarMenuSub>
              {item.items.map((subItem: NavigationSubItem, subIndex) => (
                <SidebarMenuItem
                  key={subItem.href ?? `${item.title}-${subIndex}`}
                >
                  {renderMenuItem(subItem, key)}
                </SidebarMenuItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return null;
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link
          href="/"
          className="uppercase font-secondary font-bold text-xl p-2"
        >
          Shoesstore
        </Link>
        <SearchForm />
      </SidebarHeader>
      <ScrollArea>
        <SidebarContent className="gap-0">
          {filteredNavigations.map((nav) => (
            <SidebarGroup key={nav.title}>
              <SidebarGroupLabel>{nav.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {nav.items.map((item, index) => (
                    <SidebarMenuItem key={item.href ?? `${nav.title}-${index}`}>
                      {renderMenuItem(
                        item,
                        item.href ?? `${nav.title}-${index}`
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </ScrollArea>
      <SidebarRail />
    </Sidebar>
  );
}
