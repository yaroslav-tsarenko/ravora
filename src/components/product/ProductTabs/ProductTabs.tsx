"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./ProductTabs.module.css";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string | null };
}

interface ProductTabsProps {
  description?: string | null;
  characteristics?: Record<string, Record<string, string>> | null;
  reviews: Review[];
}

function countCharacteristics(chars: Record<string, Record<string, string>>): number {
  return Object.values(chars).reduce((sum, group) => sum + Object.keys(group).length, 0);
}

export function ProductTabs({ description, characteristics, reviews }: ProductTabsProps) {
  const t = useTranslations("product");
  const [activeTab, setActiveTab] = useState<"description" | "characteristics" | "reviews">("description");

  const groups = characteristics ? Object.entries(characteristics) : [];
  const totalCharCount = characteristics ? countCharacteristics(characteristics) : 0;
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className={styles.container}>
      <div className={styles.tabList} role="tablist">
        <button
          className={`${styles.tab} ${activeTab === "description" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("description")}
          role="tab"
          aria-selected={activeTab === "description"}
        >
          {t("description")}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "characteristics" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("characteristics")}
          role="tab"
          aria-selected={activeTab === "characteristics"}
        >
          {t("characteristics")}
          {totalCharCount > 0 && (
            <span className={styles.tabBadge}>({totalCharCount})</span>
          )}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "reviews" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("reviews")}
          role="tab"
          aria-selected={activeTab === "reviews"}
        >
          {t("reviews", { count: reviews.length })}
        </button>
      </div>

      <div className={styles.tabContent} role="tabpanel">
        {activeTab === "description" && (
          description ? (
            <div className={styles.description}>
              {description.split("\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <p className={styles.noContent}>-</p>
          )
        )}

        {activeTab === "characteristics" && (
          groups.length > 0 ? (
            <div className={styles.charGrid}>
              {groups.map(([groupName, entries]) => (
                <div key={groupName} className={styles.charGroup}>
                  <h3 className={styles.charGroupTitle}>{groupName}</h3>
                  <table className={styles.characteristicsTable}>
                    <tbody>
                      {Object.entries(entries).map(([key, value]) => (
                        <tr key={key}>
                          <td className={styles.charLabel}>{key}</td>
                          <td className={styles.charValue}>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noContent}>-</p>
          )
        )}

        {activeTab === "reviews" && (
          reviews.length > 0 ? (
            <>
              <div className={styles.ratingSummary}>
                <div className={styles.ratingBig}>
                  <div className={styles.ratingNumber}>{avgRating.toFixed(1)}</div>
                  <div className={styles.ratingStarsBig}>
                    {"★".repeat(Math.round(avgRating))}{"☆".repeat(5 - Math.round(avgRating))}
                  </div>
                  <div className={styles.ratingLabel}>{reviews.length} {t("reviews", { count: reviews.length }).toLowerCase().replace(/\(\d+\)/, "").trim()}</div>
                </div>
              </div>
              <div className={styles.reviewsGrid}>
                {reviews.map((review) => (
                  <div key={review.id} className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewAuthor}>
                        {review.user.name || "Anonymous"}
                      </span>
                      <span className={styles.reviewStars}>
                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                      </span>
                    </div>
                    {review.comment && (
                      <p className={styles.reviewComment}>{review.comment}</p>
                    )}
                    <div className={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className={styles.noContent}>{t("noReviews")}</p>
          )
        )}
      </div>
    </div>
  );
}
