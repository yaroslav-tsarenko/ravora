"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils/format-price";
import { getProductImage, getProductImageFallback } from "@/lib/utils/product-image";
import { getDiscountPercent, type HomepageProduct } from "@/lib/homepage-products";
import styles from "./DealOfTheDay.module.css";

interface Props {
  product: HomepageProduct;
}

function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s };
}

export function DealOfTheDay({ product }: Props) {
  const [time, setTime] = useState(getTimeUntilMidnight);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeUntilMidnight()), 1000);
    return () => clearInterval(id);
  }, []);

  const discount = getDiscountPercent(product);
  const imgUrl = getProductImage(product.images?.[0]?.url, product.name);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className={styles.section}>
      <div className={styles.textSide}>
        <div className={styles.topRow}>
          <span className={styles.badge}>Deal of the Day</span>
          <div className={styles.timer}>
            <span className={styles.timeBlock}>{pad(time.h)}</span>
            <span className={styles.timeSep}>:</span>
            <span className={styles.timeBlock}>{pad(time.m)}</span>
            <span className={styles.timeSep}>:</span>
            <span className={styles.timeBlock}>{pad(time.s)}</span>
          </div>
        </div>
        <h2 className={styles.title}>{product.name}</h2>
        <p className={styles.subtitle}>
Limited time offer — grab it before the deal expires!
        </p>
        <div className={styles.priceRow}>
          <span className={styles.newPrice}>{formatPrice(Number(product.price))}</span>
          {product.comparePrice && (
            <span className={styles.oldPrice}>{formatPrice(Number(product.comparePrice))}</span>
          )}
          {discount > 0 && <span className={styles.discountTag}>-{discount}%</span>}
        </div>
        <Link href={`/product/${product.slug}`} className={styles.cta}>
          Shop Now <ArrowRight size={16} />
        </Link>
      </div>
      <div className={styles.imageSide}>
        <Image
          src={imgUrl}
          alt={product.name}
          width={240}
          height={200}
          className={styles.productImage}
          onError={(e) => {
            (e.target as HTMLImageElement).src = getProductImageFallback("240x200");
          }}
        />
      </div>
    </section>
  );
}
