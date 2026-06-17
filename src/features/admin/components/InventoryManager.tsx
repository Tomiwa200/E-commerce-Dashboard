"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProductFormValues,
  createProductSchema,
} from "../schemas/Inventory";
import { ArrowLeft, CheckCheck, CheckCircle, X } from "lucide-react";

export default function InventoryManager() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [productAdded, setAddedProduct] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<createProductFormValues>({
    resolver: zodResolver(createProductSchema),
    mode: "onBlur",
  });

  const {
    data: products = [],
    isPending: products_pending,
    error,
  } = useQuery({
    queryKey: ["admin-inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const {
    mutate: createProduct,
    isPending: create_pending,
    error: create_error,
  } = useMutation({
    mutationFn: async (data: createProductFormValues) => {
      const { name, imageFile, price, stock_quantity, category, description } =
        data;
      let imageUrl = null;

      const file = imageFile[0];

      if (file) {
        const fileExt = file.name.split(".").pop();
        // Generate a unique filename to prevent collisions or overwrite issues
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { data: storageData, error: storageError } =
          await supabase.storage.from("product-images").upload(filePath, file, {
            contentType: file.type,
            upsert: false,
          });

        if (storageError)
          throw new Error(`Storage upload failed: ${storageError.message}`);

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      const { data: productData, error: dbError } = await supabase
        .from("products")
        .insert([
          {
            name,
            description,
            price,
            stock_quantity,
            image_url: imageUrl,
            category,
          },
        ])
        .select()
        .single();

      if (dbError)
        throw new Error(`Database insert failed: ${dbError.message}`);
      return productData;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      reset();
      setAddedProduct(true);
    },
  });

  const onSubmit = (data: createProductFormValues) => {
    createProduct(data);
  };

  if (products_pending)
    return (
      <div className="space-y-3">
        <div className="h-10 w-full animate-pulse bg-slate-200 rounded" />
      </div>
    );

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-slate-50/50">
        <h3 className="text-md md:text-xl font-bold text-slate-800">Stock Directory</h3>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg bg-slate-900  px-2 md:px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
        >
          + Add Custom Product
        </button>
      </div>

      {/* Basic Inventory Table Grid View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/50 font-bold text-slate-500 uppercase tracking-wider">
              <th className="p-4">Product Specs Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock Depth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="p-4 font-medium text-slate-900">
                  {product.name}
                </td>
                <td className="p-4">{product.category || "Unassigned"}</td>
                <td className="p-4 font-semibold text-slate-600">
                  ${Number(product.price).toFixed(2)}
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-bold ${product.stock_quantity > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
                  >
                    {product.stock_quantity} units
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Creation Modal System Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          {productAdded ? (
            <div className="w-full text-center max-w-lg rounded-2xl bg-white py-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="mx-auto mb-3 flex h-15 w-15 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-bold text-xl">
                <CheckCircle size={60} />
              </div>
              <p className="text-lg font-bold text-slate-900">
                New Product added successfully
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 inline-flex rounded-xl gap-2 items-center bg-slate-800 px-4 py-2  font-bold text-white hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back To Dashboard
              </button>
            </div>
          ) : (
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <h4 className="text-lg font-bold text-slate-900 mb-4">
                Add Product Variant
              </h4>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Product Title
                  </label>
                  <input
                    required
                    {...register("name")}
                    className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-slate-400"
                  />
                  {errors.name && (
                    <p className="text-[11px] text-rose-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*" // Restricts input picker to image files only
                    {...register("imageFile")}
                    className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-slate-400"
                  />
                  {errors.imageFile && (
                    <p className="text-[11px] text-rose-500 mt-1">
                      {errors.imageFile.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Unit Price ($)
                    </label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      {...register("price", { valueAsNumber: true })}
                      className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-slate-400"
                    />
                    {errors.price && (
                      <p className="text-[11px] text-rose-500 mt-1">
                        {errors.price.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Stock Count
                    </label>
                    <input
                      required
                      type="number"
                      {...register("stock_quantity", { valueAsNumber: true })}
                      className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-slate-400"
                    />
                    {errors.stock_quantity && (
                      <p className="text-[11px] text-rose-500 mt-1">
                        {errors.stock_quantity.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Market Category
                  </label>
                  <input
                    required
                    {...register("category")}
                    placeholder="Electronics, Apparel, etc."
                    className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-slate-400"
                  />
                </div>
                {errors.category && (
                  <p className="text-[11px] text-rose-500 mt-1">
                    {errors.category.message}
                  </p>
                )}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    {...register("description")}
                    className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-slate-400 resize-none"
                  />
                  {errors.description && (
                    <p className="text-[11px] text-rose-500 mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    {create_pending ? "Adding Product..." : "Save Product"}
                  </button>
                </div>
                {create_error && (
                  <p className="text-[11px] text-rose-500 mt-2">
                    {create_error.message}
                  </p>
                )}
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
