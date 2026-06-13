import LeftLandingPage from "@/components/shared/LeftLandingPage";
import AuthForm from "@/features/auth/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      <LeftLandingPage />
      <div className=" min-h-screen w-full md:w-[70%] bg-slate-50 flex items-center justify-center px-4 py-6">
         <AuthForm />
      </div>
      
    </main>
  );
}
