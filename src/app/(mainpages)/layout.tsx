import SideNav from "@/components/shared/SideNav";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row md:overflow-hidden"> 
      <SideNav />
      {children}
    </div>
  );
}