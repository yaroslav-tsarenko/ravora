"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Heart, ShoppingCart, Shield, Truck, RotateCcw, Lock } from "lucide-react";
import { PriceDisplay } from "@/components/shared/PriceDisplay/PriceDisplay";
import { QuantitySelector } from "@/components/shared/QuantitySelector/QuantitySelector";
import { useCart } from "@/providers/CartProvider";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import styles from "./ProductInfo.module.css";

const GUARANTEE_OPTIONS = [
  { key: "none", years: 0, priceAdd: 0 },
  { key: "1year", years: 1, priceAdd: 4.99 },
  { key: "2year", years: 2, priceAdd: 9.99 },
  { key: "3year", years: 3, priceAdd: 14.99 },
];

interface ProductInfoProps {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  comparePrice?: number | null;
  quantity: number;
  shortDescription?: string | null;
  description?: string | null;
  brand?: string | null;
  condition: string;
  lowStockAlert: number;
  imageUrl?: string | null;
  ean?: string | null;
  reviewCount?: number;
  avgRating?: number;
  categoryPath?: { name: string; slug: string }[];
}

export function ProductInfo({
  id,
  name,
  slug,
  sku,
  price,
  comparePrice,
  quantity: stockQuantity,
  shortDescription,
  brand,
  condition,
  lowStockAlert,
  imageUrl,
  ean,
  reviewCount = 0,
  avgRating = 0,
}: ProductInfoProps) {
  const t = useTranslations("product");
  const [qty, setQty] = useState(1);
  const [selectedGuarantee, setSelectedGuarantee] = useState(0);
  const { addItem } = useCart();
  const router = useRouter();

  const outOfStock = stockQuantity <= 0;
  const lowStock = stockQuantity > 0 && stockQuantity <= lowStockAlert;

  const guaranteeOption = GUARANTEE_OPTIONS[selectedGuarantee];
  const totalPrice = price + guaranteeOption.priceAdd;

  const handleAddToCart = () => {
    addItem({
      productId: id,
      name: guaranteeOption.years > 0
        ? `${name} + ${guaranteeOption.years}yr guarantee`
        : name,
      slug,
      sku,
      price: totalPrice,
      quantity: qty,
      imageUrl: imageUrl || null,
      maxQuantity: stockQuantity,
    });
    toast.success(t("addToCart"));
  };

  const handleBuyNow = () => {
    addItem({
      productId: id,
      name: guaranteeOption.years > 0
        ? `${name} + ${guaranteeOption.years}yr guarantee`
        : name,
      slug,
      sku,
      price: totalPrice,
      quantity: qty,
      imageUrl: imageUrl || null,
      maxQuantity: stockQuantity,
    });
    router.push("/checkout");
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

  const isOnSale = comparePrice && comparePrice > price;
  const savingsPercent = isOnSale
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;

  return (
    <div className={styles.info}>
      <div>
        <h1 className={styles.name}>{name}</h1>
        <div className={styles.metaRow}>
          <span className={styles.sku}>{t("sku")}: {sku}</span>
          {ean && <span className={styles.sku}>{t("ean")}: {ean}</span>}
          {reviewCount > 0 && (
            <span className={styles.ratingBadge}>
              {"★".repeat(Math.round(avgRating))}{"☆".repeat(5 - Math.round(avgRating))}
              <span className={styles.ratingCount}>({reviewCount})</span>
            </span>
          )}
        </div>
      </div>

      {shortDescription && <p className={styles.shortDesc}>{shortDescription}</p>}

      <hr className={styles.divider} />

      <div className={styles.priceBlock}>
        <PriceDisplay price={price} comparePrice={comparePrice} size="lg" />
        {isOnSale && <span className={styles.saveBadge}>-{savingsPercent}%</span>}
      </div>

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

      <hr className={styles.divider} />

      <div className={styles.guaranteeSection}>
        <span className={styles.guaranteeLabel}>
          <Shield size={14} /> {t("guarantee")}
        </span>
        <div className={styles.guaranteeOptions}>
          {GUARANTEE_OPTIONS.map((opt, idx) => (
            <button
              key={opt.key}
              className={`${styles.guaranteeOption} ${idx === selectedGuarantee ? styles.guaranteeOptionActive : ""}`}
              onClick={() => setSelectedGuarantee(idx)}
            >
              {idx === 0 ? t("noGuarantee") : t(`guaranteeOption${opt.years}year` as "guaranteeOption1year" | "guaranteeOption2year" | "guaranteeOption3year")}
              {opt.priceAdd > 0 && (
                <span className={styles.guaranteePrice}>+€{opt.priceAdd.toFixed(2)}</span>
              )}
            </button>
          ))}
        </div>
      </div>

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
          {selectedGuarantee > 0 ? t("addToCartWithGuarantee") : t("addToCart")}
        </Button>
        <Button
          color="default"
          size="lg"
          onPress={handleBuyNow}
          isDisabled={outOfStock}
          className={styles.buyNowBtn}
        >
          {t("buyNow")}
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
            <span className={styles.detailLabel}>{t("brand")}</span>
            <span className={styles.detailValue}>{brand}</span>
          </div>
        )}
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>{t("condition")}</span>
          <span className={styles.detailValue}>{condition}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>{t("sku")}</span>
          <span className={styles.detailValue}>{sku}</span>
        </div>
        {ean && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t("ean")}</span>
            <span className={styles.detailValue}>{ean}</span>
          </div>
        )}
      </div>

      <div className={styles.trustBadges}>
        <div className={styles.trustBadge}>
          <Truck size={18} className={styles.trustBadgeIcon} />
          <span className={styles.trustBadgeTitle}>{t("freeShipping")}</span>
          <span className={styles.trustBadgeDesc}>{t("freeShippingDesc")}</span>
        </div>
        <div className={styles.trustBadge}>
          <RotateCcw size={18} className={styles.trustBadgeIcon} />
          <span className={styles.trustBadgeTitle}>{t("easyReturns")}</span>
          <span className={styles.trustBadgeDesc}>{t("easyReturnsDesc")}</span>
        </div>
        <div className={styles.trustBadge}>
          <Lock size={18} className={styles.trustBadgeIcon} />
          <span className={styles.trustBadgeTitle}>{t("securePayment")}</span>
          <span className={styles.trustBadgeDesc}>{t("securePaymentDesc")}</span>
        </div>
      </div>
    </div>
  );
}
