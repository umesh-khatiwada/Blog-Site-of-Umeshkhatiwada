import SidebarWithContent from '@/app/components/blog/Sidebar';
import Footer from '@/app/components/layout/Footer';
import { ReactNode } from 'react';
import { fetchCategoriesWithSubcategories } from '@/app/lib/api';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Fetch the initial category data
  const initialCategoryId = "yiawv9sx7a0l3qqu0xl6kn7b";
  const initialCategoryData = await fetchCategoriesWithSubcategories(initialCategoryId);

  return (
    <>
      <SidebarWithContent initialCategoryData={initialCategoryData}>
        {children}
        <Footer />
        <br />
      </SidebarWithContent>
    </>
  );
}