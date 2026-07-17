"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ShoppingBag, Heart, ImageOff, Star } from "lucide-react";
import { PriceDisplay } from "@/components/shared/PriceDisplay/PriceDisplay";
import { useCart } from "@/providers/CartProvider";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  comparePrice?: number | null;
  imageUrl?: string | null;
  category?: string;
  quantity: number;
  rating?: number;
  reviewCount?: number;
}

export function ProductCard({
  id,
  name,
  slug,
  sku,
  price,
  comparePrice,
  imageUrl,
  category,
  quantity,
  rating,
  reviewCount,
}: ProductCardProps) {
  const t = useTranslations("product");
  const { addItem } = useCart();
  const isOnSale = !!(comparePrice && comparePrice > price);
  const discountPct = isOnSale
    ? Math.round(((comparePrice! - price) / comparePrice!) * 100)
    : 0;
  const outOfStock = quantity <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem({
      productId: id,
      name,
      slug,
      sku,
      price,
      quantity: 1,
      imageUrl: imageUrl || null,
      maxQuantity: quantity,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link
      href={`/product/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-line-strong)] hover:shadow-[0_10px_28px_rgba(28,26,23,0.08)]"
    >
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden bg-[#F7F7F7]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-6 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-[1.04] dark:mix-blend-normal"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-[color:var(--color-text-tertiary)]">
            <ImageOff size={26} strokeWidth={1.5} />
            <span className="text-xs">No image</span>
          </div>
        )}

        {/* Discount pill (terracotta) */}
        {isOnSale && (
          <span className="absolute left-3 top-3 inline-flex h-6 items-center rounded-full bg-[color:var(--color-accent)] px-2.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            −{discountPct}%
          </span>
        )}
        {outOfStock && (
          <span className="absolute left-3 top-3 inline-flex h-6 items-center rounded-full bg-[color:var(--color-text)]/85 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            {t("outOfStock")}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)]/85 text-[color:var(--color-text-secondary)] opacity-0 transition-all duration-200 hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] group-hover:opacity-100"
        >
          <Heart size={14} strokeWidth={1.75} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {category && (
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
            {category}
          </span>
        )}
        <h3 className="line-clamp-2 min-h-[2.75em] text-sm font-medium leading-snug text-[color:var(--color-text)] transition-colors group-hover:text-[color:var(--color-primary)]">
          {name}
        </h3>

        {typeof rating === "number" && rating > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-[color:var(--color-text-tertiary)]">
            <div className="flex items-center gap-0.5 text-[color:var(--color-accent)]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  strokeWidth={0}
                  className={i < Math.round(rating) ? "fill-current" : "opacity-25 fill-current"}
                />
              ))}
            </div>
            {typeof reviewCount === "number" && reviewCount > 0 && (
              <span>({reviewCount})</span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <PriceDisplay price={price} comparePrice={comparePrice} size="sm" />
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            aria-label={t("addToCart")}
            className={`inline-flex h-10 shrink-0 items-center gap-1.5 overflow-hidden rounded-full border px-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              outOfStock
                ? "cursor-not-allowed border-[color:var(--color-line)] text-[color:var(--color-text-tertiary)]"
                : "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-hover)]"
            }`}
          >
            <ShoppingBag size={14} strokeWidth={1.75} />
            <span className="hidden max-w-0 whitespace-nowrap opacity-0 transition-[max-width,opacity] duration-200 group-hover:max-w-[7rem] group-hover:opacity-100 sm:inline">
              Add
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
}
