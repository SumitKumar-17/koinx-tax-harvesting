import { useHarvesting } from "../context/HarvestingContext";
import CapitalGainsCard from "./CapitalGainsCard";
import SavingsBanner from "./SavingsBanner";

export default function CapitalGainsSection() {
  const { baseGains, afterGains, loadingGains, errorGains } = useHarvesting();

  if (loadingGains) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading capital gains...</p>
        </div>
      </div>
    );
  }

  if (errorGains || !baseGains || !afterGains) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-10 text-center">
        <p className="text-red-500 font-medium">{errorGains ?? "Failed to load data."}</p>
      </div>
    );
  }

  const preRealised =
    (baseGains.stcg.profits - baseGains.stcg.losses) +
    (baseGains.ltcg.profits - baseGains.ltcg.losses);

  const postRealised =
    (afterGains.stcg.profits - afterGains.stcg.losses) +
    (afterGains.ltcg.profits - afterGains.ltcg.losses);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4">
        <CapitalGainsCard gains={baseGains} variant="pre" />
        <CapitalGainsCard gains={afterGains} variant="post" />
      </div>
      <SavingsBanner preRealised={preRealised} postRealised={postRealised} />
    </div>
  );
}
