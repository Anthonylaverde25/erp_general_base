"use client"

import * as React from "react"
import { Link, useLocation } from "react-router"
import { ChevronRight, type LucideIcon } from "lucide-react"
import * as icons from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@radix-ui/react-collapsible"

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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    SidebarSeparator,
} from "@/components/ui/sidebar"

import navigationConfig from "@/configs/navigationConfig"
import { FuseNavItemType } from "@fuse/core/FuseNavigation/types/FuseNavItemType"
import useUser from "@auth/useUser"

/**
 * Maps icon string names from navigationConfig (e.g. "lucide:layout-dashboard")
 * to actual Lucide React icon components.
 */
function getIconComponent(iconName?: string): LucideIcon | undefined {
    if (!iconName) return undefined

    // Handle "lucide:icon-name" format
    let name = iconName
    if (name.startsWith("lucide:")) {
        name = name.replace("lucide:", "")
    }
    // Handle "heroicons-outline:cube" format — map to a lucide equivalent
    if (name.startsWith("heroicons-outline:")) {
        name = name.replace("heroicons-outline:", "")
    }

    // Convert kebab-case to PascalCase for Lucide icons
    const pascalCase = name
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")

    return (icons as unknown as Record<string, LucideIcon>)[pascalCase] ?? undefined
}

/**
 * Renders a single navigation item (type=item) as a SidebarMenuButton + Link.
 */
function NavLeafItem({ item }: { item: FuseNavItemType }) {
    const location = useLocation()
    const isActive = item.url ? location.pathname === item.url || location.pathname.startsWith(item.url + "/") : false
    const Icon = getIconComponent(item.icon)

    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                <Link to={item.url || "#"}>
                    {Icon && <Icon />}
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

/**
 * Renders a collapsible navigation item (type=collapse) with sub-items.
 */
function NavCollapseItem({ item }: { item: FuseNavItemType }) {
    const location = useLocation()
    const Icon = getIconComponent(item.icon)

    // Check if any child is active
    const isChildActive = item.children?.some(
        (child) => child.url && (location.pathname === child.url || location.pathname.startsWith(child.url + "/"))
    )

    return (
        <Collapsible defaultOpen={isChildActive} className="group/collapsible">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                        {Icon && <Icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.children?.map((child) => (
                            <NavSubItem key={child.id} item={child} />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
}

/**
 * Renders a sub-menu item inside a collapse.
 */
function NavSubItem({ item }: { item: FuseNavItemType }) {
    const location = useLocation()
    const isActive = item.url ? location.pathname === item.url || location.pathname.startsWith(item.url + "/") : false

    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive}>
                <Link to={item.url || "#"}>
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    )
}

/**
 * The main AppSidebar component that renders the full Shadcn sidebar
 * using the navigation config from the Fuse project.
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { data: user } = useUser()

    // Separate top-level items (dashboard, partners, items) from groups
    const topLevelItems = navigationConfig.filter(
        (item) => item.type === "item"
    )
    const groups = navigationConfig.filter(
        (item) => item.type === "group"
    )

    return (
        <Sidebar collapsible="icon" {...props}>
            {/* Header */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <icons.Building2 className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">ERP</span>
                                    <span className="truncate text-xs">Panel de Control</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarSeparator />

            <SidebarContent>
                {/* Top-level items (Dashboard, Partners, Items) */}
                <SidebarGroup>
                    <SidebarGroupLabel>Principal</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {topLevelItems.map((item) => (
                                <NavLeafItem key={item.id} item={item} />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Groups with collapses */}
                {groups.map((group) => (
                    <SidebarGroup key={group.id}>
                        <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.children?.map((child) => {
                                    if (child.type === "collapse") {
                                        return <NavCollapseItem key={child.id} item={child} />
                                    }
                                    return <NavLeafItem key={child.id} item={child} />
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            {/* Footer with user */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
                                <icons.User className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {(user as any)?.data?.displayName || "Usuario"}
                                </span>
                                <span className="truncate text-xs">
                                    {(user as any)?.data?.email || ""}
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
