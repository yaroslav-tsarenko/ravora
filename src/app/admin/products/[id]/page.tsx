"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormData } from "@/lib/validators/product";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner/LoadingSpinner";
import { toast } from "sonner";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<ProductFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${id}`).then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([product, cats]) => {
      setCategories(cats);
      reset({
        name: product.name,
        sku: product.sku,
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
        costPrice: product.costPrice ? Number(product.costPrice) : undefined,
        quantity: product.quantity,
        lowStockAlert: product.lowStockAlert,
        weight: product.weight ? Number(product.weight) : undefined,
        status: product.status,
        isFeatured: product.isFeatured,
        trackInventory: product.trackInventory,
        brand: product.brand || "",
        gtin: product.gtin || "",
        mpn: product.mpn || "",
        googleCategory: product.googleCategory || "",
        condition: product.condition || "new",
        metaTitle: product.metaTitle || "",
        metaDescription: product.metaDescription || "",
        categoryIds: product.categories?.map((c: { categoryId: string }) => c.categoryId) || [],
      });
      setFetching(false);
    }).catch(console.error);
  }, [id, reset]);

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Product updated");
    } catch {
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ maxWidth: "48rem" }}
    >
      <h1 className="admin-page-title" style={{ marginBottom: "1.5rem" }}>Edit Product</h1>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div className="admin-form-card">
          <div className="admin-form-section-title">Basic Information</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label className="admin-label">Name *</label>
              <input className="admin-input" {...register("name")} />
              {errors.name && <span className="admin-field-error">{errors.name.message}</span>}
            </div>
            <div>
              <label className="admin-label">SKU *</label>
              <input className="admin-input" {...register("sku")} />
              {errors.sku && <span className="admin-field-error">{errors.sku.message}</span>}
            </div>
            <div>
              <label className="admin-label">Description</label>
              <textarea className="admin-textarea" rows={4} {...register("description")} />
            </div>
            <div>
              <label className="admin-label">Short Description</label>
              <input className="admin-input" {...register("shortDescription")} />
            </div>
          </div>
        </div>

        <div className="admin-form-card">
          <div className="admin-form-section-title">Pricing</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="admin-label">Price *</label>
              <input type="number" step="0.01" className="admin-input" {...register("price")} />
            </div>
            <div>
              <label className="admin-label">Compare Price</label>
              <input type="number" step="0.01" className="admin-input" {...register("comparePrice")} />
            </div>
            <div>
              <label className="admin-label">Cost Price</label>
              <input type="number" step="0.01" className="admin-input" {...register("costPrice")} />
            </div>
          </div>
        </div>

        <div className="admin-form-card">
          <div className="admin-form-section-title">Inventory</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="admin-label">Quantity</label>
              <input type="number" className="admin-input" {...register("quantity")} />
            </div>
            <div>
              <label className="admin-label">Low Stock Alert</label>
              <input type="number" className="admin-input" {...register("lowStockAlert")} />
            </div>
            <div>
              <label className="admin-label">Weight (kg)</label>
              <input type="number" step="0.01" className="admin-input" {...register("weight")} />
            </div>
          </div>
        </div>

        <div className="admin-form-card">
          <div className="admin-form-section-title">Organization</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label className="admin-label">Status</label>
              <select className="admin-select" value={watch("status")} onChange={(e) => setValue("status", e.target.value as "DRAFT" | "ACTIVE" | "ARCHIVED")}>
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div>
              <label className="admin-label">Categories</label>
              <select className="admin-select" style={{ height: "auto", minHeight: "44px" }} multiple value={watch("categoryIds") || []} onChange={(e) => setValue("categoryIds", Array.from(e.target.selectedOptions, (o) => o.value))}>
                {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
              </select>
            </div>
            <div style={{ display: "flex", gap: "2rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--admin-text-secondary)", fontSize: "0.875rem" }}>
                <input type="checkbox" checked={watch("isFeatured")} onChange={(e) => setValue("isFeatured", e.target.checked)} />
                Featured
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--admin-text-secondary)", fontSize: "0.875rem" }}>
                <input type="checkbox" checked={watch("trackInventory")} onChange={(e) => setValue("trackInventory", e.target.checked)} />
                Track Inventory
              </label>
            </div>
          </div>
        </div>

        <div className="admin-form-card">
          <div className="admin-form-section-title">Product Identifiers</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label className="admin-label">Brand</label>
              <input className="admin-input" {...register("brand")} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="admin-label">GTIN</label>
                <input className="admin-input" {...register("gtin")} />
              </div>
              <div>
                <label className="admin-label">MPN</label>
                <input className="admin-input" {...register("mpn")} />
              </div>
            </div>
            <div>
              <label className="admin-label">Google Category</label>
              <input className="admin-input" {...register("googleCategory")} />
            </div>
          </div>
        </div>

        <div className="admin-form-card">
          <div className="admin-form-section-title">SEO</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label className="admin-label">Meta Title</label>
              <input className="admin-input" {...register("metaTitle")} />
            </div>
            <div>
              <label className="admin-label">Meta Description</label>
              <input className="admin-input" {...register("metaDescription")} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          <Button variant="light" onPress={() => router.back()}>Cancel</Button>
          <Button type="submit" color="primary" isLoading={loading}>Save Changes</Button>
        </div>
      </form>
    </motion.div>
  );
}
