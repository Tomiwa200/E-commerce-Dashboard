"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutFormValues } from "../schemas/checkout";
import { useCartStore } from "@/store/useCartStore";
import { createClient } from "@/utils/supabase/client";
import { usePaystackPayment } from "react-paystack";
import { ShieldCheck, CreditCard, CheckCheck, CheckCheckIcon, CheckCircle } from "lucide-react";

export default function CheckoutWizard() {
  const supabase = createClient();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);  

  const { cart, clearCart } = useCartStore();
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
  });

  const paystackConfig = {
    reference: `ORD-${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`,
    email: getValues("email") || "guest@customer.com",
    amount: Math.round(totalAmount * 100),
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    currency: "NGN",
  };

  const initializePaystack = usePaystackPayment(paystackConfig);

  const handleNextStep = async () => {
    const fieldsValid = await trigger([
      "fullName",
      "email",
      "address",
      "city",
      "postalCode",
    ]);
    if (fieldsValid) {
      setCurrentStep(2);
    }
  };

  const persistOrderToDatabase = async () => {
    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error } = await supabase.from("orders").insert({
        user_id: user?.id || null,
        total_amount: totalAmount,
        status: "paid",
      });

      if (error) throw error;
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : "Failed to record the order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerPaystackGateway = async () => {
    const isFormValid = await trigger([
      "fullName",
      "email",
      "address",
      "city",
      "postalCode",
    ]);
    if (!isFormValid) {
      setCurrentStep(1);
      return;
    }

    initializePaystack({
      onSuccess: () => {
        persistOrderToDatabase();
      },
    });
  };

  if (cart.length === 0 ) return null;

  return (
    <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="h-5 w-5 text-emerald-600" />
        <h2 className="text-xl font-bold text-slate-900">
          Secure Paystack Checkout
        </h2>
      </div>

      {/* Stepper Indicators */}
      <div className="mb-6 flex justify-between border-b border-slate-100 pb-4 text-xs font-semibold text-slate-400">
        <span className={currentStep >= 1 ? "text-slate-900 font-bold" : ""}>
          1. Delivery & Contact
        </span>
        <span className={currentStep === 2 ? "text-slate-900 font-bold" : ""}>
          2. Payment Confirmation
        </span>
      </div>
      {orderComplete ? (
        <div className="py-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-bold text-xl">
           <CheckCircle size={60} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            Payment Cleared Successfully!
          </h3>
          <p className="text-md text-slate-500 mt-1">
            Your order is logged and marked as paid 
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* STEP 1: LOGISTICS DESIGNATIONS */}
          {currentStep === 1 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Legal Name
                </label>
                <input
                  {...register("fullName")}
                  placeholder="John Doe"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
                {errors.fullName && (
                  <p className="text-[11px] text-rose-500 mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  {...register("email")}
                  placeholder="john@example.com"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
                {errors.email && (
                  <p className="text-[11px] text-rose-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Address
                </label>
                <input
                  {...register("address")}
                  placeholder="123 Main Street"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
                {errors.address && (
                  <p className="text-[11px] text-rose-500 mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    {...register("city")}
                    placeholder="Lagos"
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                  {errors.city && (
                    <p className="text-[11px] text-rose-500 mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    {...register("postalCode")}
                    placeholder="100001"
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                  {errors.postalCode && (
                    <p className="text-[11px] text-rose-500 mt-1">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Dummy inputs to fulfill  zod conditions */}
              <input
                type="hidden"
                value="1111222233334444"
                {...register("cardNumber")}
              />
              <input type="hidden" value="12/30" {...register("cardExpiry")} />
              <input type="hidden" value="123" {...register("cardCvc")} />
            </div>
          )}

          {/* STEP 2: SUMMARY & SECURE PAYMENT REDIRECT GATE */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-800 tracking-wider uppercase mb-2">
                  Order Ledger Summary
                </h4>
                <div className="flex justify-between text-xs text-slate-600 mb-2">
                  <span>Items in Basket:</span>
                  <span className="font-semibold">{cart.length} items</span>
                </div>
                <div className="flex justify-between text-sm text-slate-900 font-bold border-t border-slate-200 pt-2">
                  <span>Total Amount Due:</span>
                  <span className="text-emerald-600">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 flex gap-3 items-start">
                <CreditCard className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Review your information above. Clicking below activates the
                  Paystack overlay directly over this container window.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between gap-3 border-t border-slate-100 pt-4 mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Back
              </button>
            )}

            {currentStep === 1 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="ml-auto rounded-lg bg-slate-900 px-5 py-2 text-xs font-medium text-white hover:bg-slate-800"
              >
                Continue to Payment
              </button>
            ) : (
              <button
                type="button" 
                onClick={triggerPaystackGateway} 
                disabled={isSubmitting}
                className="ml-auto rounded-lg bg-emerald-600 px-6 py-2 text-xs font-bold text-white hover:bg-emerald-500 disabled:bg-slate-200"
              >
                {isSubmitting
                  ? "Logging Order..."
                  : `Pay Securely via Paystack`}
              </button>
            )}
          </div>
          <p>{orderError}</p>
        </div>
      )}
    </div>
  );
}
