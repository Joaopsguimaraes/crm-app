"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  IconBriefcase,
  IconBuilding,
  IconChartBar,
  IconCheckbox,
  IconDashboard,
  IconFileDollarFilled,
  IconMessageCircle,
  IconNotebook,
  IconSparkles,
  IconTargetArrow,
  IconUser,
  IconUsers
} from "@tabler/icons-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, ReactElement } from "react";

type NavItem = {
  title: string;
  href: Route;
  icon: ComponentType<{ className?: string }>;
  iconClassName: string;
  badge?: string;
};

const favoriteItems: NavItem[] = [
  {
    title: "Sales Dashboard",
    href: "/customers",
    icon: IconDashboard,
    iconClassName: "bg-amber-100 text-amber-700 ring-amber-200",
    badge: "Dashboard",
  },
];

const workspaceItems: NavItem[] = [
  {
    title: "Companies",
    href: "/customers",
    icon: IconBuilding,
    iconClassName: "bg-blue-100 text-blue-700 ring-blue-200",
  },
  {
    title: "People",
    href: "/customers",
    icon: IconUsers,
    iconClassName: "bg-indigo-100 text-indigo-700 ring-indigo-200",
  },
  {
    title: "Opportunities",
    href: "/customers",
    icon: IconTargetArrow,
    iconClassName: "bg-rose-100 text-rose-700 ring-rose-200",
  },
  {
    title: "Tasks",
    href: "/customers",
    icon: IconCheckbox,
    iconClassName: "bg-teal-100 text-teal-700 ring-teal-200",
  },
  {
    title: "Notes",
    href: "/customers",
    icon: IconNotebook,
    iconClassName: "bg-cyan-100 text-cyan-700 ring-cyan-200",
  },
  {
    title: "Dashboards",
    href: "/customers",
    icon: IconChartBar,
    iconClassName: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  },
  {
    title: "Workflows",
    href: "/customers",
    icon: IconSparkles,
    iconClassName: "bg-orange-100 text-orange-700 ring-orange-200",
  },
];

function AppIcon({
  icon: Icon,
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  className: string;
}): ReactElement {
  return (
    <span
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-sm ring-1",
        className,
      )}
    >
      <Icon className="size-3" />
    </span>
  );
}

function NavMenu({ items }: { items: NavItem[] }): ReactElement {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive = item.title === "Companies" && pathname === item.href;

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={item.title}
              className="h-7 px-2 text-[13px]"
            >
              <Link href={item.href}>
                <AppIcon icon={item.icon} className={item.iconClassName} />
                <span>{item.title}</span>
                {item.badge ? (
                  <span className="ml-auto truncate text-[11px] text-sidebar-foreground/45">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export function AppSidebar(): ReactElement {
  return (
    <Sidebar className="border-r border-sidebar-border/70" collapsible="icon">
      <SidebarHeader className="gap-3 px-3 pt-4">
        <div className="flex items-center gap-2 px-1">
          <span className="flex size-5 items-center justify-center rounded-sm bg-white shadow-xs ring-1 ring-black/10">
            <IconFileDollarFilled className="size-8 text-zinc-950" />
          </span>
          <span className="truncate text-sm font-medium text-sidebar-foreground">CRM</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Favorites</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavMenu items={favoriteItems} />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavMenu items={workspaceItems} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="px-3 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="New chat" className="h-7 px-2 text-[13px]">
              <AppIcon icon={IconMessageCircle} className="bg-white text-zinc-700 ring-zinc-200" />
              <span>New chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Book a demo" className="h-7 px-2 text-[13px]">
              <AppIcon icon={IconBriefcase} className="bg-zinc-950 text-white ring-zinc-800" />
              <span>Book a demo</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Account" className="h-7 px-2 text-[13px]">
              <AppIcon icon={IconUser} className="bg-slate-100 text-slate-700 ring-slate-200" />
              <span>Joao Guimaraes</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
