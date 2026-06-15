"use client";

import { useState, useRef, useEffect } from "react";
import { useCurrency, type Currency } from "@/providers/CurrencyProvider";

const CURRENCIES: { code: Currency; symbol: string; label: string }[] = [
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
];

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = CURRENCIES.find((c) => c.code === currency)!;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Currency"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "rgba(255,255,255,0.8)",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "4px",
          padding: "0.25rem 0.5rem",
          cursor: "pointer",
          transition: "background 0.15s",
        }}
      >
        {current.symbol} {current.code}
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "0.375rem",
            background: "#fff",
            border: "1px solid #DADDE2",
            borderRadius: "6px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            zIndex: 60,
            minWidth: "120px",
            overflow: "hidden",
          }}
        >
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              onClick={() => { setCurrency(c.code); setOpen(false); }}
              style={{
                display: "block",
                width: "100%",
                padding: "0.5rem 0.75rem",
                fontSize: "0.8125rem",
                fontWeight: c.code === currency ? 700 : 500,
                textAlign: "left",
                background: c.code === currency ? "#EBF5FF" : "transparent",
                color: c.code === currency ? "#0072CE" : "#1F2933",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
