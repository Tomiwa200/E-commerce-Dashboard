"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const CartViewWithNoSSR = dynamic(
  () => import("@/features/cart/components/CartView"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
      </div>
    ),
  },
);

export default function CartPage() {
  return (
    <div className="min-h-screen grow bg-slate-50/50 py-12 px-4 md:px-70">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Marketplace
          </Link>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 mt-3">
            Shopping Cart
          </h1>
        </div>
        <CartViewWithNoSSR />
      </div>
    </div>
  );
}
