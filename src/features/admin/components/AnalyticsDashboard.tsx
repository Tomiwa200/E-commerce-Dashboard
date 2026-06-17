"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AnalyticsDashboard() {
  const supabase = createClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("total_amount, created_at, status");
      if (error) throw error;
      return data;
    },
  });

  // Aggregate raw transaction data for analytics charting
  const processGraphData = () => {
    const aggregates: Record<string, number> = {};
    orders.forEach((order) => {
      const date = new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      aggregates[date] = (aggregates[date] || 0) + Number(order.total_amount);
    });
    return Object.entries(aggregates).map(([date, revenue]) => ({ date, revenue }));
  };

  const grossRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  const graphData = processGraphData();

  if (isLoading) return <div className="h-64 animate-pulse rounded-xl bg-white border border-slate-200" />;

  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-1 flex flex-col justify-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Platform Sales</span>
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">${grossRevenue.toFixed(2)}</h3>
        <p className="text-xs text-emerald-600 font-medium mt-1">Total aggregated lifetime order volume</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Daily Sales Velocity</h4>
        <div className="h-48 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#94a3b8" />
              <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" />
              <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} contentStyle={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
              <Bar dataKey="revenue" fill="#0f172a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
