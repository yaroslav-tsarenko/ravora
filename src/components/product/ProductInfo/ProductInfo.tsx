"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Heart, ShoppingCart } from "lucide-react";
import { PriceDisplay } from "@/components/shared/PriceDisplay/PriceDisplay";
import { QuantitySelector } from "@/components/shared/QuantitySelector/QuantitySelector";
import { useCart } from "@/providers/CartProvider";
import { toast } from "sonner";
import styles from "./ProductInfo.module.css";

interface ProductInfoProps {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  comparePrice?: number | null;
  quantity: number;
  description?: string | null;
  brand?: string | null;
  condition: string;
  lowStockAlert: number;
  imageUrl?: string | null;
}

export function ProductInfo({
  id,
  name,
  slug,
  sku,
  price,
  comparePrice,
  quantity: stockQuantity,
  description,
  brand,
  condition,
  lowStockAlert,
  imageUrl,
}: ProductInfoProps) {
  const t = useTranslations("product");
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  const outOfStock = stockQuantity <= 0;
  const lowStock = stockQuantity > 0 && stockQuantity <= lowStockAlert;

  const handleAddToCart = () => {
    addItem({
      productId: id,
      name,
      slug,
      sku,
      price,
      quantity: qty,
      imageUrl: imageUrl || null,
      maxQuantity: stockQuantity,
    });
  };

  const handleWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      });
      const data = await res.json();
      if (data.action === "added") {
        toast.success(t("addToWishlist"));
      } else {
        toast.success(t("removeFromWishlist"));
      }
    } catch {
      toast.error("Please log in to use wishlist");
    }
  };

  return (
    <div className={styles.info}>
      <div>
        <h1 className={styles.name}>{name}</h1>
        <p className={styles.sku}>{t("sku")}: {sku}</p>
      </div>

      <PriceDisplay price={price} comparePrice={comparePrice} size="lg" />

      <p
        className={`${styles.stock} ${
          outOfStock ? styles.stockOut : lowStock ? styles.stockLow : styles.stockInStock
        }`}
      >
        {outOfStock
          ? t("outOfStock")
          : lowStock
            ? t("onlyLeft", { count: stockQuantity })
            : t("inStock")}
      </p>

      {description && <p className={styles.description}>{description}</p>}

      <div className={styles.actions}>
        <QuantitySelector
          quantity={qty}
          maxQuantity={stockQuantity}
          onChange={setQty}
        />
        <Button
          color="primary"
          size="lg"
          onPress={handleAddToCart}
          isDisabled={outOfStock}
          startContent={<ShoppingCart size={18} />}
          style={{ flex: 1 }}
        >
          {t("addToCart")}
        </Button>
        <Button
          isIconOnly
          variant="bordered"
          size="lg"
          onPress={handleWishlist}
          aria-label={t("addToWishlist")}
        >
          <Heart size={18} />
        </Button>
      </div>

      <div className={styles.details}>
        {brand && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Brand</span>
            <span className={styles.detailValue}>{brand}</span>
          </div>
        )}
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Condition</span>
          <span className={styles.detailValue}>{condition}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>{t("sku")}</span>
          <span className={styles.detailValue}>{sku}</span>
        </div>
      </div>
    </div>
  );
}
