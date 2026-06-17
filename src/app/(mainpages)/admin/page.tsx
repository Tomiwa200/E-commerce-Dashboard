import InventoryManager from "@/features/admin/components/InventoryManager";
import AnalyticsDashboardWithNoSSR from "@/features/admin/components/AnalyticsDashboardWithNoSSR";

export const dynamic = "force-dynamic";

export default function AdminControlPage() {
  return (
    <main className="min-h-screen grow bg-slate-50/60 py-10 px-6 md:px-70">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Administrative Dashboard</h1>
          <p className="text-sm md:text-md text-slate-500 mt-0.5">Review gross system transaction data patterns and manage live store inventory.</p>
        </header>
        <AnalyticsDashboardWithNoSSR />
        <InventoryManager />
      </div>
    </main>
  );
}
