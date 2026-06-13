"use client";

import { useCartStore } from "@/store/useCartStore";
import HydrationGuard from "@/components/shared/HydrationGuard";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCartStore();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const logisticsFee = subtotal > 100 || subtotal === 0 ? 0.0 : 15.0;
  const grandTotal = subtotal + logisticsFee;

  return (
    <div className="grow bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Marketplace
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mt-3">
            Shopping Cart
          </h1>
        </div>

        <HydrationGuard>
          {cart.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center shadow-sm">
              <p className="text-md font-medium text-slate-500">
                Your shopping cart tracking array is currently empty.
              </p>
              <Link
                href="/products"
                className="mt-4 inline-block text-md rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left Side: Items Itemization List */}
              <div className="space-y-4 lg:col-span-2">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-20 flex-shrink-0 rounded-lg bg-slate-100 overflow-hidden border border-slate-100">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={`Thumbnail reference: ${item.name}`}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-[10px] italic text-slate-400">
                            No UI Image
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-lg font-semibold text-emerald-600 mt-0.5">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/*  Counter Adjustment Array */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="rounded p-1 hover:bg-white text-slate-600 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="rounded p-1 hover:bg-white text-slate-600 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={clearCart}
                  className="text-md font-semibold text-rose-500 hover:underline"
                >
                  Clear Entire Cart
                </button>
              </div>

              {/* Right Side:  Order Summary */}
              <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-md space-y-4">
                <h2 className="text-md font-bold uppercase tracking-wider text-slate-400">
                  Order Summary
                </h2>

                <div className="space-y-2 border-b border-slate-100 pb-4 text-md text-slate-600">
                  <div className="flex justify-between">
                    <span>Cart Subtotal</span>
                    <span className="font-semibold text-slate-800">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Logistics Delivery Fee</span>
                    <span className="font-semibold text-slate-800">
                      {logisticsFee === 0
                        ? "FREE"
                        : `$${logisticsFee.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-m font-bold text-slate-900 pt-1">
                  <span>Estimated Total Due:</span>
                  <span className="text-xl font-black text-emerald-600">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full text-center rounded-xl bg-slate-900 py-2 text-lg font-bold text-white hover:bg-slate-800 transition-all shadow-sm"
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </HydrationGuard>
      </div>
    </div>
  );
}
