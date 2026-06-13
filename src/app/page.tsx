"use client";

import LeftLandingPage from "@/components/shared/LeftLandingPage";
import {  MoveRight } from "lucide-react";
import Link from "next/link";


export default function Home() {
 
  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      <LeftLandingPage />
      <div className="min-h-screen w-full md:w-[70%] p-6 bg-slate-50 flex flex-col items-center justify-center">
          <div>
             <h4 className="text-xl md:text-3xl font-bold mb-8 text-slate-800 text-center">Welcome Back</h4>
             <Link href="/products" className="bg-gray-100 text-sm md:text-xl font-semibold mb-4 text-slate-800 p-3 md:p-6 shadow-sm hover:shadow-lg rounded-xl flex items-center justify-between" >Proceed to Marketplace 
              <span><MoveRight size={24} className="ml-15  text-slate-800"/></span>
             </Link>
             <Link href="/login" className="bg-gray-100 text-sm md:text-xl  font-semibold text-slate-800 p-3 md:p-6 shadow-sm hover:shadow-lg rounded-xl flex items-center justify-between" >Login to Continue 
              <span><MoveRight size={24} className="ml-15 text-slate-800"/></span>
             </Link>
          </div>

          <div className="mt-20 border-t border-slate-200 w-full md:w-[60%]">
             <p className="text-center mt-4 tracking-widest"> &copy; {new Date().getFullYear()} Built by Tommy </p>
          </div>
      </div>
      
    </main>
  );
}
