"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

export type Currency = "GBP" | "USD";

interface Rates {
  GBP: number;
  USD: number;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convert: (amountInGbp: number) => number;
  rates: Rates;
}

const DEFAULT_RATES: Rates = { GBP: 1, USD: 1.27 };

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("GBP");
  const [rates, setRates] = useState<Rates>(DEFAULT_RATES);

  useEffect(() => {
    const stored = localStorage.getItem("currency") as Currency | null;
    if (stored && ["GBP", "USD"].includes(stored)) {
      setCurrencyState(stored);
    }
  }, []);

  useEffect(() => {
    fetch("/api/exchange-rates")
      .then((r) => r.json())
      .then((data) => {
        if (data.rates?.USD) {
          setRates({ GBP: 1, USD: data.rates.USD });
        }
      })
      .catch(() => {});
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("currency", c);
  };

  const convert = useCallback(
    (amountInGbp: number) => {
      if (currency === "GBP") return amountInGbp;
      return Math.round(amountInGbp * rates[currency] * 100) / 100;
    },
    [currency, rates]
  );

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, rates }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
