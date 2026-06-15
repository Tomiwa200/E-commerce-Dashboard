"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { CircleUserRound, Menu, ShoppingCartIcon } from "lucide-react";
import CartItems from "../ui/CartItems";
import { useEffect, useState } from "react";
import { logoutAction } from "@/features/auth/action";

export default function SideNav() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    async function fetchUserSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }
    fetchUserSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const logout = async () => {
    await logoutAction();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="h-auto w-full relative md:fixed md:h-full md:w-55 z-1 top-0 left-0 flex flex-col px-3 py-4 md:py-30 md:px-20 bg-slate-900 text-white">
      <div
        className=" hidden md:flex justify-between space-x-2 
        md:flex-col md:space-x-0 md:space-y-8"
      >
        {user ? (
          <div className="group relative inline-block">
            <Link href="/" className="flex items-center justify-center">
              <CircleUserRound size={33} />
            </Link>
            <button
              onClick={logout}
              className="invisible group-hover:visible absolute bg-white z-1 text-sm font-bold text-slate-900 p-1"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="text-xl font-bold">
            Login
          </Link>
        )}
        <Link className="text-xl font-bold" href="/">
          Home
        </Link>
        <Link className="text-xl font-bold" href="/products">
          Store
        </Link>

        <Link className="relative text-xl font-bold" href="/cart">
          Cart
          <span className="absolute top-0 left-10  text-gray-400 ">
            <ShoppingCartIcon size={35} />
          </span>
          <span
            className="absolute top-0 left-16 text-sm bg-white p-[2px] 
          rounded-full text-slate-600 font-bold"
          >
            <CartItems />
          </span>
        </Link>
        <Link className="text-xl font-bold" href="/admin">
          Admin
        </Link>
      </div>
      <button className="md:hidden">
        <Menu size={30} />
      </button>
    </div>
  );
}
