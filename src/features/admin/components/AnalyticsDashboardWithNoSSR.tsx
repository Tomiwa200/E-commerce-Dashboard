"use client";

import dynamic from "next/dynamic";



  const BarChart = dynamic(
  () => import("@/features/admin/components/AnalyticsDashboard"),
  {
    ssr: false, 
    loading: () => (
      <div className="h-64 w-full animate-pulse rounded-xl bg-slate-200/50 border border-slate-200 flex items-center justify-center text-xs font-semibold text-slate-400">
        Asynchronously chunking charting metrics bundle...
      </div>
    ),
  })

  export default function AnalyticsDashboardWithNoSSR() {
    return (
      <BarChart />
  );
  }
  