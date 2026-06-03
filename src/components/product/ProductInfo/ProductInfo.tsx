"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Heart, ShoppingCart, Shield, Truck, RotateCcw, Lock } from "lucide-react";
import { PriceDisplay } from "@/components/shared/PriceDisplay/PriceDisplay";
import { QuantitySelector } from "@/components/shared/QuantitySelector/QuantitySelector";
import { useCart } from "@/providers/CartProvider";
import { useCurrency } from "@/providers/CurrencyProvider";
import { formatPrice } from "@/lib/utils/format-price";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import styles from "./ProductInfo.module.css";

const WARRANTY_OPTIONS = [
  { key: "none", years: 0, percent: 0, min: 0 },
  { key: "1year", years: 1, percent: 10, min: 6.99 },
  { key: "2year", years: 2, percent: 16, min: 9.99 },
  { key: "3year", years: 3, percent: 22, min: 12.99 },
];

// Hide additional warranty for low-priced items where the minimum
// charge would be disproportionate to the product price.
const WARRANTY_MIN_PRODUCT_PRICE = 15;

function calcWarrantyPrice(productPrice: number, option: typeof WARRANTY_OPTIONS[number]): number {
  if (option.percent === 0) return 0;
  return Math.max(productPrice * (option.percent / 100), option.min);
}

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
  const [selectedWarranty, setSelectedWarranty] = useState(0);
  const { addItem } = useCart();
  const { currency, convert } = useCurrency();
  const router = useRouter();

  const outOfStock = stockQuantity <= 0;
  const lowStock = stockQuantity > 0 && stockQuantity <= lowStockAlert;

  const warrantyAvailable = price >= WARRANTY_MIN_PRODUCT_PRICE;
  const warrantyOption = warrantyAvailable ? WARRANTY_OPTIONS[selectedWarranty] : WARRANTY_OPTIONS[0];
  const warrantyPrice = calcWarrantyPrice(price, warrantyOption);
  const totalPrice = price + warrantyPrice;

  const handleAddToCart = () => {
    addItem({
      productId: id,
      name: warrantyOption.years > 0
        ? `${name} + ${warrantyOption.years}yr warranty`
        : name,
      slug,
      sku,
      price: totalPrice,
      quantity: qty,
      imageUrl: imageUrl || null,
      maxQuantity: stockQuantity,
    });
  };

  const handleBuyNow = () => {
    addItem({
      productId: id,
      name: warrantyOption.years > 0
        ? `${name} + ${warrantyOption.years}yr warranty`
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
          <Shield size={14} /> {t("warranty")}
        </span>
        <p style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginBottom: "0.5rem" }}>
          {t("warrantyStandard")}
        </p>
        {warrantyAvailable && (
          <div className={styles.guaranteeOptions}>
            {WARRANTY_OPTIONS.map((opt, idx) => (
              <button
                key={opt.key}
                className={`${styles.guaranteeOption} ${idx === selectedWarranty ? styles.guaranteeOptionActive : ""}`}
                onClick={() => setSelectedWarranty(idx)}
              >
                {idx === 0 ? t("noWarranty") : t(`warrantyOption${opt.years}year` as "warrantyOption1year" | "warrantyOption2year" | "warrantyOption3year")}
                {opt.percent > 0 && (
                  <span className={styles.guaranteePrice}>+{formatPrice(convert(calcWarrantyPrice(price, opt)), currency)}</span>
                )}
              </button>
            ))}
          </div>
        )}
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
          {selectedWarranty > 0 ? t("addToCartWithWarranty") : t("addToCart")}
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
