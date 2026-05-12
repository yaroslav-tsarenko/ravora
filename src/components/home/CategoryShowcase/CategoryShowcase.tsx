"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection/AnimatedSection";
import styles from "./CategoryShowcase.module.css";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  _count?: { products: number };
}

interface CategoryShowcaseProps {
  categories: CategoryItem[];
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  const t = useTranslations("home");

  if (categories.length === 0) return null;

  return (
    <AnimatedSection>
      <section className="section-padding">
        <div className={styles.section}>
          <div className={styles.header}>
            <h2 className="section-title">{t("categories")}</h2>
            <p className="section-subtitle" style={{ margin: "0.5rem auto 0" }}>Find exactly what you need</p>
          </div>
          <div className={styles.grid}>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/catalog/${category.slug}`}
                className={styles.card}
              >
                {category.imageUrl && (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                )}
                <div className={styles.cardOverlay} />
                <div className={styles.cardContent}>
                  <h3 className={styles.cardName}>{category.name}</h3>
                  {category._count && (
                    <span className={styles.cardCount}>
                      {category._count.products} products
                    </span>
                  )}
                </div>
                <div className={styles.cardArrow}>
                  <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
