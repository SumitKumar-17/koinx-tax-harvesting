import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchCapitalGains, fetchHoldings } from "../api/mockApi";
import type { CapitalGains, Holding } from "../types";

interface HarvestingContextValue {
  holdings: Holding[];
  baseGains: CapitalGains | null;
  afterGains: CapitalGains | null;
  selectedCoins: Set<string>;
  loadingHoldings: boolean;
  loadingGains: boolean;
  errorHoldings: string | null;
  errorGains: string | null;
  toggleHolding: (key: string) => void;
  toggleAll: (checked: boolean) => void;
  allSelected: boolean;
  someSelected: boolean;
}

const HarvestingContext = createContext<HarvestingContextValue | null>(null);

function holdingKey(h: Holding, index: number) {
  return `${h.coin}-${h.coinName}-${index}`;
}

function computeAfterGains(
  base: CapitalGains,
  holdings: Holding[],
  selectedKeys: Set<string>
): CapitalGains {
  let stcgProfits = base.stcg.profits;
  let stcgLosses = base.stcg.losses;
  let ltcgProfits = base.ltcg.profits;
  let ltcgLosses = base.ltcg.losses;

  holdings.forEach((h, i) => {
    if (!selectedKeys.has(holdingKey(h, i))) return;

    if (h.stcg.gain > 0) {
      stcgProfits += h.stcg.gain;
    } else if (h.stcg.gain < 0) {
      stcgLosses += Math.abs(h.stcg.gain);
    }

    if (h.ltcg.gain > 0) {
      ltcgProfits += h.ltcg.gain;
    } else if (h.ltcg.gain < 0) {
      ltcgLosses += Math.abs(h.ltcg.gain);
    }
  });

  return {
    stcg: { profits: stcgProfits, losses: stcgLosses },
    ltcg: { profits: ltcgProfits, losses: ltcgLosses },
  };
}

export function HarvestingProvider({ children }: { children: React.ReactNode }) {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [baseGains, setBaseGains] = useState<CapitalGains | null>(null);
  const [selectedCoins, setSelectedCoins] = useState<Set<string>>(new Set());
  const [loadingHoldings, setLoadingHoldings] = useState(true);
  const [loadingGains, setLoadingGains] = useState(true);
  const [errorHoldings, setErrorHoldings] = useState<string | null>(null);
  const [errorGains, setErrorGains] = useState<string | null>(null);

  useEffect(() => {
    fetchHoldings()
      .then(setHoldings)
      .catch(() => setErrorHoldings("Failed to load holdings."))
      .finally(() => setLoadingHoldings(false));

    fetchCapitalGains()
      .then((res) => setBaseGains(res.capitalGains))
      .catch(() => setErrorGains("Failed to load capital gains."))
      .finally(() => setLoadingGains(false));
  }, []);

  const afterGains =
    baseGains ? computeAfterGains(baseGains, holdings, selectedCoins) : null;

  const allKeys = holdings.map((h, i) => holdingKey(h, i));
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selectedCoins.has(k));
  const someSelected = allKeys.some((k) => selectedCoins.has(k));

  function toggleHolding(key: string) {
    setSelectedCoins((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleAll(checked: boolean) {
    if (checked) {
      setSelectedCoins(new Set(allKeys));
    } else {
      setSelectedCoins(new Set());
    }
  }

  return (
    <HarvestingContext.Provider
      value={{
        holdings,
        baseGains,
        afterGains,
        selectedCoins,
        loadingHoldings,
        loadingGains,
        errorHoldings,
        errorGains,
        toggleHolding,
        toggleAll,
        allSelected,
        someSelected,
      }}
    >
      {children}
    </HarvestingContext.Provider>
  );
}

export function useHarvesting() {
  const ctx = useContext(HarvestingContext);
  if (!ctx) throw new Error("useHarvesting must be used inside HarvestingProvider");
  return ctx;
}

export { holdingKey };
