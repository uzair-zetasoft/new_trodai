"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  DollarSign,
  Frame,
  GalleryVerticalEnd,
  HomeIcon,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { CompanyLogo } from "./company-logo"
import { useSession } from 'next-auth/react'
import { GrSchedule, GrServices } from "react-icons/gr"
import { MdAutoFixNormal } from "react-icons/md"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { data: session } = useSession()

// This is sample data.
const data = {
  user: {
    name: session?.user?.name || "Guest User",
    email: session?.user?.email || "guest@example.com",
    avatar: session?.user?.image || "/default-avatar.png",
  },
  logo: {
    logo: "/trod.png",
    name: "",
    link: "/dashboard/home"
  },
  navMain: [
    {
      title: "Home",
      url: "/dashboard/home",
      icon: HomeIcon,
      isActive: true,
    },
    {
      title: "Publish & Schedule",
      url: "/dashboard/schedule",
      icon: GrSchedule,
    },
    {
      title: "Automated Series",
      url: "/dashboard/automated-series",
      icon: MdAutoFixNormal,
    },
    {
      title: "Services",
      url: "/dashboard/services",
      icon: GrServices,
    },
    {
      title: "Pricing",
      url: "/dashboard/pricing",
      icon: DollarSign,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

  return (
    <Sidebar collapsible="icon" {...props}>
        <div className=" absolute top-5 right-3 hidden sm:block">
        <SidebarTrigger />
        </div>
      <SidebarHeader>
        <CompanyLogo teams={data.logo} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data?.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
