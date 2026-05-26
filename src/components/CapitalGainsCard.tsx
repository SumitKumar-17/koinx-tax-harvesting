import type { CapitalGains } from "../types";

interface Props {
  gains: CapitalGains;
  variant: "pre" | "post";
}

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}


export default function CapitalGainsCard({ gains, variant }: Props) {
  const dark = variant === "pre";

  const stcgNet = gains.stcg.profits - gains.stcg.losses;
  const ltcgNet = gains.ltcg.profits - gains.ltcg.losses;
  const realised = stcgNet + ltcgNet;

  const cardClass = dark
    ? "bg-gray-900 text-white"
    : "bg-blue-600 text-white";

  const headingColor = dark ? "text-white" : "text-white";
  const sectionHeadColor = dark ? "text-gray-300" : "text-blue-100";
  const dividerColor = dark ? "border-gray-700" : "border-blue-500";
  const labelColor = dark ? "text-gray-400" : "text-blue-100";
  const valueColor = (val: number) => {
    if (val < 0) return dark ? "text-red-400" : "text-red-200";
    return dark ? "text-green-400" : "text-green-200";
  };

  return (
    <div className={`${cardClass} rounded-2xl p-6 flex-1 min-w-0`}>
      <h2 className={`text-base font-bold mb-5 ${headingColor}`}>
        {variant === "pre" ? "Pre Harvesting" : "After Harvesting"}
      </h2>

      <div className="space-y-4">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${sectionHeadColor}`}>
            Short-Term
          </p>
          <div className={`space-y-1 pb-3 border-b ${dividerColor}`}>
            <div className="flex justify-between">
              <span className={`text-sm ${labelColor}`}>Profits</span>
              <span className={`text-sm font-medium ${valueColor(gains.stcg.profits)}`}>
                {formatINR(gains.stcg.profits)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`text-sm ${labelColor}`}>Losses</span>
              <span className={`text-sm font-medium ${valueColor(-gains.stcg.losses)}`}>
                -{formatINR(gains.stcg.losses)}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className={`text-sm font-semibold ${headingColor}`}>Net Capital Gains</span>
              <span className={`text-sm font-bold ${valueColor(stcgNet)}`}>
                {formatINR(stcgNet)}
              </span>
            </div>
          </div>
        </div>

        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${sectionHeadColor}`}>
            Long-Term
          </p>
          <div className={`space-y-1 pb-3 border-b ${dividerColor}`}>
            <div className="flex justify-between">
              <span className={`text-sm ${labelColor}`}>Profits</span>
              <span className={`text-sm font-medium ${valueColor(gains.ltcg.profits)}`}>
                {formatINR(gains.ltcg.profits)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`text-sm ${labelColor}`}>Losses</span>
              <span className={`text-sm font-medium ${valueColor(-gains.ltcg.losses)}`}>
                -{formatINR(gains.ltcg.losses)}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className={`text-sm font-semibold ${headingColor}`}>Net Capital Gains</span>
              <span className={`text-sm font-bold ${valueColor(ltcgNet)}`}>
                {formatINR(ltcgNet)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-1">
          <span className={`text-sm font-bold ${headingColor}`}>Realised Capital Gains</span>
          <span className={`text-base font-extrabold ${valueColor(realised)}`}>
            {formatINR(realised)}
          </span>
        </div>
      </div>
    </div>
  );
}
