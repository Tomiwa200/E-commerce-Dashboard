"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { CircleUserRound, DivideIcon, Menu, ShoppingCartIcon, X } from "lucide-react";
import CartItems from "../ui/CartItems";
import { useEffect, useState } from "react";
import { logoutAction } from "@/features/auth/action";

export default function SideNav() {
  const supabase = createClient();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
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

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      {/*Sidebar container */}
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
            <span className="absolute top-0 left-10 text-gray-400">
              <ShoppingCartIcon size={35} />
            </span>
            <div
              className="absolute top-0 left-16 w-4 h-4 flex items-center justify-center text-sm font-bold bg-white  
               rounded-full text-slate-600"
            >
              <CartItems />
            </div>
          </Link>
          <Link className="text-xl font-bold" href="/admin">
            Admin
          </Link>
        </div>
        <button className="md:hidden" onClick={toggleMenu}>
          <Menu size={30} />
        </button>
      </div>
      
      
      {/*Mobile drawer overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden"
          onClick={toggleMenu}
        />
      )}
      {/*Mobile drawer container */}
      <div
        className={`fixed top-0 right-0 h-full w-64 z-50 shadow-lg bg-slate-100 text-slate-800
        transform transition-transform duration-300 ease-in-out md:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleMenu}>
            <X size={24} />
          </button>
        </div>
        <div
          className=" flex flex-col p-6 space-y-4"
        >
          {user ? (
              <Link href="/" onClick={logout} >
                <CircleUserRound size={33} />
              </Link>
          ) : (
            <Link href="/login" onClick={toggleMenu} className="text-lg font-bold">
              Login
            </Link>
          )}
          <Link className="text-lg font-bold" href="/" onClick={toggleMenu} >
            Home
          </Link>
          <Link className="text-lg font-bold" href="/products" onClick={toggleMenu} >
            Store
          </Link>

          <Link className="relative text-lg font-bold" href="/cart" onClick={toggleMenu}>
            Cart
            <span className="absolute top-0 left-10 text-slate-800">
              <ShoppingCartIcon size={33} />
            </span>
            <div
              className="absolute top-0 left-16 w-4 h-4 flex items-center justify-center text-sm font-bold bg-white  
               rounded-full text-slate-600"
            >
              <CartItems />
            </div>
          </Link>
          <Link className="text-lg font-bold" href="/admin" onClick={toggleMenu}>
            Admin
          </Link>
        </div>
      </div>
    </>
  );
}
