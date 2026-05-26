import { useState } from "react";
import { useHarvesting, holdingKey } from "../context/HarvestingContext";
import type { Holding } from "../types";

const DEFAULT_VISIBLE = 5;

function formatNumber(n: number, maxFrac = 6) {
  if (Math.abs(n) < 1e-8) return "0";
  return n.toLocaleString("en-IN", { maximumFractionDigits: maxFrac });
}

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);
}

function GainCell({ value, balance }: { value: number; balance: number }) {
  const color = value < 0 ? "text-red-500" : value > 0 ? "text-green-600" : "text-gray-500";
  return (
    <div>
      <p className={`text-sm font-semibold ${color}`}>{formatINR(value)}</p>
      <p className="text-xs text-gray-400">{formatNumber(balance)} units</p>
    </div>
  );
}

function CoinCell({ holding }: { holding: Holding }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <img
        src={holding.logo}
        alt={holding.coin}
        className="w-9 h-9 rounded-full object-cover flex-shrink-0 bg-gray-100"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg";
        }}
      />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{holding.coin}</p>
        <p className="text-xs text-gray-400 truncate max-w-[140px]">{holding.coinName}</p>
      </div>
    </div>
  );
}

export default function HoldingsTable() {
  const { holdings, selectedCoins, toggleHolding, toggleAll, allSelected, someSelected, loadingHoldings, errorHoldings } =
    useHarvesting();
  const [showAll, setShowAll] = useState(false);

  if (loadingHoldings) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading holdings...</p>
        </div>
      </div>
    );
  }

  if (errorHoldings) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-10 text-center">
        <p className="text-red-500 font-medium">{errorHoldings}</p>
      </div>
    );
  }

  const visible = showAll ? holdings : holdings.slice(0, DEFAULT_VISIBLE);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">Holdings</h2>
        <span className="text-xs text-gray-400">{holdings.length} assets</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="pl-6 pr-3 py-3 text-left w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = !allSelected && someSelected;
                  }}
                  onChange={(e) => toggleAll(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                />
              </th>
              {["Asset", "Holdings / Avg Buy Price", "Current Price", "Short-Term Gain", "Long-Term Gain", "Amount to Sell"].map((col) => (
                <th
                  key={col}
                  className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {visible.map((holding, idx) => {
              const key = holdingKey(holding, idx);
              const selected = selectedCoins.has(key);
              return (
                <tr
                  key={key}
                  onClick={() => toggleHolding(key)}
                  className={`cursor-pointer transition-colors ${
                    selected ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="pl-6 pr-3 py-4">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleHolding(key)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                    />
                  </td>
                  <td className="px-3 py-4">
                    <CoinCell holding={holding} />
                  </td>
                  <td className="px-3 py-4">
                    <p className="text-sm text-gray-900">{formatNumber(holding.totalHolding)}</p>
                    <p className="text-xs text-gray-400">{formatINR(holding.averageBuyPrice)}</p>
                  </td>
                  <td className="px-3 py-4">
                    <p className="text-sm font-medium text-gray-900">{formatINR(holding.currentPrice)}</p>
                  </td>
                  <td className="px-3 py-4">
                    <GainCell value={holding.stcg.gain} balance={holding.stcg.balance} />
                  </td>
                  <td className="px-3 py-4">
                    <GainCell value={holding.ltcg.gain} balance={holding.ltcg.balance} />
                  </td>
                  <td className="px-3 py-4">
                    {selected ? (
                      <span className="text-sm font-semibold text-blue-600">
                        {formatNumber(holding.totalHolding)} {holding.coin}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {holdings.length > DEFAULT_VISIBLE && (
        <div className="border-t border-gray-100 px-6 py-3 flex justify-center">
          <button
            onClick={() => setShowAll((v) => !v)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            {showAll ? "View Less" : `View All ${holdings.length} Assets`}
          </button>
        </div>
      )}
    </div>
  );
}
