"use client";

import { useRef } from "react";
import { Link } from "@/i18n/routing";
import { motion, useInView } from "framer-motion";
import { Package } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  productCount: number;
}

interface Props {
  categories: CategoryItem[];
}

export function CategoryShowcase({ categories }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  if (categories.length === 0) return null;

  return (
    <section ref={ref}>
      <motion.div
        className="mb-8 flex flex-col gap-1 border-b border-[color:var(--color-line)] pb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <span className="eyebrow">Departments</span>
        <h2 className="font-serif text-3xl font-medium tracking-tight text-[color:var(--color-text)] sm:text-[40px]">
          Shop by category
        </h2>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.35, delay: i * 0.05 }}
          >
            <Link
              href={`/catalog/${cat.slug}`}
              className="flex h-full flex-col items-start gap-3 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)] p-4 transition-colors hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-tint)]"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--color-primary-tint)] text-[color:var(--color-primary)]">
                <Package size={20} />
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-semibold text-[color:var(--color-text)]">
                  {cat.name}
                </h3>
                <span className="text-xs text-[color:var(--color-text-tertiary)]">
                  {cat.productCount} products
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
