"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useProductStore } from "@/store/useProductStore";
import ProductCard from "@/features/products/components/ProductCard";
import CatalogFilters from "@/features/products/components/CatalogFilters";
import ErrorBoundary from "@/components/shared/ErrorBoundary";


export default function ProductsCatalogPage() {
  const supabase = createClient();
  const { searchQuery, selectedCategory } = useProductStore();

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["products-catalog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-rose-500 font-medium">Failed to retrieve product resources.</p>
      </div>
    );
  }

  return (
    <div className="grow bg-slate-50/50 py-12 px-4 md:px-70">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">FavStore Marketplace</h1>
          <p className="mt-1 text-sm text-slate-500">Explore and filter real-time product arrays.</p>
        </header>

        <CatalogFilters />

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-4 h-[380px]" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <p className="text-sm font-medium text-slate-500">No matches found for active sorting definitions.</p>
          </div>
        ) : (
          <ErrorBoundary fallbackMessage="The grid engine met an exception mapping elements from data parameters.">
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          </ErrorBoundary>
          
        )}
      </div>
    </div>
  );
}
