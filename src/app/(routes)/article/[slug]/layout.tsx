import SidebarWithContent from '@/app/components/blog/Sidebar';
import Footer from '@/app/components/layout/Footer';
import { ReactNode } from 'react';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SidebarWithContent>
        {children}
        <Footer />
        <br />
      </SidebarWithContent>
    </>
  );
}