"use client";

import dynamic from "next/dynamic";

// This tells Next.js not to execute this component on the server
const CheckoutWizardWithNoSSR = dynamic(
  () => import("@/features/cart/components/checkoutWizard"),
  { ssr: false }
);

export default function CheckoutForm() {
  return <CheckoutWizardWithNoSSR />;
}