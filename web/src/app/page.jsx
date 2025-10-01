import Header from "../components/Header";
import TradingGraph from "../components/TradingGraph";
import NewsSection from "../components/NewsSection";
import BottomNavigation from "../components/BottomNavigation";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] pb-20">
      {/* HEADER SECTION */}
      <Header />

      {/* MAIN CONTENT SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-poppins text-[#111827] dark:text-[#E0E0E0] mb-2">
            Pakistan Stock Exchange
          </h1>
          <p className="text-lg font-poppins text-[#6B7280] dark:text-[#A0A0A0]">
            Real-time market data and comprehensive financial insights
          </p>
        </div>

        {/* Trading Graph Section */}
        <TradingGraph />

        {/* News Section */}
        <NewsSection />
      </main>

      {/* Bottom Fixed Navigation */}
      <BottomNavigation />

      {/* Poppins Font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
        .font-poppins {
          font-family: 'Poppins', 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}
