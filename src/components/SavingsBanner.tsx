interface Props {
  preRealised: number;
  postRealised: number;
}

export default function SavingsBanner({ preRealised, postRealised }: Props) {
  const savings = preRealised - postRealised;
  if (savings <= 0) return null;

  return (
    <div className="mt-4 bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex items-center gap-3">
      <span className="text-2xl">🎉</span>
      <p className="text-sm font-semibold text-green-800">
        You&apos;re going to save{" "}
        <span className="text-green-600">
          ₹{savings.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
        </span>{" "}
        in taxes by harvesting losses!
      </p>
    </div>
  );
}
