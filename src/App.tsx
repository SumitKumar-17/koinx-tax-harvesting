import "./index.css";
import { HarvestingProvider } from "./context/HarvestingContext";
import Header from "./components/Header";
import CapitalGainsSection from "./components/CapitalGainsSection";
import HoldingsTable from "./components/HoldingsTable";

export default function App() {
  return (
    <HarvestingProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Tax Loss Harvesting
            </h1>
            <p className="text-sm text-gray-500">
              Select holdings below to see how harvesting losses can reduce your tax liability.
            </p>
          </div>
          <CapitalGainsSection />
          <HoldingsTable />
        </main>
      </div>
    </HarvestingProvider>
  );
}
