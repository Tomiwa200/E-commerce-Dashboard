"use client";

import { useProductStore } from "@/store/useProductStore";

const CATEGORIES = ["All", "Electronics", "Fashion", "Home Appliances", "Sports", "Accessories", "Furniture"];

export default function CatalogFilters() {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useProductStore();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6 mb-8">
      <div className="w-full max-w-lg">
        <input
          type="text"
          placeholder="Search catalog products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 mb-4 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
        />
         <div className="flex flex-wrap gap-2">
           {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              selectedCategory === category
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
        
      </div>

      <div className="flex flex-wrap gap-2">
        
      </div>
    </div>
  );
}
