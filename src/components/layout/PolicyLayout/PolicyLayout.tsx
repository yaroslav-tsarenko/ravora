import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { ReactNode } from "react";
import styles from "./PolicyLayout.module.css";

interface PolicyLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export function PolicyLayout({ title, lastUpdated, children }: PolicyLayoutProps) {
  return (
    <div className={styles.container}>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Policies", href: "/policies" },
          { label: title },
        ]}
      />
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.content}>
        <p className={styles.lastUpdated}>Last updated: {lastUpdated}</p>
        {children}
      </div>
    </div>
  );
}

export function ContactBlock() {
  return (
    <div className={styles.contactBlock}>
      <p>
        <strong>MISARELIANA S.R.L.</strong>
        <br />
        Registration number: 54316682
        <br />
        Registered office: IAŞI, Mun. Iaşi, Str. Fântânilor 43
        <br />
        General email: info@misaelectro.ro
        <br />
        Wholesale (B2B): b2b@misaelectro.ro
      </p>
    </div>
  );
}
