'use client';

import * as React from 'react';

import { GalleryVerticalEnd, ImageIcon, SmileIcon } from 'lucide-react';

import { NavMain } from '@/components/Layout/SideBar/NavMain';
import { NavProjects } from '@/components/Layout/SideBar/NavProjects';
import { Sidebar, SidebarContent, SidebarRail } from '@/components/ui/sidebar';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'space',
      logo: GalleryVerticalEnd,
    },
  ],
  navMain: [
    {
      title: 'Thumbnail Maker',
      url: 'https://thumbnail.ssumi.space/',
      icon: ImageIcon,
      isActive: false,
      items: [
        {
          title: 'Home',
          url: 'https://thumbnail.ssumi.space/',
        },
        {
          title: 'Gallery',
          url: 'https://thumbnail.ssumi.space/gallery',
        },
        {
          title: 'Github',
          url: 'https://github.com/sumi-0011/Thumbnail-Maker',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Maker Contact',
      url: '/maker',
      icon: SmileIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader> */}
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}
