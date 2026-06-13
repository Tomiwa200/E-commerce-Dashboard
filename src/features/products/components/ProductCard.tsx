"use client";

import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";

interface ProductProps {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  stock_quantity: number;
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const {cart} = useCartStore();
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      image_url: product.image_url,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
    });
  };

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={`Cover image for product showcase: ${product.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority={false} // Permits native lazy loading strategies for optimized below-the-fold content
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs italic text-slate-400">
            No Image Provided
          </div>
        )}
        {product.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur-sm">
            {product.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-800 line-clamp-1">{product.name}</h3>
          <span className="font-bold text-emerald-600 text-lg">${Number(product.price).toFixed(2)}</span>
        </div>
        <p className="mb-4 text-xs text-slate-500 line-clamp-2 flex-1">
          {product.description || "No description available for this premium option."}
        </p>
        
        <button
          onClick={handleAddToCart}
          disabled={product.stock_quantity <= 0 || cart.findIndex(item => item.id === product.id) > -1 }
          className="w-full rounded-lg bg-slate-900 py-2.5 text-center text-xs font-semibold text-white transition-all hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400"
        >
          {product.stock_quantity > 0 ? "Add to Order" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
