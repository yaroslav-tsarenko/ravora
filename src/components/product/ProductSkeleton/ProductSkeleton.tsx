import styles from "./ProductSkeleton.module.css";

export function ProductSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.image} />
          <div className={styles.content}>
            <div className={styles.category} />
            <div className={styles.name} />
            <div className={styles.nameLine2} />
            <div className={styles.footer}>
              <div className={styles.price} />
              <div className={styles.btn} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
