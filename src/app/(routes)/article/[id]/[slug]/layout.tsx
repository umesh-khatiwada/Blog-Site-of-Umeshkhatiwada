import SidebarWithContent from '@/app/components/blog/Sidebar';
import Sidebar from '@/app/components/blog/Sidebar';
import Footer from '@/app/components/layout/Footer';
import { ReactNode } from 'react';


export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarWithContent>
      {children}
      <Footer />
      <br />
    </SidebarWithContent>
  );
}
