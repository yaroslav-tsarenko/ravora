"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check, ShoppingCart } from "lucide-react";
import styles from "./CartToast.module.css";

interface CartToastProps {
  name: string;
  imageUrl?: string | null;
  quantity: number;
}

export function CartToast({ name, imageUrl, quantity }: CartToastProps) {
  return (
    <motion.div
      className={styles.toast}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 350 }}
    >
      <motion.div
        className={styles.checkCircle}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", damping: 15, stiffness: 400 }}
      >
        <Check size={14} strokeWidth={3} />
      </motion.div>

      <div className={styles.imageWrap}>
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill sizes="48px" style={{ objectFit: "contain" }} />
        ) : (
          <ShoppingCart size={20} />
        )}
      </div>

      <div className={styles.textWrap}>
        <span className={styles.title}>Added to cart</span>
        <span className={styles.name}>{name}</span>
        {quantity > 1 && <span className={styles.qty}>Qty: {quantity}</span>}
      </div>
    </motion.div>
  );
}
