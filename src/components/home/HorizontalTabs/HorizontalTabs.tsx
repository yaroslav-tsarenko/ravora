"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import {
  Flame, Apple, Wind, Gift, Smartphone, Gamepad2,
  Lightbulb, Sparkles, Tag, Package, Star, Zap,
} from "lucide-react";
import styles from "./HorizontalTabs.module.css";

const ICON_MAP: Record<string, React.ElementType> = {
  Flame, Apple, Wind, Gift, Smartphone, Gamepad2,
  Lightbulb, Sparkles, Tag, Package, Star, Zap,
};

interface TabData {
  id: string;
  label: string;
  icon?: string | null;
  linkUrl: string;
  color: string;
}

interface Props {
  tabs: TabData[];
}

export function HorizontalTabs({ tabs }: Props) {
  const [active, setActive] = useState(0);

  if (!tabs.length) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        {tabs.map((tab, i) => {
          const Icon = tab.icon ? ICON_MAP[tab.icon] : Tag;
          return (
            <Link
              key={tab.id}
              href={tab.linkUrl}
              className={`${styles.tab} ${i === active ? styles.active : ""}`}
              onClick={() => setActive(i)}
            >
              <Icon size={15} style={{ color: tab.color }} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
